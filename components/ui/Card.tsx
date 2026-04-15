import { cn } from '@/lib/utils'
import styles from './Card.module.css'

interface CardProps {
  hoverable?: boolean
  className?: string
  children:   React.ReactNode
}

export default function Card({ hoverable = false, className, children }: CardProps) {
  return (
    <div className={cn(styles.card, hoverable && styles['card--hoverable'], className)}>
      {children}
    </div>
  )
}

interface CardSectionProps {
  className?: string
  children:   React.ReactNode
}

export function CardHeader({ className, children }: CardSectionProps) {
  return <div className={cn(styles.card__header, className)}>{children}</div>
}

export function CardBody({ className, children }: CardSectionProps) {
  return <div className={cn(styles.card__body, className)}>{children}</div>
}

export function CardFooter({ className, children }: CardSectionProps) {
  return <div className={cn(styles.card__footer, className)}>{children}</div>
}
