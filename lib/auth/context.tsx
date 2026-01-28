'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/database/supabase'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

type UserRole = 'student' | 'staff' | 'kitchen_manager' | 'admin' | 'guest'

interface AuthUser {
    id: string
    email: string
    name: string
    role: UserRole
    phone?: string
}

interface AuthContextType {
    user: AuthUser | null
    isLoading: boolean
    signIn: (userData: AuthUser) => void
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        if (typeof window === 'undefined') return null
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try {
                return JSON.parse(storedUser)
            } catch (e) {
                console.error('Failed to parse stored user:', e)
                localStorage.removeItem('user')
            }
        }
        return null
    })

    // If we have a user in localStorage, we can skip the initial loading state
    const [isLoading, setIsLoading] = useState(() => {
        if (typeof window === 'undefined') return true
        return !localStorage.getItem('user')
    })
    const router = useRouter()

    useEffect(() => {
        // Even if we skip initial loading, we should ensure it's false after mount
        setIsLoading(false)

        // Sync with Supabase Auth state
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            if (event === 'SIGNED_IN' && session?.user) {
                // Fetch profile only if necessary
                const { data: profile } = await supabase
                    .from('users')
                    .select('id, email, name, role')
                    .eq('email', session.user.email)
                    .single()

                if (profile) {
                    signIn(profile)
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null)
                localStorage.removeItem('user')
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = (userData: AuthUser) => {
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
    }

    const signOut = async () => {
        // Clear all auth-related localStorage
        localStorage.removeItem('user')
        localStorage.removeItem('guest_name')
        localStorage.removeItem('guest_email')
        localStorage.removeItem('guest_table')
        localStorage.removeItem('guest_num_guests')
        localStorage.removeItem('is_guest_active')

        setUser(null)
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
