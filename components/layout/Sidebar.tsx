'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn, getInitials } from '@/lib/utils'
import { useDashboard } from '@/lib/context/DashboardContext'
import styles from './Sidebar.module.css'

/* =====================================================
   Inline SVG icons
   ===================================================== */

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconChartBar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function IconMentor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconTrendingUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function IconPipeline() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="4" rx="1" />
      <rect x="3" y="10" width="12" height="4" rx="1" />
      <rect x="3" y="17" width="7" height="4" rx="1" />
    </svg>
  )
}

function IconSales() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconContract() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  )
}

function IconKanban() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="5" height="18" rx="1" />
      <rect x="10" y="3" width="5" height="11" rx="1" />
      <rect x="17" y="3" width="5" height="15" rx="1" />
    </svg>
  )
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconAdjust() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconTeam() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

/* =====================================================
   Sidebar component
   ===================================================== */

interface SidebarProps {
  userName:  string
  userEmail: string
  role:      'admin' | 'corretor' | 'gestor'
  onLogout:  () => void
}

export default function Sidebar({ userName, userEmail: _userEmail, role, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const { isSidebarOpen } = useDashboard()
  const collapsed = !isSidebarOpen

  function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
    return (
      <Link
        href={href}
        className={cn(styles.sidebar__item, pathname === href && styles['sidebar__item--active'])}
      >
        <span className={styles['sidebar__item-icon']}>{icon}</span>
        <span className={styles['sidebar__item-label']}>{label}</span>
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        styles.sidebar,
        collapsed && styles['sidebar--collapsed'],
      )}
    >
      {/* Logo */}
      <div className={styles.sidebar__logo}>
        <div className={styles['sidebar__logo-icon']}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        <span className={styles['sidebar__logo-text']}>Plataforma Imob</span>
      </div>

      {/* Navigation */}
      <nav className={styles.sidebar__nav}>

        {/* Minha Equipe — gestor only */}
        {role === 'gestor' && (
          <div className={styles.sidebar__section}>
            <span className={styles['sidebar__section-title']}>Minha Equipe</span>
            <NavLink href="/gestor/dashboard" label="Visão da Equipe"   icon={<IconTeam />}   />
            <NavLink href="/gestor/metas"     label="Metas da Empresa"  icon={<IconTarget />} />
          </div>
        )}

        {/* Pessoal */}
        <div className={styles.sidebar__section}>
          <span className={styles['sidebar__section-title']}>Pessoal</span>
          <NavLink href="/perfil" label="Perfil" icon={<IconUser />} />
        </div>

        {/* Meu Negócio */}
        <div className={styles.sidebar__section}>
          <span className={styles['sidebar__section-title']}>Meu Negócio</span>
          <NavLink href="/dashboard" label="Meu Dashboard"      icon={<IconDashboard />} />
          <NavLink href="/metrics"   label="Planejamento"       icon={<IconChartBar />}  />
          <NavLink href="/mentoria"  label="Minha Performance"  icon={<IconMentor />}    />
        </div>

        {/* Análises */}
        <div className={styles.sidebar__section}>
          <span className={styles['sidebar__section-title']}>Análises</span>
          <NavLink href="/benchmarking" label="Metas vs Realizado" icon={<IconTrendingUp />} />
        </div>

        {/* Gestão de Compradores */}
        <div className={styles.sidebar__section}>
          <span className={styles['sidebar__section-title']}>Gestão de Compradores</span>
          <NavLink href="/pipeline"  label="Pipeline de Compradores" icon={<IconPipeline />} />
          <NavLink href="/sales"     label="Minhas Vendas"           icon={<IconSales />}    />
          <NavLink href="/contracts" label="Meus Contratos"          icon={<IconContract />} />
        </div>

        {/* Gestão de Vendedores */}
        <div className={styles.sidebar__section}>
          <span className={styles['sidebar__section-title']}>Gestão de Vendedores</span>
          <NavLink href="/seller-pipeline"     label="Pipeline de Vendedores"    icon={<IconPipeline />} />
          <NavLink href="/properties-kanban"   label="Kanban de Imóveis"         icon={<IconKanban />}  />
          <NavLink href="/properties"          label="Minha Carteira de Imóveis" icon={<IconHome />}    />
          <NavLink href="/adjustments"         label="Reajustes"                 icon={<IconAdjust />}  />
        </div>

      </nav>

      {/* Footer — user info + logout */}
      <div className={styles.sidebar__footer}>
        <div className={styles.sidebar__user}>
          <div className={styles.sidebar__avatar}>
            {getInitials(userName)}
          </div>
          <div className={styles['sidebar__user-info']}>
            <p className={styles['sidebar__user-name']}>{userName}</p>
            <p className={styles['sidebar__user-role']}>
              {role === 'admin' ? 'Administrador' : role === 'gestor' ? 'Gestor' : 'Corretor'}
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className={styles['sidebar__item-icon']}
            style={{ color: 'var(--sidebar-text)', cursor: 'pointer', marginLeft: 'auto', flexShrink: 0 }}
            aria-label="Sair"
          >
            <IconLogout />
          </button>
        </div>
      </div>
    </aside>
  )
}
