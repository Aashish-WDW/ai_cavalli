'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { BottomNav } from '@/components/layout/BottomNav'

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                // No authenticated user - redirect to login
                router.push('/login')
            } else if (user.role === 'kitchen_manager' || user.role === 'admin') {
                // Kitchen/admin users should use kitchen portal
                router.push('/kitchen')
            }
            // Students, staff, and guests can access customer portal
        }
    }, [user, isLoading, router])

    if (!user && isLoading) {
        return <div className="loading-screen" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)',
            color: 'var(--text-muted)'
        }}>Loading...</div>
    }

    if (!user) return null

    return (
        <div style={{ paddingBottom: '80px' }}>
            {children}
            <BottomNav />
        </div>
    )
}
