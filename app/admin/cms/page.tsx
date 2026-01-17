'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/database/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/ui/Loading'
import {
    Trash2,
    Plus,
    Image as ImageIcon,
    ArrowLeft,
    Megaphone,
    Calendar,
    Link as LinkIcon,
    X,
    Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function CMSPage() {
    const [news, setNews] = useState<any[]>([])
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [link, setLink] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(true)

    useEffect(() => {
        fetchNews()
    }, [])

    async function fetchNews() {
        setDataLoading(true)
        const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
        if (data) setNews(data)
        setDataLoading(false)
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.from('announcements').insert({
            title,
            description: desc,
            link,
            image_url: imageUrl
        })

        if (!error) {
            setTitle('')
            setDesc('')
            setLink('')
            setImageUrl('')
            fetchNews()
        } else {
            alert('Error adding news')
        }
        setLoading(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this announcement?')) return
        await supabase.from('announcements').delete().eq('id', id)
        fetchNews()
    }

    if (dataLoading) return <Loading />

    return (
        <div className="container" style={{ paddingBottom: 'var(--space-12)' }}>
            {/* Header */}
            <div style={{ marginBottom: 'var(--space-10)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', paddingTop: 'var(--space-6)' }}>
                <Link href="/admin">
                    <Button variant="ghost" size="sm" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', margin: 0, color: 'var(--text)' }}>Bulletin CMS</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Manage news, events, and announcements</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
                {/* Creator Section */}
                <div style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-8)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                    position: 'sticky',
                    top: 'var(--space-6)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <Megaphone size={16} />
                        </div>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>New Announcement</h3>
                    </div>

                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                        <Input
                            label="Title"
                            placeholder="e.g. Weekend Special: Prime Rib"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</label>
                            <textarea
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                                placeholder="What's happening?"
                                style={{
                                    width: '100%',
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    minHeight: '120px',
                                    fontSize: '0.9rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <Input
                            label="Image URL"
                            placeholder="https://images.unsplash.com/..."
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                        />

                        {imageUrl && (
                            <div style={{
                                width: '100%',
                                height: '160px',
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden',
                                border: '1px solid var(--border)',
                                position: 'relative'
                            }}>
                                <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    backdropFilter: 'blur(4px)'
                                }}>IMAGE PREVIEW</div>
                            </div>
                        )}

                        <Input
                            label="Action Link (Optional)"
                            placeholder="https://..."
                            value={link}
                            onChange={e => setLink(e.target.value)}
                        />

                        <Button type="submit" isLoading={loading} style={{ height: '48px', marginTop: 'var(--space-2)' }}>
                            <Plus size={18} style={{ marginRight: '8px' }} />
                            Publish Announcement
                        </Button>
                    </form>
                </div>

                {/* List Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>Published Board</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{news.length} Announcements</span>
                    </div>

                    {news.length === 0 ? (
                        <div style={{ padding: 'var(--space-12)', textAlign: 'center', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                            <div style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                                <Sparkles size={48} />
                            </div>
                            <h3 style={{ margin: '0 0 8px 0' }}>No announcements yet</h3>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Spread the word about your latest updates!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
                            {news.map(item => (
                                <div key={item.id} className="hover-lift" style={{
                                    background: 'var(--surface)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border)',
                                    boxShadow: 'var(--shadow-sm)',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {item.image_url && (
                                        <div style={{ width: '100%', height: '140px', background: 'rgba(0,0,0,0.05)' }}>
                                            <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ padding: 'var(--space-5)', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3 }}>{item.title}</h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                style={{ color: '#EF4444', height: '32px', width: '32px', padding: 0 }}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 var(--space-4) 0', lineHeight: 1.5 }}>
                                            {item.description}
                                        </p>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingTop: 'var(--space-4)',
                                            borderTop: '1px solid var(--border-light)',
                                            marginTop: 'auto'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                                                <Calendar size={12} />
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </div>
                                            {item.link && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800 }}>
                                                    <LinkIcon size={12} />
                                                    LINK ATTACHED
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
