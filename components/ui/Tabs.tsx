'use client'

import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import styles from './Tabs.module.css'

/* =====================================================
   Context
   ===================================================== */

interface TabsContextValue {
  value:         string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs sub-components must be used inside <Tabs>')
  return ctx
}

/* =====================================================
   Components
   ===================================================== */

interface TabsProps {
  value:         string
  onValueChange: (value: string) => void
  children:      React.ReactNode
  className?:    string
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn(styles.tabs, className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

/* ----- TabsList ----- */

interface TabsListProps {
  children:   React.ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div role="tablist" className={cn(styles.tabs__list, className)}>
      {children}
    </div>
  )
}

/* ----- TabsTrigger ----- */

interface TabsTriggerProps {
  value:      string
  children:   React.ReactNode
  className?: string
  disabled?:  boolean
}

export function TabsTrigger({ value, children, className, disabled = false }: TabsTriggerProps) {
  const { value: activeValue, onValueChange } = useTabsContext()
  const isActive = activeValue === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      className={cn(
        styles.tabs__trigger,
        isActive && styles['tabs__trigger--active'],
        className,
      )}
    >
      {children}
    </button>
  )
}

/* ----- TabsPanel ----- */

interface TabsPanelProps {
  value:      string
  children:   React.ReactNode
  className?: string
}

export function TabsPanel({ value, children, className }: TabsPanelProps) {
  const { value: activeValue } = useTabsContext()
  if (activeValue !== value) return null

  return (
    <div role="tabpanel" className={cn(styles.tabs__panel, className)}>
      {children}
    </div>
  )
}
