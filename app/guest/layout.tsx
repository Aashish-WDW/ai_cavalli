'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { GuestBottomNav } from '@/components/layout/GuestBottomNav'

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            // No authenticated user - redirect to login
            router.push('/login')
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>
    }

    if (!user) {
        return null
    }

    return (
        <div style={{ paddingBottom: '80px' }}>
            {children}
            <GuestBottomNav />
        </div>
    )
}
