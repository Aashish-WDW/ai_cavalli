'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/database/supabase'
import { Button } from '@/components/ui/button'
import { KeyRound, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react'
import styles from '../login/page.module.css'

export default function ResetPinPage() {
    const router = useRouter()
    const [pin, setPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isSessionActive, setIsSessionActive] = useState(false)

    useEffect(() => {
        // Check if we have a recovery session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setIsSessionActive(true)
            } else {
                // Not a valid recovery session
                setError('Invalid or expired reset session. Please request a new link.')
            }
        }
        checkSession()
    }, [])

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (pin.length < 6) {
            setError('PIN must be at least 6 digits.')
            return
        }

        if (pin !== confirmPin) {
            setError('PINs do not match.')
            return
        }

        setLoading(true)

        try {
            // 1. Update Supabase Auth Password
            const { error: authError } = await supabase.auth.updateUser({
                password: pin
            })

            if (authError) throw authError

            // 2. Update Public User PIN for consistency (optional but recommended for legacy)
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { error: dbError } = await supabase
                    .from('users')
                    .update({ pin })
                    .eq('id', user.id)

                if (dbError) console.error('Failed to sync PIN to public table:', dbError)
            }

            setSuccess(true)
            setTimeout(() => router.push('/login'), 3000)
        } catch (err: any) {
            setError(err.message || 'Failed to update PIN')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <main className={styles.main}>
                <div className={styles.overlay} />
                <div className={styles.contentWrapper}>
                    <div className={`${styles.authCard} animate-reveal`} style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <CheckCircle2 size={64} color="#10B981" style={{ margin: '0 auto' }} />
                        </div>
                        <h2 className={styles.cardTitle}>PIN Updated</h2>
                        <p className={styles.cardSubtitle}>Your security profile has been refreshed.</p>
                        <p style={{ marginTop: '2rem', opacity: 0.7 }}>Redirecting to login...</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.main}>
            <div className={styles.overlay} />
            <div className={styles.contentWrapper}>
                <div className={`${styles.authCard} animate-reveal`}>
                    <button onClick={() => router.push('/login')} className={styles.backArrow}>
                        <ArrowLeft size={20} />
                    </button>

                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Reset Secure PIN</h2>
                        <p className={styles.cardSubtitle}>Establish your new 6-digit access code</p>
                    </div>

                    {!isSessionActive && error ? (
                        <div style={{ textAlign: 'center' }}>
                            <div className={styles.errorBanner}>{error}</div>
                            <Button onClick={() => router.push('/login')} style={{ marginTop: '1rem' }}>
                                Back to Login
                            </Button>
                        </div>
                    ) : (
                        <form className={styles.premiumForm} onSubmit={handleReset}>
                            <div className={styles.inputGroup}>
                                <label>NEW PIN</label>
                                <input
                                    type="password"
                                    placeholder="000000"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    autoFocus
                                    maxLength={6}
                                    style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.2rem' }}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>CONFIRM NEW PIN</label>
                                <input
                                    type="password"
                                    placeholder="000000"
                                    value={confirmPin}
                                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    maxLength={6}
                                    style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.2rem' }}
                                />
                            </div>

                            {error && <div className={styles.errorBanner}>{error}</div>}

                            <Button
                                type="submit"
                                className={styles.actionButton}
                                isLoading={loading}
                                disabled={pin.length < 6 || pin !== confirmPin}
                            >
                                <ShieldCheck size={18} style={{ marginRight: '8px' }} />
                                UPDATE ACCESS PIN
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    )
}
