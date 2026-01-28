import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyOTP, validatePhone, validateOTPFormat } from '@/lib/utils/otp'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json()

        // Basic validation
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address' },
                { status: 400 }
            )
        }

        if (!validateOTPFormat(otp)) {
            return NextResponse.json(
                { success: false, error: 'Invalid code format. Must be 6 digits.' },
                { status: 400 }
            )
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Verify with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'email'
        })

        if (authError) {
            console.error('Supabase Auth verification error:', authError)
            return NextResponse.json(
                { success: false, error: authError.message || 'Invalid or expired code.' },
                { status: 401 }
            )
        }

        // Get user details from public.users
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email, name, role')
            .eq('email', email)
            .single()

        if (!user) {
            // This shouldn't happen if auth succeeded, but handle just in case
            return NextResponse.json(
                { success: false, error: 'Profile not found. Please contact administration.' },
                { status: 404 }
            )
        }

        // Return user data (frontend will handle session storage)
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            message: 'Login successful!'
        })

    } catch (error) {
        console.error('Verify OTP error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error. Please try again.' },
            { status: 500 }
        )
    }
}
