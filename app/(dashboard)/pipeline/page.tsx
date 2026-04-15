'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import Modal from '@/components/ui/Modal'
import Input, { Select } from '@/components/ui/Input'
import KanbanBoard, { type KanbanItem, type KanbanColumnDef } from '@/components/kanban/KanbanBoard'
import styles from './page.module.css'

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

/* ── Mock portfolio matches (for modal) ─────────────────── */

const MOCK_MATCHES = [
  { endereco: 'Rua dos Pinheiros, 450 — Pinheiros',       tipo: 'Apartamento 2D', preco: 'R$ 620.000', match: 95 },
  { endereco: 'Al. Joaquim Eugênio de Lima, 33 — Jardins', tipo: 'Apartamento 2D', preco: 'R$ 680.000', match: 82 },
  { endereco: 'Rua Frei Caneca, 600 — Consolação',        tipo: 'Apartamento 2D', preco: 'R$ 595.000', match: 76 },
]

/* ── Component ──────────────────────────────────────────── */

export default function PipelinePage() {
  const [items, setItems] = useState<KanbanItem[]>(INITIAL_ITEMS)

  /* Add lead modal */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [form, setForm] = useState({
    nome: '', telefone: '', orcamento: '', tipoImovel: '', dormitorios: '', vagas: '', temperatura: 'Morno ☀️', interesse: '',
  })

  /* Card detail modal */
  const [selectedItem, setSelectedItem] = useState<KanbanItem | null>(null)

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
    setForm({ nome: '', telefone: '', orcamento: '', tipoImovel: '', dormitorios: '', vagas: '', temperatura: 'Morno ☀️', interesse: '' })
    setIsAddModalOpen(false)
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
          <StatCard label="Leads Ativos"        value={ativos}      trend={12.5}  trendLabel="vs. mês anterior" />
          <StatCard label="Em Negociação"        value={negociacao}  trend={8.3}   trendLabel="vs. mês anterior" />
          <StatCard label="Convertidos no Mês"   value={convertidos} trend={-4.2}  trendLabel="vs. mês anterior" />
          <StatCard label="Taxa de Conversão"    value={`${taxa}%`}  trend={2.1}   trendLabel="vs. mês anterior" variant="accent" />
        </div>

        {/* Kanban */}
        <div className={styles.page__board}>
          <KanbanBoard
            columns={COLUMNS}
            items={items}
            onMove={handleMove}
            onItemClick={(item) => setSelectedItem(item)}
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
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Buscar Imóveis — ${selectedItem.title}`}
          maxWidth="36rem"
          footer={
            <div className={styles.modal__actions}>
              <Button variant="tertiary"  size="sm" onClick={() => setSelectedItem(null)}>Perder Lead</Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedItem(null)}>Agendar Visita</Button>
              <Button variant="primary"   size="sm" onClick={() => setSelectedItem(null)}>Registrar Contato</Button>
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
              <p className={styles.detail__label}>Imóveis compatíveis na carteira</p>
              <div className={styles.match__list}>
                {MOCK_MATCHES.map((p, i) => (
                  <div key={i} className={styles.match__card}>
                    <div className={styles.match__info}>
                      <span className={styles.match__address}>{p.endereco}</span>
                      <span className={styles.match__type}>{p.tipo} · {p.preco}</span>
                    </div>
                    <span className={styles.match__pct} data-match={p.match >= 90 ? 'high' : p.match >= 75 ? 'mid' : 'low'}>
                      {p.match}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

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
