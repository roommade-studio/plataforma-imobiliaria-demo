import { cn } from '@/lib/utils'
import styles from './StatCard.module.css'

interface StatCardProps {
  label:     string
  value:     string | number
  icon?:     React.ReactNode
  trend?:    number
  trendLabel?: string
  footer?:   string
}

export default function StatCard({ label, value, icon, trend, trendLabel, footer }: StatCardProps) {
  return (
    <div className={styles.stat}>
      <div className={styles.stat__header}>
        <span className={styles.stat__label}>{label}</span>
        {icon && <span className={styles.stat__icon}>{icon}</span>}
      </div>

      <p className={styles.stat__value}>{value}</p>

      {(footer || trend !== undefined) && (
        <p className={styles.stat__footer}>
          {trend !== undefined && (
            <span className={cn(styles.stat__trend, trend >= 0 ? styles['stat__trend--up'] : styles['stat__trend--down'])}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span> {trendLabel}</span>}
          {footer && <span>{footer}</span>}
        </p>
      )}
    </div>
  )
}
