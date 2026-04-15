'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import styles from './KanbanBoard.module.css'
import type { KanbanColumnDef } from './KanbanBoard'

interface KanbanColumnProps {
  column:   KanbanColumnDef
  count:    number
  children: React.ReactNode
}

export default function KanbanColumn({ column, count, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className={cn(styles.column, isOver && styles['column--over'])}
      style={column.color ? ({ '--col-accent': column.color } as React.CSSProperties) : undefined}
    >
      <div className={styles.column__header}>
        <div className={styles.column__title}>
          {column.color && (
            <span className={styles.column__dot} />
          )}
          <span>{column.title}</span>
        </div>
        <span className={styles.column__count}>{count}</span>
      </div>
      <div className={styles.column__body}>
        {children}
      </div>
    </div>
  )
}
