'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import Modal from '@/components/ui/Modal'
import Input, { Select } from '@/components/ui/Input'
import KanbanBoard, { type KanbanItem, type KanbanColumnDef } from '@/components/kanban/KanbanBoard'
import styles from './page.module.css'

/* ── Icons ───────────────────────────────────────────────── */

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
function IconXCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

/* ── Columns ─────────────────────────────────────────────── */

const COLUMNS: KanbanColumnDef[] = [
  { id: 'leads',           title: 'Leads',              color: '#3b82f6' },
  { id: 'visita-agendada', title: 'Visita Agendada',    color: '#f59e0b' },
  { id: 'visita-realizada',title: 'Visita Realizada',   color: '#14b8a6' },
  { id: 'acm-agendado',    title: 'ACM Agendado',       color: '#8b5cf6' },
  { id: 'acm-apresentado', title: 'ACM Apresentado',    color: '#f97316' },
  { id: 'gestao-assinada', title: 'Gestão Assinada',    color: '#22c55e' },
  { id: 'perdidos',        title: 'Perdidos',            color: '#64748b' },
]

/* ── Mock items ──────────────────────────────────────────── */

const INITIAL_ITEMS: KanbanItem[] = [
  {
    id: 'seller-1',
    columnId: 'leads',
    title: 'Sônia Barbosa',
    subtitle: 'Rua das Acácias, 312 — Pinheiros',
    badge: 'Nova',
    badgeColor: 'blue',
    meta: [
      { label: 'Valor pretendido', value: 'R$ 780.000' },
      { label: 'Tipo',             value: 'Apartamento' },
      { label: 'Área',             value: '82 m²' },
    ],
    tags: ['Exclusivo'],
  },
  {
    id: 'seller-2',
    columnId: 'leads',
    title: 'Renato Cavalcante',
    subtitle: 'Av. Paulista, 1840 — Bela Vista',
    badge: 'Nova',
    badgeColor: 'blue',
    meta: [
      { label: 'Valor pretendido', value: 'R$ 1.100.000' },
      { label: 'Tipo',             value: 'Sala comercial' },
      { label: 'Área',             value: '65 m²' },
    ],
    tags: ['Urgente'],
  },
  {
    id: 'seller-3',
    columnId: 'visita-agendada',
    title: 'Luciana Mendes',
    subtitle: 'R. Cel. Xavier de Toledo, 23 — Centro',
    badge: 'Visita',
    badgeColor: 'yellow',
    meta: [
      { label: 'Valor pretendido', value: 'R$ 430.000' },
      { label: 'Tipo',             value: 'Apartamento' },
      { label: 'Área',             value: '54 m²' },
    ],
    tags: ['Permuta'],
  },
  {
    id: 'seller-4',
    columnId: 'visita-agendada',
    title: 'Augusto Figueiredo',
    subtitle: 'Rua Gomes de Carvalho, 77 — Vila Olímpia',
    badge: 'Visita',
    badgeColor: 'yellow',
    meta: [
      { label: 'Valor pretendido', value: 'R$ 2.300.000' },
      { label: 'Tipo',             value: 'Casa' },
      { label: 'Área',             value: '320 m²' },
    ],
    tags: ['Exclusivo'],
  },
  {
    id: 'seller-5',
    columnId: 'visita-realizada',
    title: 'Miriam Santos',
    subtitle: 'Al. Santos, 200 — Jardins',
    badge: 'Realizada',
    badgeColor: 'green',
    meta: [
      { label: 'Valor pretendido', value: 'R$ 950.000' },
      { label: 'Tipo',             value: 'Cobertura' },
      { label: 'Área',             value: '140 m²' },
    ],
    tags: ['Exclusivo'],
  },
  {
    id: 'seller-6',
    columnId: 'acm-agendado',
    title: 'Carlos Drummond',
    subtitle: 'R. Vergueiro, 840 — Liberdade',
    badge: 'ACM',
    badgeColor: 'purple',
    meta: [
      { label: 'Valor pretendido', value: 'R$ 360.000' },
      { label: 'Tipo',             value: 'Apartamento' },
      { label: 'Área',             value: '48 m²' },
    ],
    tags: ['Urgente'],
  },
  {
    id: 'seller-7',
    columnId: 'acm-apresentado',
    title: 'Isabel Nogueira',
    subtitle: 'R. da Consolação, 3100 — Consolação',
    badge: 'ACM OK',
    badgeColor: 'yellow',
    meta: [
      { label: 'Valor pretendido', value: 'R$ 610.000' },
      { label: 'Tipo',             value: 'Apartamento' },
      { label: 'Área',             value: '72 m²' },
    ],
    tags: ['Permuta'],
  },
  {
    id: 'seller-8',
    columnId: 'gestao-assinada',
    title: 'Hélio Gonçalves',
    subtitle: 'Av. Brigadeiro Luís Antônio, 500 — Bela Vista',
    badge: 'Assinado',
    badgeColor: 'green',
    meta: [
      { label: 'Valor pretendido', value: 'R$ 1.400.000' },
      { label: 'Tipo',             value: 'Casa' },
      { label: 'Área',             value: '240 m²' },
    ],
    tags: ['Exclusivo'],
  },
  {
    id: 'seller-9',
    columnId: 'perdidos',
    title: 'Vera Rodrigues',
    subtitle: 'Av. Europa, 68 — Jardim Europa',
    badge: 'Perdido',
    badgeColor: 'gray',
    meta: [
      { label: 'Valor pretendido', value: 'R$ 880.000' },
      { label: 'Tipo',             value: 'Apartamento' },
      { label: 'Área',             value: '98 m²' },
    ],
    tags: ['Exclusivo'],
  },
  {
    id: 'seller-10',
    columnId: 'perdidos',
    title: 'Jorge Mansur',
    subtitle: 'R. Haddock Lobo, 1200 — Cerqueira César',
    badge: 'Perdido',
    badgeColor: 'gray',
    meta: [
      { label: 'Valor pretendido', value: 'R$ 530.000' },
      { label: 'Tipo',             value: 'Apartamento' },
      { label: 'Área',             value: '60 m²' },
    ],
    tags: [],
  },
]

/* ── Component ──────────────────────────────────────────── */

export default function SellerPipelinePage() {
  const [items, setItems] = useState<KanbanItem[]>(INITIAL_ITEMS)

  /* Add modal */
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    vendedor: '', endereco: '', tipo: '', valorPretendido: '', area: '',
  })

  /* Auto-create property dialog */
  const [pendingMoveItem,  setPendingMoveItem]  = useState<KanbanItem | null>(null)
  const [pendingTargetCol, setPendingTargetCol] = useState<string>('')
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false)

  /* Detail modal */
  const [detailItemId, setDetailItemId] = useState<string | null>(null)
  const [detailForm, setDetailForm] = useState({
    title: '', subtitle: '', tipo: '', valorPretendido: '', area: '', columnId: '',
  })

  function openDetail(item: KanbanItem) {
    setDetailItemId(item.id)
    setDetailForm({
      title:           item.title,
      subtitle:        item.subtitle ?? '',
      tipo:            item.meta?.find((m) => m.label === 'Tipo')?.value ?? '',
      valorPretendido: item.meta?.find((m) => m.label === 'Valor pretendido')?.value ?? '',
      area:            (item.meta?.find((m) => m.label === 'Área')?.value ?? '').replace(/\s*m²$/, ''),
      columnId:        item.columnId,
    })
  }

  function saveDetail() {
    if (!detailItemId) return
    setItems((prev) => prev.map((i) => i.id !== detailItemId ? i : {
      ...i,
      title:    detailForm.title,
      subtitle: detailForm.subtitle,
      columnId: detailForm.columnId,
      meta: [
        { label: 'Valor pretendido', value: detailForm.valorPretendido || '—' },
        { label: 'Tipo',             value: detailForm.tipo            || '—' },
        { label: 'Área',             value: detailForm.area ? `${detailForm.area} m²` : '—' },
      ],
    }))
    setDetailItemId(null)
  }

  function handleMove(itemId: string, targetColumnId: string) {
    const item = items.find((i) => i.id === itemId)
    if (targetColumnId === 'gestao-assinada' && item && item.columnId !== 'gestao-assinada') {
      setPendingMoveItem(item)
      setPendingTargetCol(targetColumnId)
      setIsPropertyModalOpen(true)
      return
    }
    applyMove(itemId, targetColumnId)
  }

  function applyMove(itemId: string, targetColumnId: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, columnId: targetColumnId } : i))
    )
  }

  function confirmPropertyCreation(create: boolean) {
    if (pendingMoveItem) {
      applyMove(pendingMoveItem.id, pendingTargetCol)
      // In a real implementation: if (create) { create property record in portfolio }
    }
    setIsPropertyModalOpen(false)
    setPendingMoveItem(null)
    setPendingTargetCol('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newItem: KanbanItem = {
      id: `seller-${Date.now()}`,
      columnId: 'leads',
      title: form.vendedor,
      subtitle: form.endereco,
      badge: 'Nova',
      badgeColor: 'blue',
      meta: [
        { label: 'Valor pretendido', value: form.valorPretendido || '—' },
        { label: 'Tipo',             value: form.tipo            || '—' },
        { label: 'Área',             value: form.area ? `${form.area} m²` : '—' },
      ],
    }
    setItems((prev) => [...prev, newItem])
    setForm({ vendedor: '', endereco: '', tipo: '', valorPretendido: '', area: '' })
    setIsModalOpen(false)
  }

  /* Stats */
  const captacoesAtivas = items.filter((i) => !['gestao-assinada', 'perdidos'].includes(i.columnId)).length
  const emAvaliacao     = items.filter((i) => ['acm-agendado', 'acm-apresentado'].includes(i.columnId)).length
  const gestaoAssinada  = items.filter((i) => i.columnId === 'gestao-assinada').length
  const perdidos        = items.filter((i) => i.columnId === 'perdidos').length

  return (
    <>
      <Topbar
        title="Pipeline de Vendedores"
        actions={
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            + Nova Captação
          </Button>
        }
      />

      <div className={styles.page}>
        {/* Stats */}
        <div className={styles.page__stats}>
          <StatCard
            label="Captações Ativas"
            value={captacoesAtivas}
            trend={15.0}
            trendLabel="vs. mês anterior"
            icon={<IconHome />}
          />
          <StatCard
            label="Em Avaliação (ACM)"
            value={emAvaliacao}
            trend={-5.5}
            trendLabel="vs. mês anterior"
            icon={<IconSearch />}
          />
          <StatCard
            label="Gestão Assinada"
            value={gestaoAssinada}
            trend={20.0}
            trendLabel="vs. mês anterior"
            icon={<IconFileCheck />}
          />
          <StatCard
            label="Perdidos no Mês"
            value={perdidos}
            trend={-10.0}
            trendLabel="vs. mês anterior"
            variant="accent"
            icon={<IconXCircle />}
          />
        </div>

        {/* Kanban */}
        <div className={styles.page__board}>
          <KanbanBoard
            columns={COLUMNS}
            items={items}
            onMove={handleMove}
            onItemClick={openDetail}
          />
        </div>
      </div>

      {/* ── Modal: Nova Captação ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Captação"
        footer={
          <div className={styles.modal__actions}>
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              Cadastrar Captação
            </Button>
          </div>
        }
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Nome do vendedor"
            placeholder="Ex: Maria Oliveira"
            value={form.vendedor}
            onChange={(e) => setForm((p) => ({ ...p, vendedor: e.target.value }))}
            required
          />
          <Input
            label="Endereço do imóvel"
            placeholder="Ex: Rua das Flores, 45 — Moema"
            value={form.endereco}
            onChange={(e) => setForm((p) => ({ ...p, endereco: e.target.value }))}
          />
          <Select
            label="Tipo de imóvel"
            value={form.tipo}
            onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
          >
            <option value="">Selecione...</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
            <option value="Cobertura">Cobertura</option>
            <option value="Sala comercial">Sala comercial</option>
            <option value="Terreno">Terreno</option>
            <option value="Galpão">Galpão</option>
          </Select>
          <Input
            label="Valor pretendido"
            placeholder="Ex: R$ 750.000"
            value={form.valorPretendido}
            onChange={(e) => setForm((p) => ({ ...p, valorPretendido: e.target.value }))}
          />
          <Input
            label="Área (m²)"
            placeholder="Ex: 80"
            type="number"
            value={form.area}
            onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
          />
        </form>
      </Modal>

      {/* ── Modal: Detalhes / Editar Captação ── */}
      <Modal
        isOpen={detailItemId !== null}
        onClose={() => setDetailItemId(null)}
        title="Detalhes da Captação"
        footer={
          <div className={styles.modal__actions}>
            <Button variant="secondary" size="sm" onClick={() => setDetailItemId(null)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={saveDetail}>
              Salvar Alterações
            </Button>
          </div>
        }
      >
        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); saveDetail() }}>
          <Input
            label="Nome do vendedor"
            value={detailForm.title}
            onChange={(e) => setDetailForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <Input
            label="Endereço do imóvel"
            value={detailForm.subtitle}
            onChange={(e) => setDetailForm((p) => ({ ...p, subtitle: e.target.value }))}
          />
          <Select
            label="Etapa do funil"
            value={detailForm.columnId}
            onChange={(e) => setDetailForm((p) => ({ ...p, columnId: e.target.value }))}
          >
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </Select>
          <Select
            label="Tipo de imóvel"
            value={detailForm.tipo}
            onChange={(e) => setDetailForm((p) => ({ ...p, tipo: e.target.value }))}
          >
            <option value="">Selecione...</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
            <option value="Cobertura">Cobertura</option>
            <option value="Sala comercial">Sala comercial</option>
            <option value="Terreno">Terreno</option>
            <option value="Galpão">Galpão</option>
          </Select>
          <Input
            label="Valor pretendido"
            value={detailForm.valorPretendido}
            onChange={(e) => setDetailForm((p) => ({ ...p, valorPretendido: e.target.value }))}
          />
          <Input
            label="Área (m²)"
            type="number"
            value={detailForm.area}
            onChange={(e) => setDetailForm((p) => ({ ...p, area: e.target.value }))}
          />
        </form>
      </Modal>

      {/* ── Modal: Criar imóvel automaticamente ── */}
      <Modal
        isOpen={isPropertyModalOpen}
        onClose={() => { setIsPropertyModalOpen(false); setPendingMoveItem(null) }}
        title="Criar imóvel na Minha Carteira?"
        footer={
          <div className={styles.modal__actions}>
            <Button variant="secondary" size="sm" onClick={() => confirmPropertyCreation(false)}>
              Apenas Mover
            </Button>
            <Button variant="primary" size="sm" onClick={() => confirmPropertyCreation(true)}>
              Confirmar e Cadastrar Imóvel
            </Button>
          </div>
        }
      >
        <div className={styles.confirm__body}>
          <p className={styles.confirm__text}>
            Deseja cadastrar automaticamente este imóvel na sua carteira?
          </p>
          <dl className={styles.confirm__dl}>
            <div className={styles.confirm__row}>
              <dt className={styles.confirm__key}>Vendedor</dt>
              <dd className={styles.confirm__val}>{pendingMoveItem?.title}</dd>
            </div>
            <div className={styles.confirm__row}>
              <dt className={styles.confirm__key}>Endereço</dt>
              <dd className={styles.confirm__val}>{pendingMoveItem?.subtitle}</dd>
            </div>
            <div className={styles.confirm__row}>
              <dt className={styles.confirm__key}>Tipo</dt>
              <dd className={styles.confirm__val}>
                {pendingMoveItem?.meta?.find((m) => m.label === 'Tipo')?.value ?? '—'}
              </dd>
            </div>
            <div className={styles.confirm__row}>
              <dt className={styles.confirm__key}>Valor Pretendido</dt>
              <dd className={styles.confirm__val}>
                {pendingMoveItem?.meta?.find((m) => m.label === 'Valor pretendido')?.value ?? '—'}
              </dd>
            </div>
          </dl>
        </div>
      </Modal>
    </>
  )
}
