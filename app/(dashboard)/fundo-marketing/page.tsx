'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Card, { CardBody } from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input, { Select } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import styles from './page.module.css'

/* ── Types ──────────────────────────────────────────────── */

type CampaignStatus = 'Solicitado' | 'Aprovado' | 'Rejeitado' | 'Executado'

interface Campaign {
  id: string
  requestId?: string
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

interface CampaignItem {
  tipo: string
  valor: string
  descricao: string
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

const BROKER_PROPS: Property[] = [
  { id: 'P001', endereco: 'Rua Venâncio Aires, 1230 — Apto 302', tipo: 'Apartamento', valor: 320_000, verbaNominal: 800,   corretor: 'Marcos Souza' },
  { id: 'P002', endereco: 'Av. Medianeira, 890 — Casa',           tipo: 'Casa',        valor: 480_000, verbaNominal: 1_200, corretor: 'Marcos Souza' },
  { id: 'P003', endereco: 'Rua Dr. Bozzano, 456 — Apto 501',     tipo: 'Apartamento', valor: 195_000, verbaNominal: 487,   corretor: 'Marcos Souza' },
]

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 'C001', requestId: 'R001', propId: 'P001', tipo: 'Tráfego Pago Meta',   descricao: 'Impulsionamento Instagram',     valor: 200, valorReal: 185, data: '05/04/2026', dataExecucao: '07/04/2026', solicitadoPor: 'Marcos Souza', registradoPor: 'Carlos Lima', status: 'Executado',  motivoRejeicao: '' },
  { id: 'C002', requestId: 'R001', propId: 'P001', tipo: 'Material Gráfico',    descricao: 'Arte para Stories — Abril',     valor: 250, valorReal: 250, data: '05/04/2026', dataExecucao: '07/04/2026', solicitadoPor: 'Marcos Souza', registradoPor: 'Carlos Lima', status: 'Executado',  motivoRejeicao: '' },
  { id: 'C003', requestId: 'R002', propId: 'P001', tipo: 'Tráfego Pago Google', descricao: 'Google Ads — Venâncio 1230',    valor: 200, data: '20/04/2026', solicitadoPor: 'Marcos Souza', status: 'Aprovado',   motivoRejeicao: '' },
  { id: 'C004', requestId: 'R003', propId: 'P002', tipo: 'Portal Imobiliário',  descricao: 'Destaque ZAP — Medianeira 890', valor: 300, data: '25/04/2026', solicitadoPor: 'Marcos Souza', status: 'Solicitado', motivoRejeicao: '' },
  { id: 'C005', requestId: 'R004', propId: 'P003', tipo: 'Tráfego Pago Meta',   descricao: 'Campanha Instagram — Bozzano',  valor: 250, valorReal: 250, data: '08/04/2026', dataExecucao: '10/04/2026', solicitadoPor: 'Marcos Souza', registradoPor: 'Carlos Lima', status: 'Executado', motivoRejeicao: '' },
  { id: 'C006', requestId: 'R005', propId: 'P003', tipo: 'Fotografia/Vídeo',    descricao: 'Ensaio Fotográfico — Bozzano',  valor: 180, data: '20/05/2026', solicitadoPor: 'Marcos Souza', status: 'Rejeitado', motivoRejeicao: 'Verba insuficiente no período — aguardar próximo mês.' },
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

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconAlert() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

/* ── Campaign status badge ──────────────────────────────── */

function campStatusBadge(status: CampaignStatus) {
  switch (status) {
    case 'Solicitado': return { label: 'Solicitado', cls: styles['camp__badge--amber'] }
    case 'Aprovado':   return { label: 'Aprovado',   cls: styles['camp__badge--green'] }
    case 'Rejeitado':  return { label: 'Rejeitado',  cls: styles['camp__badge--red']   }
    case 'Executado':  return { label: 'Executado',  cls: styles['camp__badge--blue']  }
  }
}

/* ── Group campaigns by requestId ───────────────────────── */

function buildGroups(camps: Campaign[]): { key: string; campaigns: Campaign[] }[] {
  const groups: { key: string; campaigns: Campaign[] }[] = []
  const seen = new Set<string>()
  for (const camp of camps) {
    const key = camp.requestId ?? camp.id
    if (!seen.has(key)) {
      seen.add(key)
      groups.push({
        key,
        campaigns: camp.requestId
          ? camps.filter(c => c.requestId === camp.requestId)
          : [camp],
      })
    }
  }
  return groups
}

/* ── Component ──────────────────────────────────────────── */

export default function FundoMarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)

  // Request modal state
  const [reqModalOpen,    setReqModalOpen]    = useState(false)
  const [reqPropId,       setReqPropId]       = useState('')
  const [reqItems,        setReqItems]        = useState<CampaignItem[]>([{ tipo: '', valor: '', descricao: '' }])
  const [reqDataDesejada, setReqDataDesejada] = useState(todayISO())
  const [reqObservacoes,  setReqObservacoes]  = useState('')
  const [reqError,        setReqError]        = useState('')

  // Only broker's own properties
  const brokerPropIds   = new Set(BROKER_PROPS.map(p => p.id))
  const brokerCampaigns = campaigns.filter(c => brokerPropIds.has(c.propId))

  // Committed = non-rejected per property
  const committedPerProp: Record<string, number> = {}
  for (const prop of BROKER_PROPS) {
    committedPerProp[prop.id] = brokerCampaigns
      .filter(c => c.propId === prop.id && c.status !== 'Rejeitado')
      .reduce((s, c) => s + c.valor, 0)
  }

  const totalDisponivel   = BROKER_PROPS.reduce((s, p) => s + Math.max(0, p.verbaNominal - (committedPerProp[p.id] ?? 0)), 0)
  const totalComprometido = brokerCampaigns.filter(c => c.status !== 'Rejeitado').reduce((s, c) => s + c.valor, 0)
  const comVerba          = BROKER_PROPS.filter(p => (p.verbaNominal - (committedPerProp[p.id] ?? 0)) > 0).length
  const semVerba          = BROKER_PROPS.filter(p => (p.verbaNominal - (committedPerProp[p.id] ?? 0)) <= 0).length

  function getPropStatusBadge(committed: number, verbaNominal: number) {
    const avail = verbaNominal - committed
    if (committed === 0) return { label: 'Sem Campanha',   cls: styles['badge--gray']  }
    if (avail > 0)       return { label: 'Com Verba',      cls: styles['badge--green'] }
    return                    { label: 'Verba Esgotada', cls: styles['badge--red']   }
  }

  // Modal computed
  const reqProp  = BROKER_PROPS.find(p => p.id === reqPropId)
  const reqAvail = reqProp ? reqProp.verbaNominal - (committedPerProp[reqPropId] ?? 0) : 0
  const reqTotal = reqItems.reduce((s, item) => s + (Number(item.valor) || 0), 0)

  function openReqModal() {
    setReqPropId('')
    setReqItems([{ tipo: '', valor: '', descricao: '' }])
    setReqDataDesejada(todayISO())
    setReqObservacoes('')
    setReqError('')
    setReqModalOpen(true)
  }

  function addItem() {
    setReqItems(prev => [...prev, { tipo: '', valor: '', descricao: '' }])
  }

  function removeItem(idx: number) {
    setReqItems(prev => prev.filter((_, i) => i !== idx))
  }

  function updateItem(idx: number, field: keyof CampaignItem, value: string) {
    setReqItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  function handleSolicitarCampanha() {
    if (!reqPropId) {
      setReqError('Selecione um imóvel.')
      return
    }
    const invalidItem = reqItems.find(item => !item.tipo || !item.valor || Number(item.valor) <= 0)
    if (invalidItem) {
      setReqError('Preencha tipo e valor para todas as campanhas.')
      return
    }
    if (!reqDataDesejada) {
      setReqError('Informe a data desejada.')
      return
    }
    if (reqTotal > reqAvail) {
      setReqError(`Total de ${fmtBRL(reqTotal)} excede o saldo disponível de ${fmtBRL(reqAvail)}.`)
      return
    }
    const rid = `R-${Date.now()}`
    const newCamps: Campaign[] = reqItems.map((item, idx) => ({
      id:             `C-${Date.now()}-${idx}`,
      requestId:      rid,
      propId:         reqPropId,
      tipo:           item.tipo,
      descricao:      item.descricao || item.tipo,
      valor:          Number(item.valor),
      data:           isoToDisplay(reqDataDesejada),
      solicitadoPor:  'Marcos Souza',
      status:         'Solicitado' as CampaignStatus,
      motivoRejeicao: '',
    }))
    setCampaigns(prev => [...prev, ...newCamps])
    setReqModalOpen(false)
    setReqError('')
  }

  return (
    <>
      <Topbar title="Fundo de Marketing" />

      <div className={styles.page}>
        {/* Header */}
        <div className={styles.page__header}>
          <div className={styles.page__header__text}>
            <h1 className={styles.page__title}>Fundo de Marketing</h1>
            <p className={styles.page__subtitle}>Verba disponível para campanhas dos seus imóveis</p>
          </div>
          <Button variant="primary" size="sm" onClick={openReqModal}>
            + Solicitar Nova Campanha
          </Button>
        </div>

        {/* KPI stat cards */}
        <div className={styles.kpis}>
          <StatCard
            label="Total Disponível"
            value={fmtBRL(totalDisponivel)}
            trendLabel="saldo restante nos seus imóveis"
            icon={<IconWallet />}
          />
          <StatCard
            label="Total Comprometido"
            value={fmtBRL(totalComprometido)}
            trendLabel="em campanhas ativas e pendentes"
            icon={<IconTrendUp />}
            variant="accent"
          />
          <StatCard
            label="Imóveis com Verba"
            value={comVerba}
            trendLabel="com saldo disponível"
            icon={<IconHome />}
          />
          <StatCard
            label="Imóveis sem Verba"
            value={semVerba}
            trendLabel="verba esgotada"
            icon={<IconAlert />}
          />
        </div>

        {/* Info banner */}
        <div className={styles.banner}>
          <p className={styles.banner__text}>
            Clique em &ldquo;+ Solicitar Nova Campanha&rdquo; para enviar uma solicitação. O admin aprova, o gestor executa, e você acompanha o saldo em tempo real.
          </p>
        </div>

        {/* Property card list */}
        <div className={styles.list}>
          {BROKER_PROPS.map(prop => {
            const committed    = committedPerProp[prop.id] ?? 0
            const avail        = prop.verbaNominal - committed
            const commPct      = prop.verbaNominal > 0 ? Math.min(100, Math.round((committed / prop.verbaNominal) * 100)) : 0
            const availPct     = prop.verbaNominal > 0 ? Math.min(100, Math.round((avail / prop.verbaNominal) * 100)) : 0
            const propBadge    = getPropStatusBadge(committed, prop.verbaNominal)
            const propCampaigns = brokerCampaigns.filter(c => c.propId === prop.id)
            const groups       = buildGroups(propCampaigns)

            return (
              <Card key={prop.id}>
                <CardBody>
                  <div className={styles.prop}>
                    {/* Top row */}
                    <div className={styles.prop__top}>
                      <div>
                        <p className={styles.prop__address}>{prop.endereco}</p>
                        <p className={styles.prop__meta}>{prop.tipo} · {fmtBRL(prop.valor)}</p>
                      </div>
                      <span className={cn(styles.badge, propBadge.cls)}>{propBadge.label}</span>
                    </div>

                    {/* Budget numbers */}
                    <div className={styles.budget__row}>
                      <div className={styles.budget__item}>
                        <span className={styles.budget__label}>Verba Total</span>
                        <span className={styles.budget__value}>{fmtBRL(prop.verbaNominal)}</span>
                      </div>
                      <div className={styles.budget__item}>
                        <span className={styles.budget__label}>Comprometido</span>
                        <span className={cn(styles.budget__value, committed > 0 ? styles['budget__value--used'] : styles['budget__value--zero'])}>{fmtBRL(committed)}</span>
                      </div>
                      <div className={styles.budget__item}>
                        <span className={styles.budget__label}>Disponível</span>
                        <span className={cn(styles.budget__value, avail > 0 ? styles['budget__value--avail'] : styles['budget__value--zero'])}>{fmtBRL(avail)}</span>
                      </div>
                    </div>

                    {/* Stacked progress bar */}
                    <div className={styles.progress}>
                      <div className={styles.progress__used}  style={{ width: `${commPct}%` }} />
                      <div className={styles.progress__avail} style={{ width: `${availPct}%` }} />
                    </div>
                    <p className={styles.progress__label}>{commPct}% comprometido · {fmtBRL(avail)} disponível</p>

                    {/* Divider */}
                    <hr className={styles.divider} />

                    {/* Campaigns section */}
                    <div className={styles.camp__section__head}>
                      <p className={styles.camp__head}>Histórico de Solicitações</p>
                      {groups.length > 0 && (
                        <span className={styles.camp__count}>{groups.length}</span>
                      )}
                    </div>

                    {groups.length === 0 ? (
                      <p className={styles.camp__empty}>Nenhuma campanha ainda. Use &ldquo;+ Solicitar Nova Campanha&rdquo; no topo da página.</p>
                    ) : (
                      <div className={styles.camp__list}>
                        {groups.map(group => {
                          const first      = group.campaigns[0]
                          const sb         = campStatusBadge(first.status)
                          const groupTotal = group.campaigns.reduce((s, c) => s + c.valor, 0)
                          return (
                            <div key={group.key} className={styles.req__group}>
                              <div className={styles.req__group__header}>
                                <span className={styles.camp__date}>{first.data}</span>
                                <span className={cn(styles.camp__badge, sb.cls)}>{sb.label}</span>
                                {group.campaigns.length > 1 && (
                                  <span className={styles.req__item__count}>{group.campaigns.length} itens</span>
                                )}
                                <span className={styles.req__group__total}>{fmtBRL(groupTotal)}</span>
                              </div>
                              <div className={styles.req__items}>
                                {group.campaigns.map(camp => (
                                  <div key={camp.id} className={styles.req__item}>
                                    <span className={styles.tipo__badge}>{camp.tipo}</span>
                                    <span className={styles.req__item__desc}>{camp.descricao}</span>
                                    <span className={styles.req__item__valor}>{fmtBRL(camp.valor)}</span>
                                  </div>
                                ))}
                              </div>
                              {first.status === 'Rejeitado' && first.motivoRejeicao && (
                                <p className={styles.camp__reason}>Motivo: {first.motivoRejeicao}</p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Modal: Solicitar Campanha */}
      <Modal
        isOpen={reqModalOpen}
        onClose={() => setReqModalOpen(false)}
        title="Solicitar Campanha"
        maxWidth="40rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={() => setReqModalOpen(false)}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleSolicitarCampanha}>Enviar Solicitação</Button>
          </div>
        }
      >
        <div className={styles.form}>
          <Select
            label="Imóvel"
            value={reqPropId}
            onChange={e => { setReqPropId(e.target.value); setReqError('') }}
            required
          >
            <option value="">Selecione o imóvel...</option>
            {BROKER_PROPS.map(p => {
              const avail = p.verbaNominal - (committedPerProp[p.id] ?? 0)
              return (
                <option key={p.id} value={p.id} disabled={avail <= 0}>
                  {p.endereco} — Disponível: {fmtBRL(avail)}
                </option>
              )
            })}
          </Select>

          {/* Campaign items section */}
          <div className={styles.items__section}>
            <p className={styles.items__section__label}>Campanhas desta Solicitação</p>
            <div className={styles.items__list}>
              {reqItems.map((item, idx) => (
                <div key={idx} className={styles.modal__item}>
                  <div className={styles.modal__item__top}>
                    <select
                      className={styles.item__select}
                      value={item.tipo}
                      onChange={e => { updateItem(idx, 'tipo', e.target.value); setReqError('') }}
                      required
                    >
                      <option value="">Tipo de campanha...</option>
                      {TIPOS_CAMPANHA.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input
                      className={styles.item__input}
                      type="number"
                      value={item.valor}
                      onChange={e => { updateItem(idx, 'valor', e.target.value); setReqError('') }}
                      placeholder="R$"
                      min="1"
                      required
                    />
                    {idx > 0 && (
                      <button
                        type="button"
                        className={styles.item__remove}
                        onClick={() => removeItem(idx)}
                        aria-label="Remover campanha"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <input
                    className={cn(styles.item__input, styles['item__input--desc'])}
                    type="text"
                    value={item.descricao}
                    onChange={e => updateItem(idx, 'descricao', e.target.value)}
                    placeholder="Descrição breve (opcional)"
                  />
                </div>
              ))}
            </div>
            <button type="button" className={styles.add__item__btn} onClick={addItem}>
              + Adicionar Outra Campanha
            </button>
            <div className={styles.total__row}>
              <span className={styles.total__label}>Total da Solicitação</span>
              <div className={styles.total__right}>
                <span className={cn(styles.total__value, reqPropId && reqTotal > reqAvail && styles['total__value--over'])}>
                  {fmtBRL(reqTotal)}
                </span>
                {reqPropId && (
                  <span className={styles.total__avail}>de {fmtBRL(reqAvail)} disponível</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.form__row}>
            <Input
              label="Data Desejada"
              type="date"
              value={reqDataDesejada}
              onChange={e => setReqDataDesejada(e.target.value)}
              required
            />
            <Input
              label="Observações Gerais"
              value={reqObservacoes}
              onChange={e => setReqObservacoes(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          {reqError && (
            <div className={styles.error__banner}>
              <p className={styles.error__text}>{reqError}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
