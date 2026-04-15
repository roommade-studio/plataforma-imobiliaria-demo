'use client'

import { createContext, useContext, useState } from 'react'

interface DashboardContextValue {
  currentMonth:    number
  currentYear:     number
  setCurrentMonth: (month: number) => void
  setCurrentYear:  (year: number) => void
  isSidebarOpen:   boolean
  toggleSidebar:   () => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const now = new Date()

  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth() + 1)
  const [currentYear,  setCurrentYear]  = useState<number>(now.getFullYear())
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  function toggleSidebar() {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <DashboardContext.Provider
      value={{
        currentMonth,
        currentYear,
        setCurrentMonth,
        setCurrentYear,
        isSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext)
  if (!ctx) {
    throw new Error('useDashboard must be used inside <DashboardProvider>')
  }
  return ctx
}
