import clsx from 'clsx'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export function Input({ className, label, error, ...props }: InputProps) {
    return (
        <div className={clsx(styles.container, className)}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                className={clsx(styles.input, error && styles.hasError)}
                {...props}
            />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    )
}
