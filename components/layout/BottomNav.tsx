'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Menu, ShoppingCart, Clock, User } from 'lucide-react'
import clsx from 'clsx'
import styles from './BottomNav.module.css'

const tabs = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Menu', href: '/menu', icon: Menu },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Profile', href: '/profile', icon: User },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className={styles.nav}>
            {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = pathname.startsWith(tab.href)
                return (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={clsx(styles.link, isActive && styles.active)}
                    >
                        <div className={styles.iconWrapper}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={styles.label}>{tab.name}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
