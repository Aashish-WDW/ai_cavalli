import { Search } from 'lucide-react'
import styles from './SearchInput.module.css'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch: (value: string) => void
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
    return (
        <div className={styles.container}>
            <Search className={styles.icon} size={20} />
            <input
                className={styles.input}
                onChange={(e) => onSearch(e.target.value)}
                {...props}
            />
        </div>
    )
}
