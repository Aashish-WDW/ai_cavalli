import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400 }
            )
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Check if user exists first to provide better feedback
        const { data: user } = await supabase
            .from('users')
            .select('role')
            .eq('email', email)
            .maybeSingle()

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Account not found. Please contact administration.' },
                { status: 404 }
            )
        }

        if (user.role === 'guest') {
            return NextResponse.json(
                { success: false, error: 'Guests use OTP login. Please use the Guest Entry portal.' },
                { status: 403 }
            )
        }

        if (email.endsWith('@aicavalli.com')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Self-service reset is not available for accounts without a linked email. Please contact your Administrator to reset your PIN manually.'
                },
                { status: 400 }
            )
        }

        // Trigger Supabase Password Reset
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${new URL(request.url).origin}/reset-pin`
        })

        if (error) {
            console.error('Reset password request error:', error)
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'A password reset link has been sent to your email.'
        })

    } catch (error) {
        console.error('Reset request catch error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
