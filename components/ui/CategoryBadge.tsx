import clsx from 'clsx'
import styles from './CategoryBadge.module.css'

interface CategoryBadgeProps {
    name: string
    isActive: boolean
    onClick: () => void
}

export function CategoryBadge({ name, isActive, onClick }: CategoryBadgeProps) {
    return (
        <button
            className={clsx(styles.badge, isActive && styles.active)}
            onClick={onClick}
        >
            {name}
        </button>
    )
}
