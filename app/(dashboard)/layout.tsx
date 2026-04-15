'use client'

import { useRouter } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth/client'
import { DashboardProvider, useDashboard } from '@/lib/context/DashboardContext'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { cn } from '@/lib/utils'
import styles from '@/components/layout/DashboardLayout.module.css'

/* Inner component — consumes DashboardProvider */
function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const { isSidebarOpen } = useDashboard()

  async function handleLogout() {
    await signOut()
    router.push('/login')
  }

  if (isPending) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: 'var(--paragraph)', fontFamily: 'var(--font-family-sans)', fontSize: 'var(--font-size-text-sm)' }}>
          Carregando...
        </p>
      </div>
    )
  }

  if (!session) {
    router.push('/login')
    return null
  }

  const rawRole = (session.user as { role?: string }).role
  const role: 'admin' | 'gestor' | 'corretor' =
    rawRole === 'admin' ? 'admin' : rawRole === 'gestor' ? 'gestor' : 'corretor'

  return (
    <div className={styles.layout}>
      <Sidebar
        userName={session.user.name ?? session.user.email ?? 'Usuário'}
        userEmail={session.user.email ?? ''}
        role={role}
        onLogout={handleLogout}
      />
      <main className={cn(styles.main, !isSidebarOpen && styles['main--collapsed'])}>
        <Topbar title="Dashboard" />
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  )
}

/* Outer layout — provides DashboardProvider */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  )
}
