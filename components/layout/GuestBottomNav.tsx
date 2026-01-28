'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingCart, UtensilsCrossed, User } from 'lucide-react'

export function GuestBottomNav() {
    const pathname = usePathname()

    const navItems = [
        { href: '/guest/home', icon: Home, label: 'Home' },
        { href: '/guest/menu', icon: UtensilsCrossed, label: 'Menu' },
        { href: '/guest/cart', icon: ShoppingCart, label: 'Cart' },
        { href: '/profile', icon: User, label: 'Profile' }, // Changed from /guest/status to /profile
    ]

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            padding: '0.75rem 0',
            display: 'flex',
            justifyContent: 'space-around',
            zIndex: 1000,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}>
            {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href
                return (
                    <Link
                        key={href}
                        href={href}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            textDecoration: 'none',
                            fontSize: '0.75rem',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'all 0.2s ease',
                            padding: '0.25rem 1rem'
                        }}
                    >
                        <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        <span>{label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}