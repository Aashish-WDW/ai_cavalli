'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import Link from 'next/link'

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, role, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login')
            } else if (role !== 'kitchen_manager' && role !== 'admin' && role !== 'staff') {
                router.push('/home') // Redirect unauthorized users
            }
        }
    }, [user, role, isLoading, router])

    if (isLoading || !user) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Kitchen Portal...</div>
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
                <nav style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/kitchen">Orders</Link>
                    <Link href="/kitchen/specials">Specials</Link>
                    <div style={{ width: '1px', background: '#ccc' }}></div>
                    <span style={{ fontWeight: 'bold' }}>{role === 'admin' ? 'Admin' : 'Chef'}</span>
                </nav>
            </header>
            <main style={{ padding: '2rem', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
                {children}
            </main>
        </div>
    )
}
