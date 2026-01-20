'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GuestBottomNav } from '@/components/layout/GuestBottomNav'
import { Loading } from '@/components/ui/Loading'

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        // Skip check for the login page itself
        if (pathname === '/guest/login') {
            setIsAuthorized(true)
            return
        }

        const guestName = localStorage.getItem('guest_name')
        const guestPhone = localStorage.getItem('guest_phone')

        if (!guestName || !guestPhone) {
            router.push('/guest/login')
        } else {
            setIsAuthorized(true)
        }
    }, [pathname, router])

    if (!isAuthorized) {
        return <Loading fullScreen message="Checking your reservation..." />
    }

    return (
        <div style={{ paddingBottom: '80px' }}>
            {children}
            {pathname !== '/guest/login' && <GuestBottomNav />}
        </div>
    )
}
