'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'

export default function GuestCartPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect legacy guest cart to unified route
        router.replace('/cart')
    }, [router])

    return <Loading fullScreen message="Redirecting..." />
}
