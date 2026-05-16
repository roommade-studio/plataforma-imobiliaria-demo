'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import Modal from '@/components/ui/Modal'
import Input, { Select } from '@/components/ui/Input'
import KanbanBoard, { type KanbanItem, type KanbanColumnDef } from '@/components/kanban/KanbanBoard'
import styles from './page.module.css'

/* ── Icons ───────────────────────────────────────────────── */

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
function IconExchange() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}
function IconCheckCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
function IconPercent() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  )
}

/* ── Columns ─────────────────────────────────────────────── */

const COLUMNS: KanbanColumnDef[] = [
  { id: 'leads',         title: 'Leads',             color: '#3b82f6' },
  { id: 'visita',        title: 'Visita Agendada',    color: '#f59e0b' },
  { id: 'negociacao',    title: 'Negociações',         color: '#8b5cf6' },
  { id: 'contrato',      title: 'Em Contrato',         color: '#f97316' },
  { id: 'ganhas',        title: 'Ganhas',              color: '#22c55e' },
  { id: 'perdidas',      title: 'Perdidas',            color: '#64748b' },
]

/* ── Mock items ──────────────────────────────────────────── */

const INITIAL_ITEMS: KanbanItem[] = [
  {
    id: 'lead-1',
    columnId: 'leads',
    title: 'Rafael Andrade',
    subtitle: 'Busca apartamento em Pinheiros',
    badge: 'Novo',
    badgeColor: 'blue',
    meta: [
      { label: 'Temperatura',   value: 'Quente 🔥' },
      { label: 'Tipo',          value: 'Apartamento 2D' },
      { label: 'Orçamento máx', value: 'R$ 650.000' },
      { label: 'Dormitórios',   value: '2' },
      { label: 'Vagas',         value: '1' },
    ],
    tags: ['Financiamento'],
  },
  {
    id: 'lead-2',
    columnId: 'leads',
    title: 'Camila Ferreira',
    subtitle: 'Casa com quintal — zona sul',
    badge: 'Novo',
    badgeColor: 'blue',
    meta: [
      { label: 'Temperatura',   value: 'Morno ☀️' },
      { label: 'Tipo',          value: 'Casa' },
      { label: 'Orçamento máx', value: 'R$ 900.000' },
      { label: 'Dormitórios',   value: '3' },
      { label: 'Vagas',         value: '2' },
    ],
    tags: ['À Vista'],
  },
  {
    id: 'lead-3',
    columnId: 'leads',
    title: 'Diego Cavalcanti',
    subtitle: 'Studio ou 1D — região central',
    badge: 'Novo',
    badgeColor: 'blue',
    meta: [
      { label: 'Temperatura',   value: 'Frio ❄️' },
      { label: 'Tipo',          value: 'Apartamento 1D' },
      { label: 'Orçamento máx', value: 'R$ 380.000' },
      { label: 'Dormitórios',   value: '1' },
      { label: 'Vagas',         value: '0' },
    ],
    tags: ['Financiamento'],
  },
  {
    id: 'lead-4',
    columnId: 'visita',
    title: 'Bruno Menezes',
    subtitle: 'Apartamento 3D — Moema ou Itaim',
    badge: 'Visita',
    badgeColor: 'yellow',
    meta: [
      { label: 'Temperatura',   value: 'Quente 🔥' },
      { label: 'Tipo',          value: 'Apartamento 3D' },
      { label: 'Orçamento máx', value: 'R$ 1.100.000' },
      { label: 'Dormitórios',   value: '3' },
      { label: 'Vagas',         value: '2' },
    ],
    tags: ['Urgente', 'Financiamento'],
  },
  {
    id: 'lead-5',
    columnId: 'visita',
    title: 'Patrícia Souza',
    subtitle: 'Cobertura duplex — Jardins',
    badge: 'Visita',
    badgeColor: 'yellow',
    meta: [
      { label: 'Temperatura',   value: 'Quente 🔥' },
      { label: 'Tipo',          value: 'Cobertura' },
      { label: 'Orçamento máx', value: 'R$ 1.800.000' },
      { label: 'Dormitórios',   value: '4' },
      { label: 'Vagas',         value: '3' },
    ],
    tags: ['À Vista'],
  },
  {
    id: 'lead-6',
    columnId: 'negociacao',
    title: 'Thiago Nunes',
    subtitle: 'Apartamento 2D — Vila Madalena',
    badge: 'Negociação',
    badgeColor: 'purple',
    meta: [
      { label: 'Temperatura',   value: 'Quente 🔥' },
      { label: 'Tipo',          value: 'Apartamento 2D' },
      { label: 'Orçamento máx', value: 'R$ 720.000' },
      { label: 'Dormitórios',   value: '2' },
      { label: 'Vagas',         value: '1' },
    ],
    tags: ['Urgente'],
  },
  {
    id: 'lead-7',
    columnId: 'negociacao',
    title: 'Fernanda Lima',
    subtitle: 'Casa em condomínio — Alphaville',
    badge: 'Negociação',
    badgeColor: 'purple',
    meta: [
      { label: 'Temperatura',   value: 'Morno ☀️' },
      { label: 'Tipo',          value: 'Casa condomínio' },
      { label: 'Orçamento máx', value: 'R$ 1.400.000' },
      { label: 'Dormitórios',   value: '4' },
      { label: 'Vagas',         value: '3' },
    ],
    tags: ['Financiamento'],
  },
  {
    id: 'lead-8',
    columnId: 'contrato',
    title: 'Marcelo Rocha',
    subtitle: 'Apartamento 4D — Jardim Europa',
    badge: 'Contrato',
    badgeColor: 'yellow',
    meta: [
      { label: 'Temperatura',   value: 'Quente 🔥' },
      { label: 'Tipo',          value: 'Apartamento 4D' },
      { label: 'Orçamento máx', value: 'R$ 2.200.000' },
      { label: 'Dormitórios',   value: '4' },
      { label: 'Vagas',         value: '3' },
    ],
    tags: ['À Vista'],
  },
  {
    id: 'lead-9',
    columnId: 'ganhas',
    title: 'Juliana Costa',
    subtitle: 'Casa térrea 3D — Vila Prudente',
    badge: 'Ganha',
    badgeColor: 'green',
    meta: [
      { label: 'Temperatura',   value: 'Quente 🔥' },
      { label: 'Tipo',          value: 'Casa' },
      { label: 'Orçamento máx', value: 'R$ 680.000' },
      { label: 'Dormitórios',   value: '3' },
      { label: 'Vagas',         value: '2' },
    ],
    tags: ['Financiamento'],
  },
  {
    id: 'lead-10',
    columnId: 'perdidas',
    title: 'Eduardo Pires',
    subtitle: 'Apartamento 2D — Tatuapé',
    badge: 'Perdida',
    badgeColor: 'gray',
    meta: [
      { label: 'Temperatura',   value: 'Frio ❄️' },
      { label: 'Tipo',          value: 'Apartamento 2D' },
      { label: 'Orçamento máx', value: 'R$ 420.000' },
      { label: 'Dormitórios',   value: '2' },
      { label: 'Vagas',         value: '1' },
    ],
    tags: ['Financiamento'],
  },
  {
    id: 'lead-11',
    columnId: 'perdidas',
    title: 'Simone Alves',
    subtitle: 'Studio comercial — Centro',
    badge: 'Perdida',
    badgeColor: 'gray',
    meta: [
      { label: 'Temperatura',   value: 'Frio ❄️' },
      { label: 'Tipo',          value: 'Sala comercial' },
      { label: 'Orçamento máx', value: 'R$ 310.000' },
      { label: 'Dormitórios',   value: '0' },
      { label: 'Vagas',         value: '1' },
    ],
    tags: ['À Vista'],
  },
]

/* ── Portfolio properties ────────────────────────────────── */

interface PortfolioProp {
  id:          string
  endereco:    string
  tipo:        string
  dormitorios: number
  vagas:       number
  preco:       number
}

const PORTFOLIO: PortfolioProp[] = [
  { id: 'pp1',  endereco: 'Rua dos Pinheiros, 450 — Pinheiros',            tipo: 'Apartamento',    dormitorios: 2, vagas: 1, preco: 620_000   },
  { id: 'pp2',  endereco: 'Al. Joaquim Eugênio de Lima, 33 — Jardins',     tipo: 'Apartamento',    dormitorios: 2, vagas: 1, preco: 680_000   },
  { id: 'pp3',  endereco: 'Rua Frei Caneca, 600 — Consolação',             tipo: 'Apartamento',    dormitorios: 2, vagas: 1, preco: 595_000   },
  { id: 'pp4',  endereco: 'Rua Oscar Freire, 412 — Jardins (Cobertura)',   tipo: 'Cobertura',      dormitorios: 4, vagas: 3, preco: 1_780_000 },
  { id: 'pp5',  endereco: 'Av. Paulista, 1578 — Bela Vista',               tipo: 'Apartamento',    dormitorios: 3, vagas: 2, preco: 1_050_000 },
  { id: 'pp6',  endereco: 'Al. Santos, 700 — Jardim Paulista',             tipo: 'Sala Comercial', dormitorios: 0, vagas: 1, preco: 690_000   },
  { id: 'pp7',  endereco: 'Rua Haddock Lobo, 55 — Jardins',                tipo: 'Apartamento',    dormitorios: 1, vagas: 0, preco: 370_000   },
  { id: 'pp8',  endereco: 'Rua José Maria Lisboa, 220 — Jardins',          tipo: 'Casa',           dormitorios: 3, vagas: 2, preco: 870_000   },
  { id: 'pp9',  endereco: 'Cond. Tamboré — Santana de Parnaíba',           tipo: 'Casa',           dormitorios: 4, vagas: 3, preco: 1_350_000 },
  { id: 'pp10', endereco: 'Rua Consolação, 1050 — Studio',                 tipo: 'Apartamento',    dormitorios: 1, vagas: 0, preco: 295_000   },
  { id: 'pp11', endereco: 'Av. Brigadeiro Faria Lima, 4300 — Itaim Bibi',  tipo: 'Apartamento',    dormitorios: 4, vagas: 3, preco: 2_150_000 },
  { id: 'pp12', endereco: 'Rua Funchal, 418 — Apto 54 — Vila Olímpia',    tipo: 'Apartamento',    dormitorios: 2, vagas: 1, preco: 820_000   },
]

function fmtBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function parseBRL(s: string): number {
  return parseInt(s.replace(/\D/g, ''), 10) || 0
}

function tipoMatches(leadTipo: string, propTipo: string): boolean {
  const l = leadTipo.toLowerCase()
  const p = propTipo.toLowerCase()
  if (p === 'apartamento') return l.includes('apartamento') || l.includes('studio')
  if (p === 'casa') return l.includes('casa') || l.includes('condomínio')
  if (p === 'cobertura') return l.includes('cobertura')
  if (p === 'sala comercial') return l.includes('comercial') || l.includes('sala')
  return false
}

function scoreMatch(item: KanbanItem, prop: PortfolioProp): number {
  const orcamento  = parseBRL(item.meta?.find(m => m.label === 'Orçamento máx')?.value ?? '0')
  const dorms      = parseInt(item.meta?.find(m => m.label === 'Dormitórios')?.value ?? '0', 10)
  const tipoStr    = item.meta?.find(m => m.label === 'Tipo')?.value ?? ''
  const vagasLead  = parseInt(item.meta?.find(m => m.label === 'Vagas')?.value ?? '0', 10)

  let score = 0
  if (prop.preco <= orcamento)             score += 40
  else if (prop.preco <= orcamento * 1.05) score += 20
  if (tipoMatches(tipoStr, prop.tipo))     score += 30
  if (prop.dormitorios === dorms)          score += 20
  else if (Math.abs(prop.dormitorios - dorms) === 1) score += 10
  if (prop.vagas === vagasLead)            score += 10
  else if (Math.abs(prop.vagas - vagasLead) === 1)   score += 5
  return score
}

function autoMatchIds(item: KanbanItem): string[] {
  const orcamento = parseBRL(item.meta?.find(m => m.label === 'Orçamento máx')?.value ?? '0')
  const dorms     = parseInt(item.meta?.find(m => m.label === 'Dormitórios')?.value ?? '0', 10)
  const tipoStr   = item.meta?.find(m => m.label === 'Tipo')?.value ?? ''

  return PORTFOLIO
    .filter(p => {
      const precoOk = p.preco <= orcamento * 1.05
      const tipoOk  = tipoMatches(tipoStr, p.tipo)
      const dormOk  = Math.abs(p.dormitorios - dorms) <= 1
      return precoOk && tipoOk && dormOk
    })
    .sort((a, b) => scoreMatch(item, b) - scoreMatch(item, a))
    .map(p => p.id)
}

interface LeadMatch { propId: string; manual: boolean }
type LeadMatchState = Record<string, LeadMatch[]>

/* ── Component ──────────────────────────────────────────── */

export default function PipelinePage() {
  const [items, setItems] = useState<KanbanItem[]>(INITIAL_ITEMS)

  const [leadMatches, setLeadMatches] = useState<LeadMatchState>(() => {
    const init: LeadMatchState = {}
    INITIAL_ITEMS.forEach(item => {
      init[item.id] = autoMatchIds(item).map(id => ({ propId: id, manual: false }))
    })
    return init
  })

  /* Add lead modal */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [form, setForm] = useState({
    nome: '', telefone: '', orcamento: '', tipoImovel: '', dormitorios: '', vagas: '', temperatura: 'Morno ☀️', interesse: '',
  })

  /* Card detail modal */
  const [selectedItem, setSelectedItem] = useState<KanbanItem | null>(null)
  const [isEditing,      setIsEditing]      = useState(false)
  const [propSearch,     setPropSearch]     = useState('')
  const [showPropPicker, setShowPropPicker] = useState(false)

  /* Auto-sale confirmation modal (Ganhas) */
  const [pendingMoveItem,  setPendingMoveItem]  = useState<KanbanItem | null>(null)
  const [pendingTargetCol, setPendingTargetCol] = useState<string>('')
  const [isSaleModalOpen,  setIsSaleModalOpen]  = useState(false)

  function handleMove(itemId: string, targetColumnId: string) {
    const item = items.find((i) => i.id === itemId)
    if (targetColumnId === 'ganhas' && item && item.columnId !== 'ganhas') {
      setPendingMoveItem(item)
      setPendingTargetCol(targetColumnId)
      setIsSaleModalOpen(true)
      return
    }
    applyMove(itemId, targetColumnId)
  }

  function applyMove(itemId: string, targetColumnId: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, columnId: targetColumnId } : i))
    )
  }

  function confirmMove(createSale: boolean) {
    if (pendingMoveItem) {
      applyMove(pendingMoveItem.id, pendingTargetCol)
      // In a real implementation: if (createSale) { create sale record }
    }
    setIsSaleModalOpen(false)
    setPendingMoveItem(null)
    setPendingTargetCol('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newItem: KanbanItem = {
      id: `lead-${Date.now()}`,
      columnId: 'leads',
      title: form.nome,
      subtitle: form.tipoImovel,
      badge: 'Novo',
      badgeColor: 'blue',
      meta: [
        { label: 'Temperatura',   value: form.temperatura || 'Morno ☀️' },
        { label: 'Tipo',          value: form.tipoImovel   || '—' },
        { label: 'Orçamento máx', value: form.orcamento    || '—' },
        { label: 'Dormitórios',   value: form.dormitorios  || '—' },
        { label: 'Vagas',         value: form.vagas        || '—' },
      ],
      tags: [],
    }
    setItems((prev) => [...prev, newItem])
    setLeadMatches(prev => ({
      ...prev,
      [newItem.id]: autoMatchIds(newItem).map(id => ({ propId: id, manual: false })),
    }))
    setForm({ nome: '', telefone: '', orcamento: '', tipoImovel: '', dormitorios: '', vagas: '', temperatura: 'Morno ☀️', interesse: '' })
    setIsAddModalOpen(false)
  }

  function addPropToLead(leadId: string, propId: string) {
    setLeadMatches(prev => ({
      ...prev,
      [leadId]: [...(prev[leadId] ?? []), { propId, manual: true }],
    }))
  }

  function removePropFromLead(leadId: string, propId: string) {
    setLeadMatches(prev => ({
      ...prev,
      [leadId]: (prev[leadId] ?? []).filter(m => m.propId !== propId),
    }))
  }

  function openLeadModal(item: KanbanItem) {
    setSelectedItem(item)
    setIsEditing(false)
    setPropSearch('')
    setShowPropPicker(false)
  }

  function closeLeadModal() {
    setSelectedItem(null)
    setIsEditing(false)
    setPropSearch('')
    setShowPropPicker(false)
  }

  /* Stats */
  const ativos      = items.filter((i) => !['ganhas', 'perdidas'].includes(i.columnId)).length
  const negociacao  = items.filter((i) => ['negociacao', 'contrato'].includes(i.columnId)).length
  const convertidos = items.filter((i) => i.columnId === 'ganhas').length
  const taxa        = items.length > 0 ? Math.round((convertidos / items.length) * 100) : 0

  return (
    <>
      <Topbar
        title="Pipeline de Compradores"
        actions={
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            + Adicionar Lead
          </Button>
        }
      />

      <div className={styles.page}>
        {/* Stats */}
        <div className={styles.page__stats}>
          <StatCard label="Leads Ativos"        value={ativos}      trend={12.5}  trendLabel="vs. mês anterior" icon={<IconUsers />} />
          <StatCard label="Em Negociação"        value={negociacao}  trend={8.3}   trendLabel="vs. mês anterior" icon={<IconExchange />} />
          <StatCard label="Convertidos no Mês"   value={convertidos} trend={-4.2}  trendLabel="vs. mês anterior" icon={<IconCheckCircle />} />
          <StatCard label="Taxa de Conversão"    value={`${taxa}%`}  trend={2.1}   trendLabel="vs. mês anterior" variant="accent" icon={<IconPercent />} />
        </div>

        {/* Kanban */}
        <div className={styles.page__board}>
          <KanbanBoard
            columns={COLUMNS}
            items={items}
            onMove={handleMove}
            onItemClick={openLeadModal}
          />
        </div>
      </div>

      {/* ── Modal: Adicionar Lead ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar Novo Lead"
        footer={
          <div className={styles.modal__actions}>
            <Button variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleSubmit}>Adicionar Lead</Button>
          </div>
        }
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Nome completo"
            placeholder="Ex: João da Silva"
            value={form.nome}
            onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
            required
          />
          <Input
            label="Telefone"
            placeholder="(11) 9 0000-0000"
            type="tel"
            value={form.telefone}
            onChange={(e) => setForm((p) => ({ ...p, telefone: e.target.value }))}
          />
          <Select
            label="Temperatura"
            value={form.temperatura}
            onChange={(e) => setForm((p) => ({ ...p, temperatura: e.target.value }))}
          >
            <option value="Quente 🔥">Quente 🔥</option>
            <option value="Morno ☀️">Morno ☀️</option>
            <option value="Frio ❄️">Frio ❄️</option>
          </Select>
          <Select
            label="Tipo de imóvel"
            value={form.tipoImovel}
            onChange={(e) => setForm((p) => ({ ...p, tipoImovel: e.target.value }))}
          >
            <option value="">Selecione...</option>
            <option value="Apartamento 1D">Apartamento 1D</option>
            <option value="Apartamento 2D">Apartamento 2D</option>
            <option value="Apartamento 3D">Apartamento 3D</option>
            <option value="Casa">Casa</option>
            <option value="Casa condomínio">Casa em condomínio</option>
            <option value="Cobertura">Cobertura</option>
            <option value="Sala comercial">Sala comercial</option>
          </Select>
          <Input
            label="Orçamento máximo"
            placeholder="Ex: R$ 800.000"
            value={form.orcamento}
            onChange={(e) => setForm((p) => ({ ...p, orcamento: e.target.value }))}
          />
          <div className={styles.form__row}>
            <Input
              label="Dormitórios"
              placeholder="Ex: 2"
              type="number"
              value={form.dormitorios}
              onChange={(e) => setForm((p) => ({ ...p, dormitorios: e.target.value }))}
            />
            <Input
              label="Vagas"
              placeholder="Ex: 1"
              type="number"
              value={form.vagas}
              onChange={(e) => setForm((p) => ({ ...p, vagas: e.target.value }))}
            />
          </div>
          <Input
            label="Observações"
            placeholder="Ex: Próximo a metrô, aceita permuta..."
            value={form.interesse}
            onChange={(e) => setForm((p) => ({ ...p, interesse: e.target.value }))}
          />
        </form>
      </Modal>

      {/* ── Modal: Detalhes do Lead + Imóveis Compatíveis ── */}
      {selectedItem && (() => {
        const matchList   = leadMatches[selectedItem.id] ?? []
        const matchedIds  = new Set(matchList.map(m => m.propId))
        const matched     = matchList.map(m => ({ match: m, prop: PORTFOLIO.find(p => p.id === m.propId)! })).filter(x => x.prop)
        const unmatched   = PORTFOLIO.filter(p => !matchedIds.has(p.id))
        return (
          <Modal
            isOpen={!!selectedItem}
            onClose={closeLeadModal}
            title={`Imóveis — ${selectedItem.title}`}
            maxWidth="40rem"
            footer={
              <div className={styles.modal__actions}>
                <Button variant="tertiary"  size="sm" onClick={closeLeadModal}>Perder Lead</Button>
                <Button variant="secondary" size="sm" onClick={closeLeadModal}>Agendar Visita</Button>
                <Button variant="primary"   size="sm" onClick={closeLeadModal}>Registrar Contato</Button>
              </div>
            }
          >
            <div className={styles.detail__body}>
              <div className={styles.detail__section}>
                <p className={styles.detail__label}>Preferências do comprador</p>
                <dl className={styles.detail__meta}>
                  {selectedItem.meta?.map((m) => (
                    <div key={m.label} className={styles.detail__meta__row}>
                      <dt className={styles.detail__meta__key}>{m.label}</dt>
                      <dd className={styles.detail__meta__val}>{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className={styles.detail__section}>
                <div className={styles.detail__section__header}>
                  <p className={styles.detail__label}>
                    Imóveis na lista
                    {matched.length > 0 && <span className={styles.match__count}>{matched.length}</span>}
                  </p>
                  <button
                    type="button"
                    className={cn(styles.match__edit__btn, isEditing && styles['match__edit__btn--active'])}
                    onClick={() => {
                      if (isEditing) {
                        setIsEditing(false)
                        setShowPropPicker(false)
                        setPropSearch('')
                      } else {
                        setIsEditing(true)
                      }
                    }}
                  >
                    {isEditing ? 'Concluir Edição' : 'Editar Sugestões'}
                  </button>
                </div>

                <div className={styles.match__list}>
                  {matched.length === 0 && (
                    <p className={styles.match__empty}>Nenhum imóvel adicionado ainda.</p>
                  )}
                  {matched.map(({ match, prop }) => {
                    const score = match.manual ? null : scoreMatch(selectedItem, prop)
                    return (
                      <div key={prop.id} className={styles.match__card}>
                        <div className={styles.match__info}>
                          <span className={styles.match__address}>{prop.endereco}</span>
                          <span className={styles.match__type}>
                            {prop.tipo} · {fmtBRL(prop.preco)} · {prop.dormitorios}D · {prop.vagas}V
                          </span>
                        </div>
                        <div className={styles.match__card__right}>
                          {match.manual ? (
                            <span className={styles['match__badge--manual']}>Manual</span>
                          ) : score !== null && (
                            <span className={styles.match__pct} data-match={score >= 90 ? 'high' : score >= 70 ? 'mid' : 'low'}>
                              {score}%
                            </span>
                          )}
                          {isEditing && (
                            <button
                              type="button"
                              className={cn(styles.match__remove__btn, styles['match__remove__btn--editing'])}
                              onClick={() => removePropFromLead(selectedItem.id, prop.id)}
                              aria-label="Remover da lista"
                            >×</button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {isEditing && (
                  <div className={styles.match__add__area}>
                    {!showPropPicker ? (
                      <button
                        type="button"
                        className={styles.match__add__prop__btn}
                        onClick={() => setShowPropPicker(true)}
                        disabled={unmatched.length === 0}
                      >
                        + Adicionar Imóvel
                      </button>
                    ) : (
                      <div className={styles.prop__picker}>
                        <input
                          type="text"
                          className={styles.prop__picker__input}
                          placeholder="Buscar imóvel na carteira..."
                          value={propSearch}
                          onChange={(e) => setPropSearch(e.target.value)}
                          autoFocus
                        />
                        <div className={styles.prop__picker__list}>
                          {(() => {
                            const filtered = unmatched.filter(p =>
                              p.endereco.toLowerCase().includes(propSearch.toLowerCase()) ||
                              p.tipo.toLowerCase().includes(propSearch.toLowerCase())
                            )
                            return filtered.length === 0 ? (
                              <p className={styles.prop__picker__empty}>Nenhum imóvel encontrado.</p>
                            ) : filtered.map(prop => (
                              <button
                                key={prop.id}
                                type="button"
                                className={styles.prop__picker__item}
                                onClick={() => {
                                  addPropToLead(selectedItem.id, prop.id)
                                  setPropSearch('')
                                  setShowPropPicker(false)
                                }}
                              >
                                <span className={styles.prop__picker__item__address}>{prop.endereco}</span>
                                <span className={styles.prop__picker__item__meta}>
                                  {prop.tipo} · {fmtBRL(prop.preco)} · {prop.dormitorios}D · {prop.vagas}V
                                </span>
                              </button>
                            ))
                          })()}
                        </div>
                        <button
                          type="button"
                          className={styles.prop__picker__cancel}
                          onClick={() => { setShowPropPicker(false); setPropSearch('') }}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )
      })()}

      {/* ── Modal: Confirmação de Venda ao mover para Ganhas ── */}
      <Modal
        isOpen={isSaleModalOpen}
        onClose={() => { setIsSaleModalOpen(false); setPendingMoveItem(null) }}
        title="Criar registro de venda?"
        footer={
          <div className={styles.modal__actions}>
            <Button variant="secondary" size="sm" onClick={() => confirmMove(false)}>
              Apenas Mover
            </Button>
            <Button variant="primary" size="sm" onClick={() => confirmMove(true)}>
              Confirmar e Criar Venda
            </Button>
          </div>
        }
      >
        <div className={styles.confirm__body}>
          <p className={styles.confirm__text}>
            Deseja criar automaticamente um registro de venda para este lead?
          </p>
          <dl className={styles.confirm__dl}>
            <div className={styles.confirm__row}>
              <dt className={styles.confirm__key}>Comprador</dt>
              <dd className={styles.confirm__val}>{pendingMoveItem?.title}</dd>
            </div>
            <div className={styles.confirm__row}>
              <dt className={styles.confirm__key}>VGV estimado</dt>
              <dd className={styles.confirm__val}>R$ 890.000</dd>
            </div>
            <div className={styles.confirm__row}>
              <dt className={styles.confirm__key}>Comissão estimada</dt>
              <dd className={styles.confirm__val}>R$ 26.700</dd>
            </div>
          </dl>
        </div>
      </Modal>
    </>
  )
}
