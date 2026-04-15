'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import Modal from '@/components/ui/Modal'
import Input, { Select } from '@/components/ui/Input'
import KanbanBoard, { type KanbanItem, type KanbanColumnDef } from '@/components/kanban/KanbanBoard'
import styles from './page.module.css'

const COLUMNS: KanbanColumnDef[] = [
  { id: 'disponivel',     title: 'Disponível',     color: '#22c55e' },
  { id: 'reservado',      title: 'Reservado',       color: '#f59e0b' },
  { id: 'em-negociacao',  title: 'Em Negociação',   color: '#3b82f6' },
  { id: 'vendido',        title: 'Vendido',         color: '#64748b' },
  { id: 'suspenso',       title: 'Suspenso',        color: '#ef4444' },
]

const INITIAL_ITEMS: KanbanItem[] = [
  {
    id: 'prop-1',
    columnId: 'disponivel',
    title: 'Al. Campinas, 579 — Jardins',
    subtitle: 'Apartamento',
    badge: 'Destaque',
    badgeColor: 'blue',
    meta: [
      { label: 'Valor',        value: 'R$ 1.250.000' },
      { label: 'Área',         value: '98 m²' },
      { label: 'Dormitórios',  value: '3' },
    ],
    tags: ['Exclusivo', 'Destaque'],
  },
  {
    id: 'prop-2',
    columnId: 'disponivel',
    title: 'R. Funchal, 418 — Vila Olímpia',
    subtitle: 'Apartamento',
    badge: 'Novo',
    badgeColor: 'green',
    meta: [
      { label: 'Valor',        value: 'R$ 720.000' },
      { label: 'Área',         value: '65 m²' },
      { label: 'Dormitórios',  value: '2' },
    ],
    tags: ['Financiável'],
  },
  {
    id: 'prop-3',
    columnId: 'disponivel',
    title: 'R. Maranhão, 200 — Higienópolis',
    subtitle: 'Casa',
    badge: 'Disponível',
    badgeColor: 'green',
    meta: [
      { label: 'Valor',        value: 'R$ 3.800.000' },
      { label: 'Área',         value: '320 m²' },
      { label: 'Dormitórios',  value: '5' },
    ],
    tags: ['Exclusivo'],
  },
  {
    id: 'prop-4',
    columnId: 'disponivel',
    title: 'Av. Rebouças, 1111 — Pinheiros',
    subtitle: 'Sala comercial',
    badge: 'Disponível',
    badgeColor: 'green',
    meta: [
      { label: 'Valor',        value: 'R$ 480.000' },
      { label: 'Área',         value: '52 m²' },
      { label: 'Dormitórios',  value: '—' },
    ],
    tags: ['Financiável'],
  },
  {
    id: 'prop-5',
    columnId: 'reservado',
    title: 'R. Oscar Freire, 900 — Cerqueira César',
    subtitle: 'Apartamento',
    badge: 'Reservado',
    badgeColor: 'yellow',
    meta: [
      { label: 'Valor',        value: 'R$ 2.100.000' },
      { label: 'Área',         value: '145 m²' },
      { label: 'Dormitórios',  value: '4' },
    ],
    tags: ['Exclusivo', 'Destaque'],
  },
  {
    id: 'prop-6',
    columnId: 'reservado',
    title: 'Av. Morumbi, 3500 — Morumbi',
    subtitle: 'Casa',
    badge: 'Reservado',
    badgeColor: 'yellow',
    meta: [
      { label: 'Valor',        value: 'R$ 5.200.000' },
      { label: 'Área',         value: '480 m²' },
      { label: 'Dormitórios',  value: '6' },
    ],
    tags: ['Exclusivo'],
  },
  {
    id: 'prop-7',
    columnId: 'em-negociacao',
    title: 'R. Bela Cintra, 1020 — Consolação',
    subtitle: 'Apartamento',
    badge: 'Negociando',
    badgeColor: 'blue',
    meta: [
      { label: 'Valor',        value: 'R$ 890.000' },
      { label: 'Área',         value: '78 m²' },
      { label: 'Dormitórios',  value: '2' },
    ],
    tags: ['Financiável'],
  },
  {
    id: 'prop-8',
    columnId: 'em-negociacao',
    title: 'R. Groenlândia, 245 — Itaim Bibi',
    subtitle: 'Apartamento',
    badge: 'Negociando',
    badgeColor: 'blue',
    meta: [
      { label: 'Valor',        value: 'R$ 1.680.000' },
      { label: 'Área',         value: '120 m²' },
      { label: 'Dormitórios',  value: '3' },
    ],
    tags: ['Destaque'],
  },
  {
    id: 'prop-9',
    columnId: 'vendido',
    title: 'R. Teodoro Sampaio, 500 — Pinheiros',
    subtitle: 'Apartamento',
    badge: 'Vendido',
    badgeColor: 'gray',
    meta: [
      { label: 'Valor final',  value: 'R$ 560.000' },
      { label: 'Área',         value: '58 m²' },
      { label: 'Data',         value: '20 Mar 2026' },
    ],
    tags: [],
  },
  {
    id: 'prop-10',
    columnId: 'vendido',
    title: 'Al. Lorena, 1255 — Jardins',
    subtitle: 'Cobertura',
    badge: 'Vendido',
    badgeColor: 'gray',
    meta: [
      { label: 'Valor final',  value: 'R$ 4.100.000' },
      { label: 'Área',         value: '280 m²' },
      { label: 'Data',         value: '01 Abr 2026' },
    ],
    tags: ['Exclusivo'],
  },
  {
    id: 'prop-11',
    columnId: 'suspenso',
    title: 'Av. Santo Amaro, 4000 — Santo Amaro',
    subtitle: 'Terreno',
    badge: 'Suspenso',
    badgeColor: 'red',
    meta: [
      { label: 'Valor',        value: 'R$ 2.600.000' },
      { label: 'Área',         value: '850 m²' },
      { label: 'Dormitórios',  value: '—' },
    ],
    tags: [],
  },
]

export default function PropertiesKanbanPage() {
  const [items, setItems] = useState<KanbanItem[]>(INITIAL_ITEMS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    endereco: '',
    tipo: '',
    valor: '',
    area: '',
    dormitorios: '',
  })

  function handleMove(itemId: string, targetColumnId: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, columnId: targetColumnId } : i))
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newItem: KanbanItem = {
      id: `prop-${Date.now()}`,
      columnId: 'disponivel',
      title: form.endereco,
      subtitle: form.tipo,
      badge: 'Novo',
      badgeColor: 'green',
      meta: [
        { label: 'Valor',       value: form.valor || '—' },
        { label: 'Área',        value: form.area ? `${form.area} m²` : '—' },
        { label: 'Dormitórios', value: form.dormitorios || '—' },
      ],
    }
    setItems((prev) => [...prev, newItem])
    setForm({ endereco: '', tipo: '', valor: '', area: '', dormitorios: '' })
    setIsModalOpen(false)
  }

  const total         = items.length
  const disponiveis   = items.filter((i) => i.columnId === 'disponivel').length
  const reservados    = items.filter((i) => i.columnId === 'reservado').length
  const emNegociacao  = items.filter((i) => i.columnId === 'em-negociacao').length
  const vendidos      = items.filter((i) => i.columnId === 'vendido').length

  return (
    <>
      <Topbar
        title="Kanban de Imóveis"
        actions={
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            + Adicionar Imóvel
          </Button>
        }
      />

      <div className={styles.page}>
        {/* Stats */}
        <div className={styles.page__stats}>
          <StatCard
            label="Total Carteira"
            value={total}
            trend={5.0}
            trendLabel="vs. mês anterior"
          />
          <StatCard
            label="Disponíveis"
            value={disponiveis}
            trend={-8.0}
            trendLabel="vs. mês anterior"
          />
          <StatCard
            label="Reservados"
            value={reservados}
            trend={50.0}
            trendLabel="vs. mês anterior"
          />
          <StatCard
            label="Em Negociação"
            value={emNegociacao}
            trend={0.0}
            trendLabel="vs. mês anterior"
          />
          <StatCard
            label="Vendidos no Mês"
            value={vendidos}
            trend={100.0}
            trendLabel="vs. mês anterior"
            variant="accent"
          />
        </div>

        {/* Kanban */}
        <div className={styles.page__board}>
          <KanbanBoard
            columns={COLUMNS}
            items={items}
            onMove={handleMove}
          />
        </div>
      </div>

      {/* Modal: Adicionar Imóvel */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adicionar Imóvel à Carteira"
        footer={
          <div className={styles.modal__actions}>
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleSubmit}>
              Adicionar Imóvel
            </Button>
          </div>
        }
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Endereço"
            placeholder="Ex: R. Augusta, 200 — Consolação"
            value={form.endereco}
            onChange={(e) => setForm((p) => ({ ...p, endereco: e.target.value }))}
            required
          />
          <Select
            label="Tipo"
            value={form.tipo}
            onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
          >
            <option value="">Selecione...</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
            <option value="Cobertura">Cobertura</option>
            <option value="Terreno">Terreno</option>
            <option value="Sala comercial">Sala comercial</option>
            <option value="Galpão">Galpão</option>
          </Select>
          <Input
            label="Valor de venda"
            placeholder="Ex: R$ 800.000"
            value={form.valor}
            onChange={(e) => setForm((p) => ({ ...p, valor: e.target.value }))}
          />
          <div className={styles.form__row}>
            <Input
              label="Área (m²)"
              placeholder="Ex: 90"
              type="number"
              value={form.area}
              onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
            />
            <Input
              label="Dormitórios"
              placeholder="Ex: 3"
              type="number"
              value={form.dormitorios}
              onChange={(e) => setForm((p) => ({ ...p, dormitorios: e.target.value }))}
            />
          </div>
        </form>
      </Modal>
    </>
  )
}
