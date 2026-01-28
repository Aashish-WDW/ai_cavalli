/**
 * EMAIL UTILITY (Ai Cavalli)
 * Powered by Resend
 */

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.log('\n' + '='.repeat(60));
        console.log('📧 EMAIL SIMULATION (No RESEND_API_KEY)');
        console.log('='.repeat(60));
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('Content (HTML Preview):');
        console.log(html.replace(/<[^>]*>?/gm, '').substring(0, 200) + '...');
        console.log('='.repeat(60) + '\n');

        return { success: true, simulated: true };
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: 'Ai Cavalli <onboarding@resend.dev>', // Update to verified domain later
                to,
                subject,
                html,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend API Error:', data);
            return { success: false, error: data.message };
        }

        return { success: true, id: data.id };
    } catch (error) {
        console.error('Email Delivery Error:', error);
        return { success: false, error: 'Network failure' };
    }
}

/**
 * Sends a premium formatted Bill to the customer
 */
export async function sendOrderBillEmail(email: string, billData: any) {
    const itemsHtml = billData.items.map((item: any) => `
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.name} x ${item.quantity}</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #d4af37; background: #fff;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #c0272d; margin-bottom: 5px;">AI CAVALLI</h1>
                <p style="text-transform: uppercase; letter-spacing: 2px; color: #666; font-size: 12px;">Il Ristorante della Scuderia</p>
            </div>
            
            <h2 style="border-bottom: 2px solid #c0272d; padding-bottom: 10px; color: #333;">Order Receipt</h2>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Session ID:</strong> ${billData.sessionId.substring(0, 8)}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="color: #666; font-size: 11px; text-transform: uppercase;">
                        <th style="text-align: left; padding-bottom: 10px;">Item</th>
                        <th style="text-align: right; padding-bottom: 10px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            
            <div style="text-align: right; margin-top: 20px;">
                <p style="font-size: 1.2rem; font-weight: bold; color: #c0272d;">Total Amount: ₹${billData.totalAmount}</p>
            </div>
            
            <div style="margin-top: 50px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; color: #999; font-size: 12px;">
                <p>Grazie per aver cenato con noi!</p>
                <p>Ai Cavalli Hotel & Restaurant</p>
            </div>
        </div>
    `;

    return sendEmail({
        to: email,
        subject: `Your Receipt from Ai Cavalli - ₹${billData.totalAmount}`,
        html,
    });
}
