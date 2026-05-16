'use client'

import { cn } from '@/lib/utils'
import { useDashboard } from '@/lib/context/DashboardContext'
import styles from './Topbar.module.css'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function buildYearOptions(currentYear: number): number[] {
  const base = new Date().getFullYear()
  const years: number[] = []
  for (let y = base - 3; y <= base + 3; y++) {
    years.push(y)
  }
  // make sure currentYear is always in list
  if (!years.includes(currentYear)) {
    years.push(currentYear)
    years.sort((a, b) => a - b)
  }
  return years
}

interface TopbarProps {
  title:               string
  actions?:            React.ReactNode
  notificationCount?:  number
}

export default function Topbar({ title, actions, notificationCount = 0 }: TopbarProps) {
  const {
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,
    isSidebarOpen,
    toggleSidebar,
  } = useDashboard()

  const years = buildYearOptions(currentYear)

  return (
    <header
      className={cn(
        styles.topbar,
        !isSidebarOpen && styles['topbar--collapsed'],
      )}
    >
      {/* Left */}
      <div className={styles.topbar__left}>
        <button
          type="button"
          className={styles.topbar__toggle}
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Recolher menu lateral' : 'Expandir menu lateral'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>
        <h1 className={styles.topbar__title}>{title}</h1>
      </div>

      {/* Right */}
      <div className={styles.topbar__right}>

        {/* Month selector */}
        <div className={styles.topbar__selector}>
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            aria-label="Selecionar mês"
          >
            {MONTHS.map((name, idx) => (
              <option key={name} value={idx + 1}>{name}</option>
            ))}
          </select>
          <span className={styles['topbar__selector-chevron']} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {/* Year selector */}
        <div className={styles.topbar__selector}>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            aria-label="Selecionar ano"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <span className={styles['topbar__selector-chevron']} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {/* Notification bell */}
        <button
          type="button"
          className={styles.topbar__bell}
          aria-label={`Notificações${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {notificationCount > 0 && (
            <span className={styles.topbar__badge}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>

        {/* Extra actions */}
        {actions && (
          <div className={styles.topbar__actions}>
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}
