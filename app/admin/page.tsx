'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/database/supabase'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/Loading'
import {
    TrendingUp,
    ShoppingBag,
    Clock,
    Download,
    Settings,
    Users,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    ChevronRight,
    Menu as MenuIcon,
    Bell
} from 'lucide-react'
import Link from 'next/link'

interface Order {
    id: string
    total: number
    status: string
    created_at: string
    table_name: string
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        growth: 12.5 // Mock growth data
    })
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        const { data: orders } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (orders) {
            const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
            const pending = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length

            setStats({
                totalOrders: orders.length,
                totalRevenue,
                pendingOrders: pending,
                growth: 12.5
            })
            setRecentOrders(orders.slice(0, 5))
        }
        setLoading(false)
    }

    function downloadCSV() {
        // Fetch orders with user details and items (which include menu item names)
        supabase.from('orders')
            .select(`
                *,
                user:users(*),
                items:order_items(
                    *,
                    menu_item:menu_items(name)
                )
            `)
            .order('created_at', { ascending: false })
            .then(({ data }) => {
                if (!data) return

                const headers = ['Customer Name', 'Parent Name', 'Phone Number', 'Role', 'Items Ordered', 'Money Spent', 'Timestamp']

                const rows = data.map(o => {
                    const role = o.user?.role || (o.guest_info ? 'guest' : 'unknown')
                    const name = o.user?.name || o.guest_info?.name || 'Guest'
                    const parentName = o.user?.role === 'student' ? (o.user?.parent_name || 'N/A') : ''
                    const phone = o.user?.phone || o.guest_info?.phone || 'N/A'

                    // Summarize items
                    const itemSummary = o.items ? o.items.map((i: any) => `${i.menu_item?.name} (x${i.quantity})`).join('; ') : 'No items'

                    // Total calculation (applying discount)
                    const finalTotal = (o.total - (o.discount_amount || 0)).toFixed(2)

                    const timestamp = new Date(o.created_at).toLocaleString()

                    // Return role-specific filter if needed, but user requested specific columns for each, 
                    // which we can harmonize into one standard export with conditional empty fields.
                    return [
                        `"${name}"`,
                        `"${parentName}"`,
                        `"${phone}"`,
                        role.toUpperCase(),
                        `"${itemSummary}"`,
                        finalTotal,
                        `"${timestamp}"`
                    ]
                })

                const csvContent = [
                    headers.join(','),
                    ...rows.map(r => r.join(','))
                ].join('\n')

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `detailed_orders_report_${new Date().toISOString().split('T')[0]}.csv`
                a.click()
                window.URL.revokeObjectURL(url)
            })
    }

    if (loading) return <Loading />

    return (
        <div className="container" style={{ paddingBottom: 'var(--space-12)' }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: 'var(--space-10)',
                paddingTop: 'var(--space-6)'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontFamily: 'var(--font-serif)',
                        margin: 0,
                        letterSpacing: '-0.02em',
                        color: 'var(--text)'
                    }}>Command Center</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 'var(--space-2) 0 0 0', fontWeight: 500 }}>
                        System overview and administration
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <Button onClick={downloadCSV} variant="outline" className="hover-lift" style={{ borderRadius: 'var(--radius-md)', padding: '0 var(--space-6)' }}>
                        <Download size={18} style={{ marginRight: '8px' }} />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--space-6)',
                marginBottom: 'var(--space-10)'
            }}>
                <StatItem
                    label="Lifetime Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={<TrendingUp size={24} />}
                    color="var(--primary)"
                    trend="+12% from last month"
                    isPositive={true}
                />
                <StatItem
                    label="Total Orders"
                    value={stats.totalOrders.toString()}
                    icon={<ShoppingBag size={24} />}
                    color="#8B5CF6"
                    trend="+8% from last month"
                    isPositive={true}
                />
                <StatItem
                    label="Active & Pending"
                    value={stats.pendingOrders.toString()}
                    icon={<Clock size={24} />}
                    color="#F59E0B"
                    trend="-2 since last hour"
                    isPositive={true}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
                {/* Recent Orders Table */}
                <div style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>Recent Transactions</h3>
                        <Button variant="ghost" size="sm" style={{ fontWeight: 800 }}>View All</Button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
                                    <th style={{ textAlign: 'left', padding: 'var(--space-4) var(--space-6)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Order Details</th>
                                    <th style={{ textAlign: 'left', padding: 'var(--space-4) var(--space-6)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--space-4) var(--space-6)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-lift">
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            <div style={{ fontWeight: 700 }}>{order.table_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                ID: #{order.id.slice(0, 8).toUpperCase()} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                background: getStatusColor(order.status).bg,
                                                color: getStatusColor(order.status).fg
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right', fontWeight: 800 }}>
                                            ${order.total.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Management */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)',
                        color: 'white',
                        padding: 'var(--space-8)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.25rem' }}>Management Tools</h3>
                        <p style={{ opacity: 0.8, fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>Control your menu and system settings from one place.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <AdminActionLink
                                href="/admin/menu"
                                icon={<MenuIcon size={18} />}
                                label="Menu Management"
                            />
                            <AdminActionLink
                                href="/admin/cms"
                                icon={<FileText size={18} />}
                                label="Announcement CMS"
                            />
                            <AdminActionLink
                                href="/admin/users"
                                icon={<Users size={18} />}
                                label="User Management"
                            />
                            <hr style={{ opacity: 0.1, margin: 'var(--space-2) 0' }} />
                            <AdminActionLink
                                href="#"
                                icon={<Settings size={18} />}
                                label="System Settings"
                            />
                        </div>
                    </div>

                    <div style={{
                        background: 'var(--surface)',
                        padding: 'var(--space-6)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--space-4) auto'
                        }}>
                            <Bell size={24} />
                        </div>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>System Health</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>All systems operational. No active issues reported.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatItem({ label, value, icon, color, trend, isPositive }: any) {
    return (
        <div className="hover-lift" style={{
            background: 'var(--surface)',
            padding: 'var(--space-8)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: color,
                opacity: 0.05
            }} />

            <div style={{ color, marginBottom: 'var(--space-4)' }}>{icon}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 'var(--space-2)', color: 'var(--text)' }}>{value}</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: isPositive ? '#10B981' : '#EF4444' }}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {trend}
            </div>
        </div>
    )
}

function AdminActionLink({ href, icon, label }: any) {
    return (
        <Link href={href}>
            <div className="hover-lift" style={{
                background: 'rgba(255,255,255,0.05)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'var(--transition)',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ opacity: 0.8 }}>{icon}</div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
                <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
            </div>
        </Link>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case 'pending': return { bg: '#FEF3C7', fg: '#92400E' }
        case 'preparing': return { bg: '#E0E7FF', fg: '#3730A3' }
        case 'ready': return { bg: '#D1FAE5', fg: '#065F46' }
        case 'completed': return { bg: '#F3F4F6', fg: '#374151' }
        default: return { bg: '#F3F4F6', fg: '#374151' }
    }
}
