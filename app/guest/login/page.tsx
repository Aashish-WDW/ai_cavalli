'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { UserCircle, Mail, Hash, Users, ArrowLeft } from 'lucide-react'
import styles from './page.module.css'
import { useAuth } from '@/lib/auth/context'

export default function GuestLoginPage() {
    const router = useRouter()
    const { signIn } = useAuth()
    const [step, setStep] = useState<'details' | 'otp'>('details')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [tableName, setTableName] = useState('')
    const [numGuests, setNumGuests] = useState('1')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const ITALIAN_RED = '#A91E22';

    const handleGetOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!email.includes('@')) {
            setError('Please enter a valid email address')
            setLoading(false)
            return
        }

        try {
            // Save info for session
            localStorage.setItem('guest_name', name.trim())
            localStorage.setItem('guest_email', email.trim())
            localStorage.setItem('guest_phone', phone.trim())
            localStorage.setItem('guest_table', tableName.trim())
            localStorage.setItem('guest_num_guests', numGuests)
            localStorage.setItem('is_guest_active', 'true')

            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim()
                })
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Failed to send OTP')
            }

            setStep('otp')
        } catch (error: any) {
            console.error('OTP error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp: otp.trim() })
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Invalid code')
            }

            signIn(data.user)
            router.replace('/home')
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.overlay} />

            <div className={styles.contentWrapper}>
                <div className={`${styles.authCard} animate-reveal`}>
                    <button onClick={() => router.push('/login')} className={styles.backArrow}>
                        <ArrowLeft size={20} />
                    </button>

                    <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span className={styles.overline}>Benvenuto</span>
                        <h2 className={styles.cardTitle}>Guest Check-in</h2>
                        <p className={styles.cardSubtitle}>
                            {step === 'details' ? 'Ai Cavalli • Private Dining' : 'Check your email for the magic link'}
                        </p>
                    </header>

                    {step === 'details' ? (
                        <form onSubmit={handleGetOTP} className={styles.premiumForm}>
                            <div className={styles.inputGroup}>
                                <label>FULL NAME</label>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="text"
                                        placeholder="Giacomo Puccini"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                    <UserCircle size={16} className={styles.inputIcon} color={ITALIAN_RED} />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>EMAIL ADDRESS</label>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    <Mail size={16} className={styles.inputIcon} color={ITALIAN_RED} />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>PHONE NUMBER</label>
                                <div className={styles.inputContainer}>
                                    <input
                                        type="tel"
                                        placeholder="0123456789"
                                        required
                                        value={phone}
                                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    />
                                    <Hash size={16} className={styles.inputIcon} color={ITALIAN_RED} />
                                </div>
                            </div>

                            <div className={styles.gridRow}>
                                <div className={styles.inputGroup}>
                                    <label>TABLE NO.</label>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="text"
                                            placeholder="A1"
                                            required
                                            value={tableName}
                                            onChange={e => setTableName(e.target.value)}
                                        />
                                        <Hash size={16} className={styles.inputIcon} color={ITALIAN_RED} />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>GUESTS</label>
                                    <div className={styles.inputContainer}>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={numGuests}
                                            onChange={e => setNumGuests(e.target.value)}
                                        />
                                        <Users size={16} className={styles.inputIcon} color={ITALIAN_RED} />
                                    </div>
                                </div>
                            </div>

                            {error && <div className={styles.errorBanner} style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>{error}</div>}

                            <Button
                                type="submit"
                                isLoading={loading}
                                className={styles.actionButton}
                            >
                                GET OTP TO EMAIL
                            </Button>
                        </form>
                    ) : (
                        <div className={styles.premiumForm} style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: 'rgba(var(--primary-rgb), 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem auto'
                                }}>
                                    <Mail size={32} color={ITALIAN_RED} className="animate-pulse" />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>Link Sent!</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    We've sent a magic login link to <strong>{email}</strong>.<br />
                                    Click the link in the email to access your table.
                                </p>
                            </div>

                            <Button
                                onClick={() => window.open('mailto:' + email, '_blank')}
                                className={styles.actionButton}
                            >
                                OPEN EMAIL INBOX
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep('details')}
                                style={{
                                    marginTop: '1.5rem',
                                    color: 'var(--primary)',
                                    opacity: 0.8,
                                    fontSize: '0.85rem',
                                    textAlign: 'center',
                                    width: '100%'
                                }}
                            >
                                Back to details
                            </button>
                        </div>
                    )}

                    <p className={styles.disclaimer} style={{ marginTop: '2rem' }}>
                        Authentic Italian Excellence <br />
                        Est. 1994
                    </p>
                </div>
            </div>
        </main>
    )
}
