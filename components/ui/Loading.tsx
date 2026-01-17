'use client'

import React from 'react'

interface LoadingProps {
    fullScreen?: boolean
    message?: string
}

export function Loading({ fullScreen = false, message = 'Loading...' }: LoadingProps) {
    const content = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '2rem'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
            <p style={{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.125rem',
                fontWeight: 500
            }} className="loading-pulse">
                {message}
            </p>
        </div>
    )

    if (fullScreen) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'var(--background)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {content}
            </div>
        )
    }

    return content
}
