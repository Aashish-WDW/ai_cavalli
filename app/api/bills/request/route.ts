import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Request Bill API
 * 
 * Creates a bill request notification that appears on the kitchen display.
 * The waiter will manually deliver the printed bill to the guest.
 * Does NOT end the session - guest can still add orders if they change their mind.
 */
export async function POST(request: NextRequest) {
    try {
        const { sessionId, userId } = await request.json()

        if (!sessionId) {
            return NextResponse.json(
                { success: false, error: 'Session ID is required' },
                { status: 400 }
            )
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Fetch session with orders
        const { data: session, error: sessionError } = await supabase
            .from('guest_sessions')
            .select(`
                *,
                orders (
                    id,
                    total,
                    status,
                    created_at,
                    order_items (
                        id,
                        quantity,
                        price,
                        menu_items (name)
                    )
                )
            `)
            .eq('id', sessionId)
            .eq('status', 'active')
            .single()

        if (sessionError || !session) {
            return NextResponse.json(
                { success: false, error: 'Active session not found' },
                { status: 404 }
            )
        }

        // Calculate total from orders
        const orders = session.orders || []
        const totalAmount = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)

        // Update session with bill_requested flag
        await supabase
            .from('guest_sessions')
            .update({
                bill_requested: true,
                bill_requested_at: new Date().toISOString(),
                total_amount: totalAmount
            })
            .eq('id', sessionId)

        // Create a notification entry for kitchen display
        // We'll use the existing orders table with a special status or create a notification
        // For simplicity, we'll create a bill_requests table entry if it exists,
        // otherwise we'll rely on realtime subscription for guest_sessions

        // Since kitchen already subscribes to orders, we can add a system message
        // or just let the kitchen component check for bill_requested sessions

        return NextResponse.json({
            success: true,
            message: 'Bill request sent to kitchen. A waiter will bring your bill shortly.',
            session: {
                id: session.id,
                guestName: session.guest_name,
                tableName: session.table_name,
                totalAmount: totalAmount,
                orderCount: orders.length
            }
        })

    } catch (error) {
        console.error('Bill request error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to request bill' },
            { status: 500 }
        )
    }
}
