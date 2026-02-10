'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import Link from 'next/link'

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login')
            } else if (user.role !== 'kitchen_manager' && user.role !== 'admin' && user.role !== 'staff') {
                router.push('/home') // Redirect unauthorized users
            }
        }
    }, [user, isLoading, router])

    if (!isHydrated || isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Kitchen Portal...</div>
    }

    if (!user) {
        return null
    }

    return (
        <div className="kitchen-layout">
            <header style={{
                background: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Kitchen Portal</h1>
                <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/kitchen">Orders</Link>
                    <Link href="/kitchen/specials">Specials</Link>
                    <div style={{ width: '1px', height: '20px', background: '#ccc' }}></div>
                    <span style={{ fontWeight: 'bold' }}>
                        {user.name} ({user.role === 'admin' ? 'Admin' : user.role === 'kitchen_manager' ? 'Manager' : 'Chef'})
                    </span>
                </nav>
            </header>
            <main style={{ padding: '2rem', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
                {children}
            </main>
        </div>
    )
}
