'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sanitizePhone } from '@/lib/utils/phone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserCircle, Phone, Hash, Users, ChevronRight, Utensils } from 'lucide-react'

export default function GuestLoginPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [tableName, setTableName] = useState('')
    const [numGuests, setNumGuests] = useState('1')
    const [loading, setLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const finalPhone = sanitizePhone(phone)

        if (finalPhone.length < 10) {
            alert('Please enter a valid 10-digit phone number')
            setLoading(false)
            return
        }

        // Save to localStorage
        localStorage.setItem('guest_name', name.trim())
        localStorage.setItem('guest_phone', finalPhone)
        localStorage.setItem('guest_table', tableName.trim())
        localStorage.setItem('guest_num_guests', numGuests)
        localStorage.setItem('is_guest_active', 'true')

        // Small delay for effect
        setTimeout(() => {
            router.push('/guest/home')
        }, 800)
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(rgba(24df, 243, 238, 0.9), rgba(24df, 243, 238, 0.9)), url("https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80")',
            backgroundSize: 'cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '440px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: '32px',
                padding: '2.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'var(--primary)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                        transform: 'rotate(-5deg)',
                        boxShadow: '0 12px 24px rgba(192, 39, 45, 0.3)',
                        border: '2px solid white'
                    }}>
                        <Utensils size={36} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2.4rem', color: 'var(--text)', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>
                        Guest Check-in
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        Ai Cavalli • Authentic Italian
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <UserCircle size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 44px',
                                borderRadius: '14px',
                                border: '1px solid #e2e8f0',
                                outline: 'none',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            required
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 44px',
                                borderRadius: '14px',
                                border: '1px solid #e2e8f0',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Hash size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                            <input
                                type="text"
                                placeholder="Table #"
                                required
                                value={tableName}
                                onChange={e => setTableName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 44px',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Users size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                            <input
                                type="number"
                                placeholder="Guests"
                                required
                                min="1"
                                value={numGuests}
                                onChange={e => setNumGuests(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 44px',
                                    borderRadius: '14px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>

                    <Button type="submit" isLoading={loading} size="lg" style={{
                        marginTop: '1rem',
                        height: '56px',
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        boxShadow: '0 8px 16px rgba(192, 39, 45, 0.2)'
                    }}>
                        Enter Dining Room
                        <ChevronRight size={20} style={{ marginLeft: '8px' }} />
                    </Button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.5'
                }}>
                    By continuing, you agree to our service terms.<br />
                    We use your phone number to track your orders.
                </p>
            </div>
        </div>
    )
}
