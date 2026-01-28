/**
 * Gupshup WhatsApp API Integration
 * 
 * Send WhatsApp messages via Gupshup API
 */

export async function sendWhatsAppBill(
    session: any,
    orders: any[],
    totalAmount: number
): Promise<{ success: boolean; messageId?: string; error?: string }> {

    const message = formatBillMessage(session, orders, totalAmount)
    return sendWhatsAppMessage(session.guest_phone, message)
}

function formatBillMessage(session: any, orders: any[], totalAmount: number): string {
    const startTime = new Date(session.started_at).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })

    const endTime = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })

    let message = `🍽️ ${process.env.RESTAURANT_NAME || 'AI CAVALLI RESTAURANT'}\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    message += `Hello ${session.guest_name}! 👋\n\n`
    message += `Thank you for dining with us!\n\n`
    message += `📋 *Session Summary*\n`
    message += `Table: ${session.table_name}\n`
    message += `Started: ${startTime}\n`
    message += `Ended: ${endTime}\n\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    message += `📦 *Your Orders*\n\n`

    orders.forEach((order: any, index: number) => {
        const orderTime = new Date(order.created_at).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        message += `*Order #${index + 1}* (${orderTime})\n`

        if (order.order_items && order.order_items.length > 0) {
            order.order_items.forEach((item: any) => {
                const itemName = item.menu_items?.name || 'Unknown Item'
                const itemTotal = (item.quantity * item.price).toFixed(2)
                message += `• ${itemName} x${item.quantity} - ₹${itemTotal}\n`
            })
        }

        const orderTotal = parseFloat(order.total).toFixed(2)
        message += `Subtotal: ₹${orderTotal}\n\n`
    })

    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    message += `💰 *Bill Summary*\n`
    message += `Items Total: ₹${totalAmount.toFixed(2)}\n`

    // Calculate total discount
    const totalDiscount = orders.reduce((sum, order) => sum + (parseFloat(order.discount_amount) || 0), 0)
    if (totalDiscount > 0) {
        message += `Discount: ₹${totalDiscount.toFixed(2)}\n`
    }

    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`
    message += `*TOTAL: ₹${totalAmount.toFixed(2)}*\n\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

    // Add UPI payment link if configured
    if (process.env.UPI_ID) {
        const upiId = process.env.UPI_ID
        const restaurantName = encodeURIComponent(process.env.RESTAURANT_NAME || 'AI CAVALLI')
        const upiLink = `upi://pay?pa=${upiId}&pn=${restaurantName}&am=${totalAmount.toFixed(2)}&cu=INR`
        message += `💳 *Pay Now via UPI*\n`
        message += `${upiLink}\n\n`
        message += `Or scan QR code at the counter.\n\n`
    }

    message += `Thank you! Visit again! 🙏`

    return message
}

/**
 * Send a simple WhatsApp message
 */
export async function sendWhatsAppMessage(
    phone: string,
    message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {

    if (!process.env.GUPSHUP_API_KEY || !process.env.GUPSHUP_PHONE_NUMBER) {
        return {
            success: false,
            error: 'Gupshup credentials not configured'
        }
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(phone)) {
        return {
            success: false,
            error: 'Invalid phone number format. Must be 10 digits.'
        }
    }

    try {
        const response = await fetch('https://api.gupshup.io/wa/api/v1/msg', {
            method: 'POST',
            headers: {
                'apikey': process.env.GUPSHUP_API_KEY!,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                channel: 'whatsapp',
                source: process.env.GUPSHUP_PHONE_NUMBER!,
                destination: `91${phone}`, // Add country code for India
                'src.name': process.env.RESTAURANT_NAME || 'AI CAVALLI RESTAURANT',
                message: JSON.stringify({
                    type: 'text',
                    text: message
                })
            })
        })

        // Check if response is JSON
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text()
            console.error('Gupshup API returned non-JSON response (likely HTML error page):', text.substring(0, 300))

            // Check for common error messages in HTML response
            if (text.includes('Portal Use Only') || text.includes('Unauthorized')) {
                return {
                    success: false,
                    error: 'Invalid Gupshup API credentials. Please check GUPSHUP_API_KEY in .env.local'
                }
            }

            return {
                success: false,
                error: 'Gupshup API configuration error. Please verify your credentials and phone number format.'
            }
        }

        const data = await response.json()

        if (data.status === 'submitted') {
            return { success: true, messageId: data.messageId }
        } else {
            console.error('Gupshup API error response:', data)
            return { success: false, error: data.message || 'Failed to send WhatsApp message' }
        }
    } catch (error) {
        console.error('WhatsApp send error:', error)
        return { success: false, error: 'Network error or invalid API configuration' }
    }
}

/**
 * Send OTP via WhatsApp
 */
export async function sendOTP(
    phone: string,
    otp: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {

    const message = `🔐 ${process.env.RESTAURANT_NAME || 'AI CAVALLI'} - Login OTP\n\n` +
        `Your verification code is:\n\n` +
        `*${otp}*\n\n` +
        `This code will expire in 5 minutes.\n\n` +
        `Do not share this code with anyone.\n\n` +
        `If you didn't request this, please ignore.`

    return sendWhatsAppMessage(phone, message)
}
