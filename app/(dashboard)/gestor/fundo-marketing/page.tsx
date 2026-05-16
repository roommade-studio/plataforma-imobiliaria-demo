'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input, { Select, Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import styles from './page.module.css'

/* ── Types ──────────────────────────────────────────────── */

type CampaignStatus = 'Solicitado' | 'Aprovado' | 'Rejeitado' | 'Executado'

interface PropRecord {
  id: string
  endereco: string
  tipo: string
  valor: number
  corretor: string
  verbaNominal: number
  ativo: boolean
  nota: string
}

interface Campaign {
  id: string
  propId: string
  tipo: string
  descricao: string
  valor: number
  valorReal?: number
  data: string
  dataExecucao?: string
  solicitadoPor: string
  registradoPor?: string
  status: CampaignStatus
  motivoRejeicao?: string
}

/* ── Helpers ────────────────────────────────────────────── */

function calcBudgetAuto(valor: number): number {
  if (valor <= 300_000) return Math.min(750, Math.max(300, Math.round(valor * 0.0025)))
  if (valor <= 600_000) return Math.round(valor * 0.002)
  return Math.round(valor * 0.0015)
}

function fmtBRL(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function isoToDisplay(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

/* ── Mock data ──────────────────────────────────────────── */

const INITIAL_PROPS: PropRecord[] = [
  { id: 'P001', endereco: 'Rua Venâncio Aires, 1230 — Apto 302',        tipo: 'Apartamento',    valor: 320_000, corretor: 'Marcos Souza', verbaNominal: 800,   ativo: true, nota: '' },
  { id: 'P002', endereco: 'Av. Medianeira, 890 — Casa',                  tipo: 'Casa',           valor: 480_000, corretor: 'Marcos Souza', verbaNominal: 1_200, ativo: true, nota: '' },
  { id: 'P003', endereco: 'Rua Dr. Bozzano, 456 — Apto 501',            tipo: 'Apartamento',    valor: 195_000, corretor: 'Marcos Souza', verbaNominal: 487,   ativo: true, nota: '' },
  { id: 'P004', endereco: 'Rua Venâncio Aires, 540 — Casa',              tipo: 'Casa',           valor: 650_000, corretor: 'Ana Beatriz',  verbaNominal: 1_625, ativo: true, nota: '' },
  { id: 'P005', endereco: 'Rua Floriano Peixoto, 210 — Sala Comercial',  tipo: 'Sala Comercial', valor: 280_000, corretor: 'Rafael Mota',  verbaNominal: 700,   ativo: true, nota: '' },
]

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 'C001', propId: 'P001', tipo: 'Tráfego Pago Meta',   descricao: 'Impulsionamento Instagram',     valor: 200, valorReal: 185, data: '05/04/2026', dataExecucao: '07/04/2026', solicitadoPor: 'Marcos Souza', registradoPor: 'Carlos Lima', status: 'Executado',  motivoRejeicao: '' },
  { id: 'C002', propId: 'P001', tipo: 'Material Gráfico',    descricao: 'Arte para Stories — Abril',     valor: 250, valorReal: 250, data: '12/04/2026', dataExecucao: '14/04/2026', solicitadoPor: 'Marcos Souza', registradoPor: 'Carlos Lima', status: 'Executado',  motivoRejeicao: '' },
  { id: 'C003', propId: 'P001', tipo: 'Tráfego Pago Google', descricao: 'Google Ads — Venâncio 1230',    valor: 200, data: '20/04/2026', solicitadoPor: 'Marcos Souza', status: 'Aprovado',   motivoRejeicao: '' },
  { id: 'C004', propId: 'P002', tipo: 'Portal Imobiliário',  descricao: 'Destaque ZAP — Medianeira 890', valor: 300, data: '25/04/2026', solicitadoPor: 'Marcos Souza', status: 'Solicitado', motivoRejeicao: '' },
  { id: 'C005', propId: 'P003', tipo: 'Tráfego Pago Meta',   descricao: 'Campanha Instagram — Bozzano',  valor: 250, valorReal: 250, data: '08/04/2026', dataExecucao: '10/04/2026', solicitadoPor: 'Marcos Souza', registradoPor: 'Carlos Lima', status: 'Executado',  motivoRejeicao: '' },
  { id: 'C006', propId: 'P003', tipo: 'Fotografia/Vídeo',    descricao: 'Ensaio Fotográfico — Bozzano',  valor: 180, data: '20/05/2026', solicitadoPor: 'Marcos Souza', status: 'Rejeitado',  motivoRejeicao: 'Verba insuficiente no período — aguardar próximo mês.' },
  { id: 'C007', propId: 'P004', tipo: 'Portal Imobiliário',  descricao: 'Destaque ZAP — Venâncio 540',   valor: 300, data: '10/04/2026', solicitadoPor: 'Ana Beatriz',  status: 'Aprovado',   motivoRejeicao: '' },
  { id: 'C008', propId: 'P004', tipo: 'Material Gráfico',    descricao: 'Arte para redes sociais',       valor: 200, data: '15/05/2026', solicitadoPor: 'Ana Beatriz',  status: 'Solicitado', motivoRejeicao: '' },
  { id: 'C009', propId: 'P005', tipo: 'Tráfego Pago Google', descricao: 'Google Ads — Floriano',         valor: 400, valorReal: 380, data: '05/04/2026', dataExecucao: '06/04/2026', solicitadoPor: 'Rafael Mota',  registradoPor: 'Carlos Lima', status: 'Executado',  motivoRejeicao: '' },
  { id: 'C010', propId: 'P005', tipo: 'Fotografia/Vídeo',    descricao: 'Ensaio Fotográfico Profissional', valor: 250, data: '12/04/2026', solicitadoPor: 'Rafael Mota',  status: 'Solicitado', motivoRejeicao: '' },
]

const TIPOS_CAMPANHA = [
  'Tráfego Pago Meta',
  'Tráfego Pago Google',
  'Material Gráfico',
  'Fotografia/Vídeo',
  'Portal Imobiliário',
  'Outro',
]

/* ── Icons ──────────────────────────────────────────────── */

function IconWallet() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  )
}

function IconTrendUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

/* ── Campaign status badge ──────────────────────────────── */

function campStatusBadge(status: CampaignStatus) {
  switch (status) {
    case 'Solicitado': return { label: 'Solicitado', cls: styles['badge--amber'] }
    case 'Aprovado':   return { label: 'Aprovado',   cls: styles['badge--green'] }
    case 'Rejeitado':  return { label: 'Rejeitado',  cls: styles['badge--red']   }
    case 'Executado':  return { label: 'Executado',  cls: styles['badge--blue']  }
  }
}

/* ── Component ──────────────────────────────────────────── */

export default function AdminFundoMarketing() {
  const [properties, setProperties] = useState<PropRecord[]>(INITIAL_PROPS)
  const [campaigns,  setCampaigns]  = useState<Campaign[]>(INITIAL_CAMPAIGNS)

  // Property budget edit modal
  const [editPropModal, setEditPropModal] = useState(false)
  const [editPropId,    setEditPropId]    = useState('')
  const [editPropForm,  setEditPropForm]  = useState({ verbaNominal: '', nota: '', ativo: true })

  // Campaign full-edit modal
  const [editCampModal, setEditCampModal] = useState(false)
  const [editCampId,    setEditCampId]    = useState('')
  const [editCampForm,  setEditCampForm]  = useState({
    tipo: '', descricao: '', valor: '', data: '', status: 'Solicitado' as CampaignStatus, motivoRejeicao: '',
  })

  // Rejection reason modal
  const [rejectModal,    setRejectModal]    = useState(false)
  const [rejectCampId,   setRejectCampId]   = useState('')
  const [rejectReason,   setRejectReason]   = useState('')

  // Add campaign modal (admin bypass)
  const [addCampModal, setAddCampModal] = useState(false)
  const [addCampForm,  setAddCampForm]  = useState({
    propId: '', tipo: '', descricao: '', valor: '', data: todayISO(), status: 'Aprovado' as CampaignStatus,
  })

  // Filters
  const [filterCorretor, setFilterCorretor] = useState('todos')
  const [filterTipo,     setFilterTipo]     = useState('todos')
  const [filterStatus,   setFilterStatus]   = useState('todos')

  // Computed
  const usedPerProp: Record<string, number> = {}
  for (const prop of properties) {
    usedPerProp[prop.id] = campaigns
      .filter(c => c.propId === prop.id && c.status !== 'Rejeitado')
      .reduce((s, c) => s + c.valor, 0)
  }

  const totalGasto    = campaigns.filter(c => c.status !== 'Rejeitado').reduce((s, c) => s + c.valor, 0)
  const totalVerbas   = properties.reduce((s, p) => s + p.verbaNominal, 0)
  const saldoTotal    = totalVerbas - totalGasto
  const imoveisAtivos = properties.filter(p => p.ativo).length
  const pendentes     = campaigns.filter(c => c.status === 'Solicitado')

  const corretores = Array.from(new Set(properties.map(p => p.corretor)))

  /* ── Property edit ────────────────────────────────────── */

  function openEditProp(propId: string) {
    const prop = properties.find(p => p.id === propId)
    if (!prop) return
    setEditPropId(propId)
    setEditPropForm({ verbaNominal: String(prop.verbaNominal), nota: prop.nota, ativo: prop.ativo })
    setEditPropModal(true)
  }

  function handleSaveEditProp() {
    setProperties(prev => prev.map(p =>
      p.id === editPropId
        ? { ...p, verbaNominal: Number(editPropForm.verbaNominal) || p.verbaNominal, nota: editPropForm.nota, ativo: editPropForm.ativo }
        : p
    ))
    setEditPropModal(false)
  }

  /* ── Campaign edit ────────────────────────────────────── */

  function openEditCamp(campId: string) {
    const camp = campaigns.find(c => c.id === campId)
    if (!camp) return
    setEditCampId(campId)
    setEditCampForm({
      tipo:           camp.tipo,
      descricao:      camp.descricao,
      valor:          String(camp.valor),
      data:           camp.data,
      status:         camp.status,
      motivoRejeicao: camp.motivoRejeicao ?? '',
    })
    setEditCampModal(true)
  }

  function handleSaveEditCamp() {
    setCampaigns(prev => prev.map(c =>
      c.id === editCampId
        ? {
            ...c,
            tipo:           editCampForm.tipo,
            descricao:      editCampForm.descricao,
            valor:          Number(editCampForm.valor) || c.valor,
            data:           editCampForm.data,
            status:         editCampForm.status,
            motivoRejeicao: editCampForm.motivoRejeicao,
          }
        : c
    ))
    setEditCampModal(false)
  }

  /* ── Approve / Reject ─────────────────────────────────── */

  function handleApprove(campId: string) {
    setCampaigns(prev => prev.map(c =>
      c.id === campId ? { ...c, status: 'Aprovado', motivoRejeicao: '' } : c
    ))
  }

  function openReject(campId: string) {
    setRejectCampId(campId)
    setRejectReason('')
    setRejectModal(true)
  }

  function handleConfirmReject() {
    setCampaigns(prev => prev.map(c =>
      c.id === rejectCampId ? { ...c, status: 'Rejeitado', motivoRejeicao: rejectReason } : c
    ))
    setRejectModal(false)
  }

  /* ── Add campaign (admin bypass) ──────────────────────── */

  function handleAddCamp() {
    if (!addCampForm.propId || !addCampForm.tipo || !addCampForm.valor) return
    const prop = properties.find(p => p.id === addCampForm.propId)
    if (!prop) return
    const newCamp: Campaign = {
      id:           `CA-${Date.now()}`,
      propId:       addCampForm.propId,
      tipo:         addCampForm.tipo,
      descricao:    addCampForm.descricao || addCampForm.tipo,
      valor:        Number(addCampForm.valor),
      data:         isoToDisplay(addCampForm.data),
      solicitadoPor: 'Admin',
      status:       addCampForm.status,
      motivoRejeicao: '',
    }
    setCampaigns(prev => [...prev, newCamp])
    setAddCampModal(false)
    setAddCampForm({ propId: '', tipo: '', descricao: '', valor: '', data: todayISO(), status: 'Aprovado' })
  }

  /* ── Filter campaigns ─────────────────────────────────── */

  const filteredCampaigns = campaigns.filter(camp => {
    const prop = properties.find(p => p.id === camp.propId)
    if (filterCorretor !== 'todos' && prop?.corretor !== filterCorretor) return false
    if (filterTipo     !== 'todos' && camp.tipo !== filterTipo)           return false
    if (filterStatus   !== 'todos' && camp.status !== filterStatus)       return false
    return true
  })

  /* ── Misc ─────────────────────────────────────────────── */

  const editProp = properties.find(p => p.id === editPropId)

  function getPropStatusBadge(used: number, verbaNominal: number, ativo: boolean) {
    if (!ativo) return { label: 'Suspenso',     cls: styles['badge--gray']  }
    const avail = verbaNominal - used
    if (used === 0)  return { label: 'Sem Campanha',   cls: styles['badge--gray']  }
    if (avail > 0)   return { label: 'Com Verba',      cls: styles['badge--green'] }
    return               { label: 'Verba Esgotada', cls: styles['badge--red']   }
  }

  return (
    <>
      <Topbar title="Fundo de Marketing — Administração" />

      <div className={styles.page}>
        {/* Header */}
        <div className={styles.page__header}>
          <h1 className={styles.page__title}>Fundo de Marketing — Administração</h1>
          <p className={styles.page__subtitle}>Gerencie verbas, aprove solicitações e audite todas as campanhas</p>
        </div>

        {/* KPI cards */}
        <div className={styles.kpis}>
          <StatCard label="Saldo Total do Fundo" value={fmtBRL(saldoTotal)}   trendLabel="disponível para campanhas" icon={<IconWallet />} />
          <StatCard label="Total Comprometido"   value={fmtBRL(totalGasto)}   trendLabel="em campanhas no pipeline"  icon={<IconTrendUp />} variant="accent" />
          <StatCard label="ROI Médio"            value="340%"                 trendLabel="retorno sobre investimento" icon={<IconTarget />} />
          <StatCard label="Imóveis Ativos"       value={imoveisAtivos}        trendLabel="no fundo de marketing"      icon={<IconHome />} />
        </div>

        {/* ── Pending requests — prominent ─────────────────── */}
        <Card>
          <CardHeader>
            <div className={styles.card__header}>
              <span className={styles.card__title}>Solicitações Pendentes</span>
              <span className={cn(styles.pending__count, pendentes.length === 0 && styles['pending__count--zero'])}>
                {pendentes.length}
              </span>
            </div>
          </CardHeader>
          <CardBody>
            {pendentes.length === 0 ? (
              <p className={styles.empty__msg}>Nenhuma solicitação pendente no momento.</p>
            ) : (
              <div className={styles.table__wrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Corretor</th>
                      <th className={styles.th}>Imóvel</th>
                      <th className={styles.th}>Tipo</th>
                      <th className={styles.th}>Descrição</th>
                      <th className={styles.th}>Valor Solicitado</th>
                      <th className={styles.th}>Data</th>
                      <th className={styles.th}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendentes.map(camp => {
                      const prop = properties.find(p => p.id === camp.propId)
                      return (
                        <tr key={camp.id} className={styles.tr}>
                          <td className={styles.td}>{camp.solicitadoPor}</td>
                          <td className={styles.td}>
                            <p className={styles.prop__name}>{prop?.endereco ?? '—'}</p>
                            <p className={styles.prop__tipo}>{prop?.tipo ?? ''}</p>
                          </td>
                          <td className={styles.td}>
                            <span className={styles.tipo__badge}>{camp.tipo}</span>
                          </td>
                          <td className={cn(styles.td, styles['td--desc'])}>{camp.descricao}</td>
                          <td className={cn(styles.td, styles['td--mono'], styles['td--bold'])}>{fmtBRL(camp.valor)}</td>
                          <td className={styles.td}>{camp.data}</td>
                          <td className={styles.td}>
                            <div className={styles.actions__row}>
                              <button type="button" className={cn(styles.action__btn, styles['action__btn--approve'])} onClick={() => handleApprove(camp.id)}>
                                ✓ Aprovar
                              </button>
                              <button type="button" className={cn(styles.action__btn, styles['action__btn--reject'])} onClick={() => openReject(camp.id)}>
                                ✗ Rejeitar
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>

        {/* ── Budget management table ───────────────────────── */}
        <Card>
          <CardHeader>
            <div className={styles.card__header}>
              <span className={styles.card__title}>Gerenciamento de Verbas</span>
              <Button variant="secondary" size="sm" onClick={() => setAddCampModal(true)}>
                + Registrar Campanha
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className={styles.table__wrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Imóvel</th>
                    <th className={styles.th}>Corretor</th>
                    <th className={styles.th}>Valor do Imóvel</th>
                    <th className={styles.th}>Verba Calculada</th>
                    <th className={styles.th}>Verba Ajustada</th>
                    <th className={styles.th}>Comprometido</th>
                    <th className={styles.th}>Disponível</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Editar</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(prop => {
                    const used     = usedPerProp[prop.id] ?? 0
                    const avail    = prop.verbaNominal - used
                    const calcAuto = calcBudgetAuto(prop.valor)
                    const isAdj    = prop.verbaNominal !== calcAuto
                    const badge    = getPropStatusBadge(used, prop.verbaNominal, prop.ativo)

                    return (
                      <tr key={prop.id} className={styles.tr}>
                        <td className={styles.td}>
                          <p className={styles.prop__name}>{prop.endereco}</p>
                          <p className={styles.prop__tipo}>{prop.tipo}</p>
                        </td>
                        <td className={styles.td}>{prop.corretor}</td>
                        <td className={cn(styles.td, styles['td--mono'])}>{fmtBRL(prop.valor)}</td>
                        <td className={cn(styles.td, styles['td--mono'], styles['td--muted'])}>{fmtBRL(calcAuto)}</td>
                        <td className={cn(styles.td, styles['td--mono'], styles['td--bold'])}>
                          {fmtBRL(prop.verbaNominal)}
                          {isAdj && <span className={styles.adjusted__tag}> (ajustado)</span>}
                        </td>
                        <td className={cn(styles.td, styles['td--mono'], used > 0 && styles['td--used'])}>{fmtBRL(used)}</td>
                        <td className={cn(styles.td, styles['td--mono'], avail > 0 ? styles['td--avail'] : styles['td--danger'])}>{fmtBRL(avail)}</td>
                        <td className={styles.td}>
                          <span className={cn(styles.badge, badge.cls)}>{badge.label}</span>
                        </td>
                        <td className={styles.td}>
                          <Button variant="secondary" size="sm" onClick={() => openEditProp(prop.id)}>Editar</Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* ── ROI panel ────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <span className={styles.card__title}>Retorno sobre Investimento</span>
          </CardHeader>
          <CardBody>
            <div className={styles.roi__grid}>
              <div className={styles.roi__box}>
                <span className={styles.roi__label}>Comprometido no Fundo</span>
                <span className={styles.roi__value}>{fmtBRL(totalGasto)}</span>
              </div>
              <div className={styles.roi__box}>
                <span className={styles.roi__label}>Comissões Geradas</span>
                <span className={styles.roi__value}>R$ 89.400</span>
              </div>
              <div className={styles.roi__box}>
                <span className={styles.roi__label}>ROI do Fundo</span>
                <span className={cn(styles.roi__value, styles['roi__value--accent'])}>2.003%</span>
              </div>
            </div>
            <p className={styles.roi__note}>
              ROI calculado com base nas comissões de vendas fechadas durante o período de campanha ativa.
            </p>
          </CardBody>
        </Card>

        {/* ── Campaign audit ────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className={styles.card__header}>
              <span className={styles.card__title}>Auditoria de Campanhas</span>
              <div className={styles.filters}>
                <select className={styles.filter__select} value={filterCorretor} onChange={e => setFilterCorretor(e.target.value)} aria-label="Filtrar por corretor">
                  <option value="todos">Todos os corretores</option>
                  {corretores.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className={styles.filter__select} value={filterTipo} onChange={e => setFilterTipo(e.target.value)} aria-label="Filtrar por tipo">
                  <option value="todos">Todos os tipos</option>
                  {TIPOS_CAMPANHA.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select className={styles.filter__select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)} aria-label="Filtrar por status">
                  <option value="todos">Todos os status</option>
                  <option value="Solicitado">Solicitado</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Rejeitado">Rejeitado</option>
                  <option value="Executado">Executado</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className={styles.table__wrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Data</th>
                    <th className={styles.th}>Imóvel</th>
                    <th className={styles.th}>Corretor</th>
                    <th className={styles.th}>Tipo</th>
                    <th className={styles.th}>Descrição</th>
                    <th className={styles.th}>Valor</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map(camp => {
                    const prop  = properties.find(p => p.id === camp.propId)
                    const sb    = campStatusBadge(camp.status)
                    return (
                      <tr key={camp.id} className={styles.tr}>
                        <td className={styles.td}>{camp.data}</td>
                        <td className={styles.td}>
                          <p className={styles.prop__name}>{prop?.endereco ?? '—'}</p>
                        </td>
                        <td className={styles.td}>{prop?.corretor ?? '—'}</td>
                        <td className={styles.td}>
                          <span className={styles.tipo__badge}>{camp.tipo}</span>
                        </td>
                        <td className={cn(styles.td, styles['td--desc'])}>{camp.descricao}</td>
                        <td className={cn(styles.td, styles['td--mono'], styles['td--bold'])}>{fmtBRL(camp.valor)}</td>
                        <td className={styles.td}>
                          <span className={cn(styles.badge, sb.cls)}>{sb.label}</span>
                        </td>
                        <td className={styles.td}>
                          <div className={styles.actions__row}>
                            {camp.status === 'Solicitado' && (
                              <>
                                <button type="button" className={cn(styles.action__btn, styles['action__btn--approve'])} onClick={() => handleApprove(camp.id)}>✓ Aprovar</button>
                                <button type="button" className={cn(styles.action__btn, styles['action__btn--reject'])} onClick={() => openReject(camp.id)}>✗ Rejeitar</button>
                              </>
                            )}
                            <button type="button" className={cn(styles.action__btn, styles['action__btn--edit'])} onClick={() => openEditCamp(camp.id)}>Editar</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredCampaigns.length === 0 && (
                    <tr>
                      <td colSpan={8} className={styles['td--center']}>Nenhuma campanha encontrada com os filtros aplicados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── Modal: Edit property budget ─────────────────────── */}
      <Modal
        isOpen={editPropModal}
        onClose={() => setEditPropModal(false)}
        title="Editar Verba do Imóvel"
        maxWidth="34rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={() => setEditPropModal(false)}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleSaveEditProp}>Salvar</Button>
          </div>
        }
      >
        <div className={styles.form}>
          {editProp && <p className={styles.form__prop__label}>{editProp.endereco}</p>}
          <Input
            label="Verba Ajustada (R$)"
            type="number"
            value={editPropForm.verbaNominal}
            onChange={e => setEditPropForm(p => ({ ...p, verbaNominal: e.target.value }))}
          />
          <Textarea
            label="Nota de ajuste"
            rows={2}
            value={editPropForm.nota}
            onChange={e => setEditPropForm(p => ({ ...p, nota: e.target.value }))}
            placeholder="Ex: Imóvel premium — verba ampliada por decisão da diretoria"
          />
          <div className={styles.toggle__row}>
            <label className={styles.pjtoggle}>
              <input
                type="checkbox"
                className={styles.pjtoggle__input}
                checked={editPropForm.ativo}
                onChange={e => setEditPropForm(p => ({ ...p, ativo: e.target.checked }))}
              />
              <span className={styles.pjtoggle__track} />
            </label>
            <span className={styles.toggle__label}>
              Incluir no Fundo de Marketing ({editPropForm.ativo ? 'Ativo' : 'Suspenso'})
            </span>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Edit campaign (full) ──────────────────────── */}
      <Modal
        isOpen={editCampModal}
        onClose={() => setEditCampModal(false)}
        title="Editar Campanha"
        maxWidth="38rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={() => setEditCampModal(false)}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleSaveEditCamp}>Salvar Alterações</Button>
          </div>
        }
      >
        <div className={styles.form}>
          <Select
            label="Tipo de Campanha"
            value={editCampForm.tipo}
            onChange={e => setEditCampForm(p => ({ ...p, tipo: e.target.value }))}
          >
            {TIPOS_CAMPANHA.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Textarea
            label="Descrição"
            rows={2}
            value={editCampForm.descricao}
            onChange={e => setEditCampForm(p => ({ ...p, descricao: e.target.value }))}
          />
          <div className={styles.form__row}>
            <Input
              label="Valor Solicitado (R$)"
              type="number"
              value={editCampForm.valor}
              onChange={e => setEditCampForm(p => ({ ...p, valor: e.target.value }))}
            />
            <Input
              label="Data (dd/mm/aaaa)"
              value={editCampForm.data}
              onChange={e => setEditCampForm(p => ({ ...p, data: e.target.value }))}
            />
          </div>
          <Select
            label="Status"
            value={editCampForm.status}
            onChange={e => setEditCampForm(p => ({ ...p, status: e.target.value as CampaignStatus }))}
          >
            <option value="Solicitado">Solicitado</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Rejeitado">Rejeitado</option>
            <option value="Executado">Executado</option>
          </Select>
          {editCampForm.status === 'Rejeitado' && (
            <Input
              label="Motivo da Rejeição"
              value={editCampForm.motivoRejeicao}
              onChange={e => setEditCampForm(p => ({ ...p, motivoRejeicao: e.target.value }))}
              placeholder="Descreva o motivo..."
            />
          )}
        </div>
      </Modal>

      {/* ── Modal: Rejection reason ──────────────────────────── */}
      <Modal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        title="Rejeitar Solicitação"
        maxWidth="32rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={() => setRejectModal(false)}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleConfirmReject}>Confirmar Rejeição</Button>
          </div>
        }
      >
        <div className={styles.form}>
          <p className={styles.reject__info}>
            O corretor verá esta mensagem ao consultar a campanha rejeitada.
          </p>
          <Textarea
            label="Motivo da rejeição (opcional)"
            rows={3}
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Ex: Verba insuficiente no período — aguardar próximo mês."
          />
        </div>
      </Modal>

      {/* ── Modal: Add campaign (admin bypass) ──────────────── */}
      <Modal
        isOpen={addCampModal}
        onClose={() => setAddCampModal(false)}
        title="Registrar Campanha Diretamente"
        maxWidth="38rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={() => setAddCampModal(false)}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleAddCamp}>Registrar</Button>
          </div>
        }
      >
        <div className={styles.form}>
          <Select
            label="Imóvel"
            value={addCampForm.propId}
            onChange={e => setAddCampForm(p => ({ ...p, propId: e.target.value }))}
            required
          >
            <option value="">Selecione o imóvel...</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.endereco}</option>)}
          </Select>
          <Select
            label="Tipo de Campanha"
            value={addCampForm.tipo}
            onChange={e => setAddCampForm(p => ({ ...p, tipo: e.target.value }))}
            required
          >
            <option value="">Selecione o tipo...</option>
            {TIPOS_CAMPANHA.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Textarea
            label="Descrição"
            rows={2}
            value={addCampForm.descricao}
            onChange={e => setAddCampForm(p => ({ ...p, descricao: e.target.value }))}
            placeholder="Descreva a campanha..."
          />
          <div className={styles.form__row}>
            <Input
              label="Valor (R$)"
              type="number"
              value={addCampForm.valor}
              onChange={e => setAddCampForm(p => ({ ...p, valor: e.target.value }))}
              required
            />
            <Input
              label="Data"
              type="date"
              value={addCampForm.data}
              onChange={e => setAddCampForm(p => ({ ...p, data: e.target.value }))}
            />
          </div>
          <Select
            label="Status inicial"
            value={addCampForm.status}
            onChange={e => setAddCampForm(p => ({ ...p, status: e.target.value as CampaignStatus }))}
          >
            <option value="Solicitado">Solicitado</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Executado">Executado</option>
          </Select>
        </div>
      </Modal>
    </>
  )
}
