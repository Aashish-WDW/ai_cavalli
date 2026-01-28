import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
    try {
        const { guestName, guestEmail, tableName, numGuests, userId } = await request.json()

        if (!guestName || !guestEmail || !tableName || !userId) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: guestName, guestEmail, tableName, userId' },
                { status: 400 }
            )
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // AUTH GUARD: Verify requester matches the userId and email
        const authHeader = request.headers.get('Authorization')
        if (!authHeader) {
            return NextResponse.json({ success: false, error: 'Authorization header missing' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user: requester }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !requester || requester.id !== userId || requester.email !== guestEmail) {
            console.warn(`Session start blocked: Requester ${requester?.id} attempted to start session for ${guestEmail}`)
            return NextResponse.json({ success: false, error: 'Unauthorized: Account mismatch or invalid session' }, { status: 403 })
        }

        // Check for existing active session for this email
        const { data: existingSession } = await supabase
            .from('guest_sessions')
            .select('*')
            .eq('guest_email', guestEmail)
            .eq('status', 'active')
            .maybeSingle()

        if (existingSession) {
            // Update userId if it's currently null but provided
            if (!existingSession.user_id && userId) {
                await supabase
                    .from('guest_sessions')
                    .update({ user_id: userId })
                    .eq('id', existingSession.id)
            }

            return NextResponse.json({
                success: true,
                session: existingSession,
                message: 'Active session already exists'
            })
        }

        // Create new session
        const { data: session, error } = await supabase
            .from('guest_sessions')
            .insert({
                guest_name: guestName,
                guest_email: guestEmail,
                table_name: tableName,
                num_guests: parseInt(numGuests?.toString() || '1') || 1,
                user_id: userId,
                status: 'active',
                total_amount: 0
            })
            .select()
            .single()

        if (error) {
            console.error('Session creation error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to create session' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            session: session,
            message: 'Session created successfully'
        })

    } catch (error) {
        console.error('Session start error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
