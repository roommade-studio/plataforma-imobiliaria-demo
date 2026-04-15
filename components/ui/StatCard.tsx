'use client'

import { cn } from '@/lib/utils'
import styles from './StatCard.module.css'

interface StatCardProps {
  label:       string
  value:       string | number
  suffix?:     string
  trend?:      number      // percentage, positive = up, negative = down
  trendLabel?: string
  icon?:       React.ReactNode
  className?:  string
  variant?:    'default' | 'accent'
}

export default function StatCard({
  label,
  value,
  suffix,
  trend,
  trendLabel,
  icon,
  className,
  variant = 'default',
}: StatCardProps) {
  const trendUp = trend !== undefined && trend >= 0

  return (
    <div className={cn(styles.card, variant === 'accent' && styles['card--accent'], className)}>
      <div className={styles.card__top}>
        <span className={styles.card__label}>{label}</span>
        {icon && <span className={styles.card__icon}>{icon}</span>}
      </div>
      <div className={styles.card__value}>
        {value}
        {suffix && <span className={styles.card__suffix}>{suffix}</span>}
      </div>
      {trend !== undefined && (
        <div className={cn(styles.card__trend, trendUp ? styles['card__trend--up'] : styles['card__trend--down'])}>
          <span className={styles['card__trend-arrow']}>{trendUp ? '↑' : '↓'}</span>
          <span>{Math.abs(trend).toFixed(1)}%</span>
          {trendLabel && <span className={styles['card__trend-label']}>{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
