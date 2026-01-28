'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import Link from 'next/link'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login')
            } else if (user.role !== 'admin') {
                router.push('/home')
            }
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin Portal...</div>
    }

    if (!user) {
        return null
    }

    return (
        <div className="admin-layout">
            <header style={{
                background: '#2c2c2c',
                color: 'white',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'white' }}>Admin Portal</h1>
                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link href="/admin" style={{ color: 'white', textDecoration: 'none' }}>Analytics</Link>
                    <Link href="/admin/menu" style={{ color: 'white', textDecoration: 'none' }}>Menu</Link>
                    <Link href="/admin/cms" style={{ color: 'white', textDecoration: 'none' }}>CMS</Link>
                    <Link href="/kitchen" style={{ color: '#aaa', textDecoration: 'none' }}>Kitchen View</Link>
                    <div style={{ width: '1px', height: '20px', background: '#555' }}></div>
                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{user.name}</span>
                </nav>
            </header>
            <main style={{ padding: '2rem', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
                {children}
            </main>
        </div>
    )
}
