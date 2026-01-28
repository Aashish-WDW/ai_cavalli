import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateOTP, hashOTP, checkRateLimit, validatePhone } from '@/lib/utils/otp'
import { sendOTP } from '@/lib/utils/gupshup'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
    try {
        const { email, name, phone } = await request.json()

        // Basic Email Validation
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address.' },
                { status: 400 }
            )
        }

        const supabase = createClient(supabaseUrl, supabaseKey)
        const sanitizedPhone = phone?.replace(/\D/g, '').slice(0, 10)

        // Prevent phone overlap: Check if phone is used by Staff or Rider
        if (sanitizedPhone && name) {
            const { data: existingStaffOrRider } = await supabase
                .from('users')
                .select('id, role')
                .eq('phone', sanitizedPhone)
                .in('role', ['staff', 'student'])
                .maybeSingle()

            if (existingStaffOrRider) {
                return NextResponse.json(
                    { success: false, error: 'This phone number is registered to internal personnel. Please use a different number.' },
                    { status: 400 }
                )
            }
        }

        // Check if user exists by email OR phone
        let { data: user } = await supabase
            .from('users')
            .select('id, email, name, role, phone')
            .or(`email.eq.${email}${sanitizedPhone ? `,phone.eq.${sanitizedPhone}` : ''}`)
            .maybeSingle()

        // If user doesn't exist and name is provided, create/update guest user
        if (name) {
            if (!sanitizedPhone) {
                return NextResponse.json(
                    { success: false, error: 'Phone number is required for registration.' },
                    { status: 400 }
                )
            }

            if (user) {
                // If user exists but is a guest, ensure record is up to date
                if (user.role === 'guest') {
                    console.log(`Updating existing guest user: ${name} (${email})`)
                    const { data: updatedUser } = await supabase
                        .from('users')
                        .update({ name, email, phone: sanitizedPhone })
                        .eq('id', user.id)
                        .select('id, email, name, role, phone')
                        .single()
                    if (updatedUser) user = updatedUser
                }
            } else {
                // Create new guest user
                console.log(`Creating new guest user: ${name} (${email}, ${sanitizedPhone})`)
                const { data: newUser, error: createError } = await supabase
                    .from('users')
                    .insert({
                        email,
                        name,
                        phone: sanitizedPhone,
                        role: 'guest'
                    })
                    .select('id, email, name, role, phone')
                    .single()

                if (createError) {
                    console.error('Guest registration failed:', createError)
                    return NextResponse.json(
                        { success: false, error: `Registration failed: ${createError.message}.` },
                        { status: 500 }
                    )
                }
                if (newUser) user = newUser
            }
        }

        // If still no user, request name for registration
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'New user detected. Please provide your name.', needsRegistration: true },
                { status: 404 }
            )
        }

        // Use Supabase Auth for Magic Link delivery
        const { error: authError } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true, // This will create an auth user if not exists
                emailRedirectTo: `${new URL(request.url).origin}/auth/callback`,
                data: {
                    full_name: user.name
                }
            }
        })

        if (authError) {
            console.error('Supabase Auth OTP error:', authError)
            return NextResponse.json(
                { success: false, error: 'Failed to send verification email. Please try again.' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'A verification code has been sent to your email',
            expiresIn: 300,
            userName: user.name
        })

    } catch (error) {
        console.error('Send OTP error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error. Please try again.' },
            { status: 500 }
        )
    }
}


