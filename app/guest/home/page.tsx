'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'

export default function GuestHomePage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect legacy guest home to the new unified home
        router.replace('/home')
    }, [router])

    return <Loading fullScreen message="Redirecting to your experience..." />
}
