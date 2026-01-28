import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
    try {
        const { action, userData } = await request.json()

        // 1. Initialize Supabase with Service Key for Admin Operations
        const supabase = createClient(supabaseUrl, supabaseKey)

        // 2. AUTH GUARD: Verify the requester is actually an admin
        // Extract token from Authorization header
        const authHeader = request.headers.get('Authorization')
        if (!authHeader) {
            return NextResponse.json({ success: false, error: 'Authorization header missing' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user: requester }, error: authCheckError } = await supabase.auth.getUser(token)

        if (authCheckError || !requester) {
            console.error('Admin API: Invalid token session', authCheckError)
            return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 })
        }

        // 3. ROLE CHECK: Verify the requester has admin privileges in the DB
        const { data: requesterProfile } = await supabase
            .from('users')
            .select('role')
            .eq('id', requester.id)
            .single()

        if (!requesterProfile || !['admin', 'kitchen_manager'].includes(requesterProfile.role)) {
            console.warn(`Unauthorized admin action attempted by user ${requester.id} (${requester.email})`)
            return NextResponse.json({ success: false, error: 'Unauthorized: Admin privileges required' }, { status: 403 })
        }

        if (action === 'create') {
            const { name, phone, email, pin, role, parent_name } = userData

            // 1. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email,
                password: pin,
                email_confirm: true,
                user_metadata: { full_name: name }
            })

            if (authError) throw authError

            // 2. Insert into public.users
            const { error: dbError } = await supabase.from('users').insert({
                id: authData.user.id,
                name,
                phone,
                email,
                pin,
                role,
                parent_name: role === 'student' ? parent_name : null
            })

            if (dbError) throw dbError

            return NextResponse.json({ success: true, message: 'User created successfully' })

        } else if (action === 'update') {
            const { id, name, phone, email, pin, role, parent_name } = userData

            // 1. Update Auth User (Email and Password/PIN)
            const updatePayload: any = { email }
            if (pin) updatePayload.password = pin

            const { error: authError } = await supabase.auth.admin.updateUserById(id, updatePayload)
            if (authError) throw authError

            // 2. Update public.users
            const dbPayload: any = {
                name,
                phone,
                email,
                role,
                parent_name: role === 'student' ? parent_name : null
            }
            if (pin) dbPayload.pin = pin

            const { error: dbError } = await supabase
                .from('users')
                .update(dbPayload)
                .eq('id', id)

            if (dbError) throw dbError

            return NextResponse.json({ success: true, message: 'User updated successfully' })

        } else if (action === 'delete') {
            const { id } = userData

            // 1. Delete Auth User
            const { error: authError } = await supabase.auth.admin.deleteUser(id)
            if (authError) throw authError

            // 2. Delete public.users
            const { error: dbError } = await supabase.from('users').delete().eq('id', id)
            if (dbError) throw dbError

            return NextResponse.json({ success: true, message: 'User deleted successfully' })
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })

    } catch (error: any) {
        console.error('Admin user operation error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
