'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import styles from './KanbanBoard.module.css'
import type { KanbanItem } from './KanbanBoard'

const BADGE_COLORS: Record<string, string> = {
  blue:   'var(--info-500,   #3b82f6)',
  green:  'var(--success-600,#16a34a)',
  yellow: 'var(--warning-500,#f59e0b)',
  red:    'var(--danger-500, #ef4444)',
  purple: '#8b5cf6',
  gray:   'var(--paragraph)',
}

interface KanbanCardProps {
  item:         KanbanItem
  isDragging?:  boolean
  onItemClick?: (item: KanbanItem) => void
}

export default function KanbanCard({ item, isDragging = false, onItemClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: item.id })

  const style: React.CSSProperties = {
    transform:  CSS.Transform.toString(transform),
    transition,
    opacity:    isSortableDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(styles.card, isDragging && styles['card--dragging'], onItemClick && styles['card--clickable'])}
      onClick={onItemClick ? () => onItemClick(item) : undefined}
    >
      {item.badge && (
        <span
          className={styles.card__badge}
          style={{ color: BADGE_COLORS[item.badgeColor ?? 'gray'] ?? BADGE_COLORS.gray }}
        >
          {item.badge}
        </span>
      )}
      <p className={styles.card__title}>{item.title}</p>
      {item.subtitle && <p className={styles.card__subtitle}>{item.subtitle}</p>}
      {item.meta && item.meta.length > 0 && (
        <dl className={styles.card__meta}>
          {item.meta.map((m) => (
            <div key={m.label} className={styles['card__meta-item']}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {item.tags && item.tags.length > 0 && (
        <div className={styles.card__tags}>
          {item.tags.map((tag) => (
            <span key={tag} className={styles.card__tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}
