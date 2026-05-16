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

interface Property {
  id: string
  endereco: string
  tipo: string
  valor: number
  verbaNominal: number
  corretor: string
}

/* ── Helpers ────────────────────────────────────────────── */

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

const ALL_PROPS: Property[] = [
  { id: 'P001', endereco: 'Rua Venâncio Aires, 1230 — Apto 302',        tipo: 'Apartamento',    valor: 320_000, verbaNominal: 800,   corretor: 'Marcos Souza' },
  { id: 'P002', endereco: 'Av. Medianeira, 890 — Casa',                  tipo: 'Casa',           valor: 480_000, verbaNominal: 1_200, corretor: 'Marcos Souza' },
  { id: 'P003', endereco: 'Rua Dr. Bozzano, 456 — Apto 501',            tipo: 'Apartamento',    valor: 195_000, verbaNominal: 487,   corretor: 'Marcos Souza' },
  { id: 'P004', endereco: 'Rua Venâncio Aires, 540 — Casa',              tipo: 'Casa',           valor: 650_000, verbaNominal: 1_625, corretor: 'Ana Beatriz'  },
  { id: 'P005', endereco: 'Rua Floriano Peixoto, 210 — Sala Comercial',  tipo: 'Sala Comercial', valor: 280_000, verbaNominal: 700,   corretor: 'Rafael Mota'  },
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

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconDollar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconMegaphone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z" />
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

export default function GestorTrafego() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)

  // Execution modal state
  const [execModalOpen, setExecModalOpen] = useState(false)
  const [execCampId,    setExecCampId]    = useState('')
  const [execForm,      setExecForm]      = useState({ valorReal: '', tipo: '', descricaoExec: '', dataExecucao: todayISO() })
  const [execError,     setExecError]     = useState('')

  // Derived: committed per property (non-rejected)
  const committedPerProp: Record<string, number> = {}
  const executedPerProp:  Record<string, number> = {}
  const reservedPerProp:  Record<string, number> = {}
  for (const prop of ALL_PROPS) {
    const propCamps = campaigns.filter(c => c.propId === prop.id)
    executedPerProp[prop.id] = propCamps.filter(c => c.status === 'Executado').reduce((s, c) => s + c.valor, 0)
    reservedPerProp[prop.id] = propCamps.filter(c => c.status === 'Solicitado' || c.status === 'Aprovado').reduce((s, c) => s + c.valor, 0)
    committedPerProp[prop.id] = executedPerProp[prop.id] + reservedPerProp[prop.id]
  }

  const totalFundo    = ALL_PROPS.reduce((s, p) => s + p.verbaNominal, 0)
  const totalExecutado = campaigns.filter(c => c.status === 'Executado').reduce((s, c) => s + (c.valorReal ?? c.valor), 0)
  const totalDisp     = ALL_PROPS.reduce((s, p) => s + Math.max(0, p.verbaNominal - (committedPerProp[p.id] ?? 0)), 0)
  const aprovadas     = campaigns.filter(c => c.status === 'Aprovado')

  function openExecModal(campId: string) {
    const camp = campaigns.find(c => c.id === campId)
    if (!camp) return
    setExecCampId(campId)
    setExecForm({ valorReal: '', tipo: camp.tipo, descricaoExec: '', dataExecucao: todayISO() })
    setExecError('')
    setExecModalOpen(true)
  }

  function handleConfirmarExecucao() {
    const camp = campaigns.find(c => c.id === execCampId)
    if (!camp) return
    if (!execForm.valorReal || !execForm.dataExecucao) {
      setExecError('Preencha o valor real gasto e a data de execução.')
      return
    }
    const valorNum = Number(execForm.valorReal)
    if (valorNum <= 0) {
      setExecError('O valor deve ser maior que zero.')
      return
    }
    if (valorNum > camp.valor) {
      setExecError(`O valor real (${fmtBRL(valorNum)}) não pode exceder o valor aprovado de ${fmtBRL(camp.valor)}.`)
      return
    }
    setCampaigns(prev => prev.map(c =>
      c.id === execCampId
        ? {
            ...c,
            status:       'Executado',
            valorReal:    valorNum,
            tipo:         execForm.tipo || c.tipo,
            descricao:    execForm.descricaoExec || c.descricao,
            dataExecucao: isoToDisplay(execForm.dataExecucao),
            registradoPor: 'Carlos Lima',
          }
        : c
    ))
    setExecModalOpen(false)
    setExecError('')
  }

  const execCamp = campaigns.find(c => c.id === execCampId)
  const execProp = execCamp ? ALL_PROPS.find(p => p.id === execCamp.propId) : undefined

  function getPropStatusBadge(committed: number, verbaNominal: number) {
    const avail = verbaNominal - committed
    if (committed === 0) return { label: 'Sem Campanha',   cls: styles['badge--gray']  }
    if (avail > 0)       return { label: 'Com Verba',      cls: styles['badge--green'] }
    return                    { label: 'Verba Esgotada', cls: styles['badge--red']   }
  }

  const sortedHistory = [...campaigns].sort((a, b) => {
    const parse = (d: string) => {
      const [day, month, year] = d.split('/')
      return new Date(`${year}-${month}-${day}`).getTime()
    }
    return parse(b.data) - parse(a.data)
  })

  return (
    <>
      <Topbar title="Gestão de Tráfego" />

      <div className={styles.page}>
        {/* Header */}
        <div className={styles.page__header}>
          <h1 className={styles.page__title}>Gestão de Tráfego</h1>
          <p className={styles.page__subtitle}>Execute campanhas aprovadas pelo admin e registre os gastos reais</p>
        </div>

        {/* KPI cards */}
        <div className={styles.kpis}>
          <StatCard
            label="Total do Fundo"
            value={fmtBRL(totalFundo)}
            trendLabel="orçamento total da carteira"
            icon={<IconWallet />}
          />
          <StatCard
            label="Total Executado"
            value={fmtBRL(totalExecutado)}
            trendLabel="gasto real registrado"
            icon={<IconDollar />}
            variant="accent"
          />
          <StatCard
            label="Aprovadas p/ Executar"
            value={aprovadas.length}
            trendLabel="aguardando execução"
            icon={<IconCheck />}
          />
          <StatCard
            label="Saldo Disponível"
            value={fmtBRL(totalDisp)}
            trendLabel="disponível para novas campanhas"
            icon={<IconMegaphone />}
          />
        </div>

        {/* Approved campaigns — awaiting execution */}
        <Card>
          <CardHeader>
            <div className={styles.card__header}>
              <span className={styles.card__title}>Aprovadas — Aguardando Execução</span>
              {aprovadas.length > 0 && (
                <span className={styles.pending__count}>{aprovadas.length}</span>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {aprovadas.length === 0 ? (
              <p className={styles.empty__msg}>Nenhuma campanha aprovada aguardando execução no momento.</p>
            ) : (
              <div className={styles.table__wrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Corretor</th>
                      <th className={styles.th}>Imóvel</th>
                      <th className={styles.th}>Tipo</th>
                      <th className={styles.th}>Descrição</th>
                      <th className={styles.th}>Valor Aprovado</th>
                      <th className={styles.th}>Data Solicitada</th>
                      <th className={styles.th}>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aprovadas.map(camp => {
                      const prop = ALL_PROPS.find(p => p.id === camp.propId)
                      return (
                        <tr key={camp.id} className={styles.tr}>
                          <td className={styles.td}>{prop?.corretor ?? '—'}</td>
                          <td className={styles.td}>
                            <p className={styles.prop__name}>{prop?.endereco ?? '—'}</p>
                            <p className={styles.prop__tipo}>{prop?.tipo ?? ''}</p>
                          </td>
                          <td className={styles.td}>
                            <span className={styles.tipo__badge}>{camp.tipo}</span>
                          </td>
                          <td className={cn(styles.td, styles['td--desc'])}>{camp.descricao}</td>
                          <td className={cn(styles.td, styles['td--mono'], styles['td--bold'], styles['td--green'])}>{fmtBRL(camp.valor)}</td>
                          <td className={styles.td}>{camp.data}</td>
                          <td className={styles.td}>
                            <Button variant="primary" size="sm" onClick={() => openExecModal(camp.id)}>
                              Registrar Gasto
                            </Button>
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

        {/* Budget overview table */}
        <Card>
          <CardHeader>
            <span className={styles.card__title}>Orçamento por Imóvel</span>
          </CardHeader>
          <CardBody>
            <div className={styles.table__wrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Imóvel</th>
                    <th className={styles.th}>Corretor</th>
                    <th className={styles.th}>Verba Total</th>
                    <th className={styles.th}>Executado</th>
                    <th className={styles.th}>Reservado</th>
                    <th className={styles.th}>Disponível</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_PROPS.map(prop => {
                    const executed = executedPerProp[prop.id] ?? 0
                    const reserved = reservedPerProp[prop.id] ?? 0
                    const committed = committedPerProp[prop.id] ?? 0
                    const avail    = prop.verbaNominal - committed
                    const badge    = getPropStatusBadge(committed, prop.verbaNominal)

                    return (
                      <tr key={prop.id} className={styles.tr}>
                        <td className={styles.td}>
                          <p className={styles.prop__name}>{prop.endereco}</p>
                          <p className={styles.prop__tipo}>{prop.tipo}</p>
                        </td>
                        <td className={styles.td}>{prop.corretor}</td>
                        <td className={cn(styles.td, styles['td--mono'])}>{fmtBRL(prop.verbaNominal)}</td>
                        <td className={cn(styles.td, styles['td--mono'], executed > 0 && styles['td--used'])}>{fmtBRL(executed)}</td>
                        <td className={cn(styles.td, styles['td--mono'], reserved > 0 && styles['td--amber'])}>{fmtBRL(reserved)}</td>
                        <td className={cn(styles.td, styles['td--mono'], avail > 0 ? styles['td--avail'] : styles['td--empty'])}>{fmtBRL(avail)}</td>
                        <td className={styles.td}>
                          <span className={cn(styles.badge, badge.cls)}>{badge.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Campaign history */}
        <Card>
          <CardHeader>
            <span className={styles.card__title}>Histórico de Campanhas</span>
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
                    <th className={styles.th}>Valor Solicitado</th>
                    <th className={styles.th}>Valor Real</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHistory.map(camp => {
                    const prop  = ALL_PROPS.find(p => p.id === camp.propId)
                    const sb    = campStatusBadge(camp.status)
                    return (
                      <tr key={camp.id} className={styles.tr}>
                        <td className={styles.td}>{camp.data}</td>
                        <td className={styles.td}>{prop?.endereco ?? '—'}</td>
                        <td className={styles.td}>{prop?.corretor ?? '—'}</td>
                        <td className={styles.td}>
                          <span className={styles.tipo__badge}>{camp.tipo}</span>
                        </td>
                        <td className={cn(styles.td, styles['td--desc'])}>{camp.descricao}</td>
                        <td className={cn(styles.td, styles['td--mono'])}>{fmtBRL(camp.valor)}</td>
                        <td className={cn(styles.td, styles['td--mono'], styles['td--bold'])}>
                          {camp.valorReal != null ? fmtBRL(camp.valorReal) : <span className={styles.td__dash}>—</span>}
                        </td>
                        <td className={styles.td}>
                          <span className={cn(styles.badge, sb.cls)}>{sb.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                  {sortedHistory.length === 0 && (
                    <tr>
                      <td colSpan={8} className={styles['td--center']}>Nenhuma campanha registrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal: Registrar Gasto */}
      <Modal
        isOpen={execModalOpen}
        onClose={() => setExecModalOpen(false)}
        title="Registrar Execução de Campanha"
        maxWidth="38rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={() => setExecModalOpen(false)}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleConfirmarExecucao}>Confirmar Gasto</Button>
          </div>
        }
      >
        <div className={styles.form}>
          <Input
            label="Imóvel"
            value={execProp?.endereco ?? ''}
            onChange={() => {}}
            readOnly
          />
          <div className={styles.form__row}>
            <Input
              label="Descrição da Solicitação"
              value={execCamp?.descricao ?? ''}
              onChange={() => {}}
              readOnly
            />
            <Input
              label="Valor Aprovado"
              value={execCamp ? fmtBRL(execCamp.valor) : ''}
              onChange={() => {}}
              readOnly
            />
          </div>
          <Select
            label="Tipo de Campanha"
            value={execForm.tipo}
            onChange={e => setExecForm(p => ({ ...p, tipo: e.target.value }))}
          >
            {TIPOS_CAMPANHA.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Textarea
            label="Descrição da Execução"
            rows={2}
            value={execForm.descricaoExec}
            onChange={e => setExecForm(p => ({ ...p, descricaoExec: e.target.value }))}
            placeholder="Descreva o que foi feito (opcional)..."
          />
          <div className={styles.form__row}>
            <Input
              label="Valor Real Gasto (R$)"
              type="number"
              value={execForm.valorReal}
              onChange={e => setExecForm(p => ({ ...p, valorReal: e.target.value }))}
              placeholder={`Máx: ${execCamp ? fmtBRL(execCamp.valor) : ''}`}
              required
            />
            <Input
              label="Data de Execução"
              type="date"
              value={execForm.dataExecucao}
              onChange={e => setExecForm(p => ({ ...p, dataExecucao: e.target.value }))}
              required
            />
          </div>
          {execError && (
            <div className={styles.error__banner}>
              <p className={styles.error__text}>{execError}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
