'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/context/CartContext'
import { supabase } from '@/lib/database/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function GuestCartPage() {
    const { items, removeFromCart, updateQuantity, total, clearCart } = useCart()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [tableName, setTableName] = useState('')
    const [readyIn, setReadyIn] = useState('15')
    const [notes, setNotes] = useState('')

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !phone || !tableName) return
        setLoading(true)

        try {
            const guestInfo = { name, phone }

            // Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: null, // Guest
                    guest_info: guestInfo,
                    table_name: tableName,
                    status: 'pending',
                    total: total,
                    ready_in_minutes: parseInt(readyIn),
                    notes: notes
                })
                .select()
                .single()

            if (orderError) throw orderError

            // Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                menu_item_id: item.itemId,
                quantity: item.quantity,
                price: item.price
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            clearCart()
            router.push(`/guest/status?orderId=${order.id}`)
        } catch (err) {
            console.error(err)
            alert('Failed to place order')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                <h1>Checkout</h1>
                <p style={{ margin: '1rem 0' }}>Your cart is empty.</p>
                <Button onClick={() => router.push('/guest/menu')}>Browse Menu</Button>
            </div>
        )
    }

    return (
        <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Link href="/guest/menu" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                    <ChevronLeft size={28} />
                </Link>
                <h1 style={{ margin: 0, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>Guest Checkout</h1>
            </div>

            {/* Cart Items List (Same as Customer - ideally refactor to Component) */}
            <div style={{ marginBottom: '2rem' }}>
                {items.map(item => (
                    <div key={item.itemId} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--surface)',
                        padding: '1rem',
                        marginBottom: '0.5rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                            <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${item.price.toFixed(2)}</p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button onClick={() => updateQuantity(item.itemId, -1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #ccc' }}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.itemId, 1)} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #ccc' }}>+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.itemId)} style={{ color: 'red', border: 'none', background: 'none' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                background: 'var(--surface)',
                padding: '1.5rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Input
                        label="Phone Number"
                        placeholder="1234567890"
                        required
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                    <Input
                        label="Table / Room Number"
                        placeholder="e.g. Table 5"
                        required
                        value={tableName}
                        onChange={e => setTableName(e.target.value)}
                    />

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Ready In</label>
                        {/* ... Ready In Options ... */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['15', '30', '60'].map(min => (
                                <button
                                    key={min}
                                    type="button"
                                    onClick={() => setReadyIn(min)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: readyIn === min ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        background: readyIn === min ? 'rgba(192, 39, 45, 0.05)' : 'white',
                                        color: readyIn === min ? 'var(--primary)' : 'inherit',
                                        fontWeight: readyIn === min ? 'bold' : 'normal'
                                    }}
                                >
                                    {min} Mins
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Notes (Optional)"
                        placeholder="e.g. No salt..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />

                    <Button type="submit" isLoading={loading} size="lg" style={{ marginTop: '1rem' }}>
                        Place Order
                    </Button>
                </form>
            </div>
        </div>
    )
}
