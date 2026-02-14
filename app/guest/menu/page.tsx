'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'

export default function GuestMenuPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect legacy guest menu to unified route
        router.replace('/menu')
    }, [router])

    return <Loading fullScreen message="Redirecting..." />
}
