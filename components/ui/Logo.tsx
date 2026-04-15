import { cn } from '@/lib/utils'
import styles from './Logo.module.css'

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <div className={cn(styles.logo, className)}>
      <span className={styles.logo__label}>Sistema</span>
      <span className={styles.logo__name}>Prioridade</span>
    </div>
  )
}
