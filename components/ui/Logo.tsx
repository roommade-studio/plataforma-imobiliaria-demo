import { cn } from '@/lib/utils'
import styles from './Logo.module.css'

interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
}

export default function Logo({ className, variant = 'light' }: LogoProps) {
  return (
    <div className={cn(styles.logo, variant === 'dark' && styles['logo--dark'], className)}>
      <span className={styles.logo__label}>Sistema</span>
      <span className={styles.logo__name}>Prioridade</span>
    </div>
  )
}
