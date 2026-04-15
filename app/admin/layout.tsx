'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth/client'
import { DashboardProvider, useDashboard } from '@/lib/context/DashboardContext'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { cn } from '@/lib/utils'
import styles from '@/components/layout/DashboardLayout.module.css'

/* Routes under /admin accessible to all authenticated users (not just admins) */
const PUBLIC_ADMIN_PATHS = ['/admin/financeiro/fluxo-caixa']

/* Inner component — consumes DashboardProvider */
function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
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

  const role = (session?.user as { role?: string })?.role
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))

  if (!session || (role !== 'admin' && !isPublicAdminPath)) {
    router.push('/dashboard')
    return null
  }

  const displayRole = role === 'admin' ? 'admin' : 'corretor'

  return (
    <div className={styles.layout}>
      <Sidebar
        userName={session.user.name ?? session.user.email ?? 'Usuário'}
        userEmail={session.user.email ?? ''}
        role={displayRole}
        onLogout={handleLogout}
      />
      <main className={cn(styles.main, !isSidebarOpen && styles['main--collapsed'])}>
        <Topbar title="Administração" />
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  )
}

/* Outer layout — provides DashboardProvider */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <AdminShell>{children}</AdminShell>
    </DashboardProvider>
  )
}
