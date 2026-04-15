import { cn } from '@/lib/utils'
import styles from './Badge.module.css'

type Variant = 'new' | 'active' | 'pending' | 'inactive' | 'cancelled' | 'neutral'

interface BadgeProps {
  variant?:  Variant
  className?: string
  children:  React.ReactNode
}

export default function Badge({ variant = 'neutral', className, children }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[`badge--${variant}`], className)}>
      {children}
    </span>
  )
}
