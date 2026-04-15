'use client'

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import styles from './KanbanBoard.module.css'

export interface KanbanItem {
  id:        string
  columnId:  string
  title:     string
  subtitle?: string
  badge?:    string
  badgeColor?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  meta?:     { label: string; value: string }[]
  tags?:     string[]
}

export interface KanbanColumnDef {
  id:    string
  title: string
  color?: string
}

interface KanbanBoardProps {
  columns:     KanbanColumnDef[]
  items:       KanbanItem[]
  onMove?:     (itemId: string, targetColumnId: string) => void
  onItemClick?: (item: KanbanItem) => void
  renderCard?: (item: KanbanItem) => React.ReactNode
}

export default function KanbanBoard({ columns, items, onMove, onItemClick, renderCard }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [localItems, setLocalItems] = useState<KanbanItem[]>(items)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const activeItem = localItems.find((i) => i.id === activeId)

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id))
  }

  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e
    if (!over) return

    const activeItem = localItems.find((i) => i.id === active.id)
    if (!activeItem) return

    // over a column directly
    const overColumn = columns.find((c) => c.id === over.id)
    if (overColumn && activeItem.columnId !== overColumn.id) {
      setLocalItems((prev) =>
        prev.map((i) => (i.id === active.id ? { ...i, columnId: overColumn.id } : i))
      )
      return
    }

    // over another card → move to same column
    const overItem = localItems.find((i) => i.id === over.id)
    if (overItem && activeItem.columnId !== overItem.columnId) {
      setLocalItems((prev) =>
        prev.map((i) => (i.id === active.id ? { ...i, columnId: overItem.columnId } : i))
      )
    }
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    setActiveId(null)
    if (!over) return

    const movedItem = localItems.find((i) => i.id === active.id)
    if (!movedItem) return

    onMove?.(movedItem.id, movedItem.columnId)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {columns.map((col) => {
          const colItems = localItems.filter((i) => i.columnId === col.id)
          return (
            <KanbanColumn key={col.id} column={col} count={colItems.length}>
              <SortableContext items={colItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                {colItems.map((item) =>
                  renderCard ? (
                    <div key={item.id}>{renderCard(item)}</div>
                  ) : (
                    <KanbanCard key={item.id} item={item} onItemClick={onItemClick} />
                  )
                )}
              </SortableContext>
            </KanbanColumn>
          )
        })}
      </div>
      <DragOverlay>
        {activeItem ? <KanbanCard item={activeItem} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
