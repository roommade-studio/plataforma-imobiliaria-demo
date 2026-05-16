'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import Card, { CardBody } from '@/components/ui/Card'
import { analyses, type AnaliseStatus, fmtBRL } from './_data'
import styles from './page.module.css'

/* ── Icons ──────────────────────────────────────────────── */

function IconFileText() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconFileCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 15 11 17 15 13" />
    </svg>
  )
}
function IconDollar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
function IconXCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

/* ── Status helpers ─────────────────────────────────────── */

const STATUS_COLORS: Record<AnaliseStatus, string> = {
  Criado:      styles['badge--gray'],
  Apresentado: styles['badge--blue'],
  Assinado:    styles['badge--yellow'],
  Vendido:     styles['badge--green'],
  Suspenso:    styles['badge--red'],
}

function StatusBadge({ status }: { status: AnaliseStatus }) {
  return <span className={cn(styles.badge, STATUS_COLORS[status])}>{status}</span>
}

/* ── Page ───────────────────────────────────────────────── */

export default function AnaliseMercadoPage() {
  const router = useRouter()
  const [data]          = useState(() => [...analyses])
  const [search,        setSearch]        = useState('')
  const [filterStatus,  setFilterStatus]  = useState<AnaliseStatus | 'Todos'>('Todos')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data
      .filter(a => filterStatus === 'Todos' || a.status === filterStatus)
      .filter(a =>
        !q ||
        a.proprietario.toLowerCase().includes(q) ||
        a.bairro.toLowerCase().includes(q) ||
        a.cidade.toLowerCase().includes(q) ||
        a.corretor.toLowerCase().includes(q)
      )
  }, [data, search, filterStatus])

  /* KPIs */
  const total       = data.length
  const byCriado    = data.filter(a => a.status === 'Criado').length
  const byApresent  = data.filter(a => a.status === 'Apresentado').length
  const byAssinado  = data.filter(a => a.status === 'Assinado').length
  const byVendido   = data.filter(a => a.status === 'Vendido').length
  const bySuspenso  = data.filter(a => a.status === 'Suspenso').length
  const taxaConvVend = total > 0 ? Math.round((byVendido / total) * 100) : 0

  return (
    <>
      <Topbar
        title="Análise de Mercado"
        actions={
          <Button size="sm" onClick={() => router.push('/analise-mercado/nova')}>
            + Nova Análise
          </Button>
        }
      />

      <div className={styles.page}>
        {/* KPIs */}
        <div className={styles.kpis}>
          <StatCard label="Total de Análises" value={total}      trendLabel="na base"                        icon={<IconFileText />} />
          <StatCard label="Criadas"           value={byCriado}   trendLabel="aguardando"                     icon={<IconPlus />} />
          <StatCard label="Apresentadas"      value={byApresent} trendLabel="ao proprietário"                icon={<IconUsers />} />
          <StatCard label="Assinadas"         value={byAssinado} trendLabel="com exclusividade"              icon={<IconFileCheck />} />
          <StatCard label="Vendidas"          value={byVendido}  trendLabel={`${taxaConvVend}% de conversão`} variant="accent" icon={<IconDollar />} />
          {bySuspenso > 0 && <StatCard label="Suspensas" value={bySuspenso} trendLabel="inativas" icon={<IconXCircle />} />}
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.search__wrapper}>
            <svg className={styles.search__icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.search}
              placeholder="Buscar por proprietário, bairro, cidade ou corretor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.filter__select}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as AnaliseStatus | 'Todos')}
            aria-label="Filtrar por status"
          >
            <option value="Todos">Todos os status</option>
            <option value="Criado">Criado</option>
            <option value="Apresentado">Apresentado</option>
            <option value="Assinado">Assinado</option>
            <option value="Vendido">Vendido</option>
            <option value="Suspenso">Suspenso</option>
          </select>
        </div>

        {/* Table */}
        <Card>
          <CardBody>
            <div className={styles.table__wrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Imóvel / Endereço</th>
                    <th className={styles.th}>Proprietário</th>
                    <th className={styles.th}>Preço de Mercado</th>
                    <th className={styles.th}>Corretor</th>
                    <th className={styles.th}>Data</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id} className={styles.tr}>
                      <td className={styles.td}>
                        <span className={styles['td--address']}>{a.rua}, {a.numero}{a.complemento ? `, ${a.complemento}` : ''}</span>
                        <span className={styles['td--sub']}>{a.tipo} · {a.bairro}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles['td--name']}>{a.proprietario}</span>
                        <span className={styles['td--sub']}>{a.telefone}</span>
                      </td>
                      <td className={cn(styles.td, styles['td--value'])}>
                        {a.precoMercado > 0 ? fmtBRL(a.precoMercado) : <span className={styles['td--empty-val']}>—</span>}
                      </td>
                      <td className={styles.td}>{a.corretor}</td>
                      <td className={cn(styles.td, styles['td--date'])}>{a.criadoEm}</td>
                      <td className={styles.td}><StatusBadge status={a.status} /></td>
                      <td className={styles.td}>
                        <Button size="sm" variant="secondary" onClick={() => router.push(`/analise-mercado/${a.id}`)}>
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className={styles['td--no-results']}>
                        Nenhuma análise encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
