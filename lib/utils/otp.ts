import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Hash OTP using bcrypt
 */
export async function hashOTP(otp: string): Promise<string> {
    return bcrypt.hash(otp, 10)
}

/**
 * Verify OTP against hash
 */
export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
    return bcrypt.compare(otp, hash)
}

/**
 * Check rate limiting for OTP requests
 * Max 3 OTPs per 10 minutes per phone number
 */
export async function checkRateLimit(phone: string): Promise<boolean> {
    const supabase = createClient(supabaseUrl, supabaseKey)

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

    const { count, error } = await supabase
        .from('otp_codes')
        .select('*', { count: 'exact', head: true })
        .eq('phone', phone)
        .gte('created_at', tenMinutesAgo)

    if (error) {
        console.error('Rate limit check error:', error)
        return false
    }

    return (count || 0) < 3
}

/**
 * Validate phone number format
 * Must be exactly 10 digits
 */
export function validatePhone(phone: string): boolean {
    return /^\d{10}$/.test(phone)
}

/**
 * Validate OTP format
 * Must be exactly 6 digits
 */
export function validateOTPFormat(otp: string): boolean {
    return /^\d{6}$/.test(otp)
}
