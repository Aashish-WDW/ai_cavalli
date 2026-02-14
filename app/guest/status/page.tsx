'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'

export default function GuestStatusPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect legacy guest status to unified orders page
        const orderId = new URL(window.location.href).searchParams.get('orderId')
        if (orderId) {
            router.replace(`/orders?orderId=${orderId}`)
        } else {
            router.replace('/orders')
        }
    }, [router])

    return <Loading fullScreen message="Redirecting..." />
}
