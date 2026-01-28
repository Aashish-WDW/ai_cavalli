/**
 * Test Script for Session-Based Billing
 * 
 * This script demonstrates how the session bill consolidation works.
 * Run with: node test-bill.js
 */

// Simulated session data (representative of what the API would receive)
const mockSession = {
    id: 'session-123',
    guest_name: 'John Doe',
    guest_phone: '9876543210',
    table_name: 'T5',
    num_guests: 4,
    orders: [
        {
            id: 'order-1',
            total: 450,
            discount_amount: 0,
            order_items: [
                { quantity: 2, price: 150, menu_items: { name: 'Pasta Carbonara' } },
                { quantity: 1, price: 150, menu_items: { name: 'Caesar Salad' } }
            ]
        },
        {
            id: 'order-2',
            total: 350,
            discount_amount: 50,
            order_items: [
                { quantity: 1, price: 150, menu_items: { name: 'Pasta Carbonara' } },
                { quantity: 2, price: 100, menu_items: { name: 'Garlic Bread' } }
            ]
        },
        {
            id: 'order-3',
            total: 300,
            discount_amount: 0,
            order_items: [
                { quantity: 2, price: 100, menu_items: { name: 'Cappuccino' } },
                { quantity: 1, price: 100, menu_items: { name: 'Tiramisu' } }
            ]
        }
    ]
};

function consolidateSessionBill(session) {
    const orders = session.orders || [];

    console.log('=====================================');
    console.log('   AI CAVALLI - SESSION BILL TEST');
    console.log('=====================================\n');

    console.log(`Guest: ${session.guest_name}`);
    console.log(`Table: ${session.table_name}`);
    console.log(`Number of Guests: ${session.num_guests}`);
    console.log(`Total Orders: ${orders.length}\n`);

    // Consolidate items
    const consolidatedItems = {};
    let totalItemsAmount = 0;
    let totalDiscount = 0;

    orders.forEach((order, idx) => {
        console.log(`--- Order ${idx + 1} ---`);
        totalDiscount += order.discount_amount || 0;

        const orderItems = order.order_items || [];
        orderItems.forEach((item) => {
            const itemName = item.menu_items?.name || 'Unknown Item';
            const key = `${itemName}_${item.price}`;

            if (consolidatedItems[key]) {
                consolidatedItems[key].quantity += item.quantity;
            } else {
                consolidatedItems[key] = {
                    name: itemName,
                    quantity: item.quantity,
                    price: item.price
                };
            }

            const subtotal = item.quantity * item.price;
            totalItemsAmount += subtotal;
            console.log(`  ${itemName} x${item.quantity} @ ₹${item.price} = ₹${subtotal}`);
        });

        if (order.discount_amount > 0) {
            console.log(`  [Discount Applied: -₹${order.discount_amount}]`);
        }
    });

    const finalTotal = totalItemsAmount - totalDiscount;

    console.log('\n=====================================');
    console.log('     CONSOLIDATED BILL');
    console.log('=====================================');
    console.log('ITEM                  QTY    AMOUNT');
    console.log('-------------------------------------');

    const billItems = Object.values(consolidatedItems);
    billItems.forEach((item) => {
        const subtotal = item.quantity * item.price;
        const name = item.name.padEnd(20).substring(0, 20);
        const qty = String(item.quantity).padStart(3);
        const amount = `₹${subtotal}`.padStart(9);
        console.log(`${name}${qty}${amount}`);
    });

    console.log('-------------------------------------');
    console.log(`Items Total:               ₹${totalItemsAmount}`);

    if (totalDiscount > 0) {
        console.log(`Total Discount:           -₹${totalDiscount}`);
    }

    console.log('-------------------------------------');
    console.log(`FINAL TOTAL:               ₹${finalTotal}`);
    console.log('=====================================');
    console.log('Thank you for dining at Ai Cavalli!');
    console.log('=====================================\n');

    return {
        itemsTotal: totalItemsAmount,
        discountAmount: totalDiscount,
        finalTotal: finalTotal,
        itemCount: billItems.length,
        orderCount: orders.length,
        items: billItems
    };
}

// Run the test
console.log('\n🧪 Testing Session Bill Consolidation\n');
const result = consolidateSessionBill(mockSession);
console.log('\n📊 Bill Summary:');
console.log(JSON.stringify(result, null, 2));
