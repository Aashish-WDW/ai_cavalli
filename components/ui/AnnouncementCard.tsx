import styles from './AnnouncementCard.module.css'

interface Announcement {
    id: string
    title: string
    description: string
    image_url?: string
    link?: string
    created_at: string
}

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
    return (
        <article className={styles.card}>
            {announcement.image_url && (
                <div
                    className={styles.image}
                    style={{ backgroundImage: `url(${announcement.image_url})` }}
                />
            )}
            <div className={styles.content}>
                <h3 className={styles.title}>{announcement.title}</h3>
                <p className={styles.description}>{announcement.description}</p>

                {announcement.link && (
                    <a href={announcement.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        Read More &rarr;
                    </a>
                )}

                <time className={styles.date}>
                    {new Date(announcement.created_at).toLocaleDateString()}
                </time>
            </div>
        </article>
    )
}
