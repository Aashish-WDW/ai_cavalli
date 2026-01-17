export default function GuestLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="guest-layout">
            <header style={{ padding: '1rem', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>Ai Cavalli (Guest)</h2>
            </header>
            <main style={{ paddingBottom: '2rem' }}>
                {children}
            </main>
        </div>
    )
}
