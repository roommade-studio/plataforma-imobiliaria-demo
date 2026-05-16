'use client'

import { useState } from 'react'
import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from '@/components/ui/Tabs'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input, { Select } from '@/components/ui/Input'
import styles from './page.module.css'

/* ── Icons ──────────────────────────────────────────────── */

function IconDollar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

/* ── Types ──────────────────────────────────────────────── */

interface MonthGoal {
  mes: string
  mesIndex: number
  captacao: number
  carteira: number
  vgv: number
  vendas: number
  vgc: number
}

interface CommissionRow {
  id: number
  previsao: string
  cliente: string
  imovel: string
  parcela: string
  bruto: number
  liquido: number
  status: 'recebido' | 'previsto' | 'atrasado'
}

/* ── Mock data: Planejamento Estratégico ────────────────── */

const CURRENT_MONTH = 4 // Abril = mês 4

const MONTHS_GOALS: MonthGoal[] = [
  { mes: 'Janeiro',   mesIndex: 1,  captacao: 4,  carteira: 18, vgv: 2800000, vendas: 2, vgc: 196000 },
  { mes: 'Fevereiro', mesIndex: 2,  captacao: 5,  carteira: 20, vgv: 3100000, vendas: 3, vgc: 217000 },
  { mes: 'Março',     mesIndex: 3,  captacao: 6,  carteira: 22, vgv: 3400000, vendas: 3, vgc: 238000 },
  { mes: 'Abril',     mesIndex: 4,  captacao: 5,  carteira: 24, vgv: 3200000, vendas: 2, vgc: 224000 },
  { mes: 'Maio',      mesIndex: 5,  captacao: 6,  carteira: 26, vgv: 3600000, vendas: 3, vgc: 252000 },
  { mes: 'Junho',     mesIndex: 6,  captacao: 7,  carteira: 28, vgv: 4000000, vendas: 4, vgc: 280000 },
  { mes: 'Julho',     mesIndex: 7,  captacao: 6,  carteira: 29, vgv: 3800000, vendas: 3, vgc: 266000 },
  { mes: 'Agosto',    mesIndex: 8,  captacao: 8,  carteira: 32, vgv: 4400000, vendas: 4, vgc: 308000 },
  { mes: 'Setembro',  mesIndex: 9,  captacao: 7,  carteira: 33, vgv: 4200000, vendas: 4, vgc: 294000 },
  { mes: 'Outubro',   mesIndex: 10, captacao: 8,  carteira: 36, vgv: 4800000, vendas: 5, vgc: 336000 },
  { mes: 'Novembro',  mesIndex: 11, captacao: 7,  carteira: 37, vgv: 4600000, vendas: 4, vgc: 322000 },
  { mes: 'Dezembro',  mesIndex: 12, captacao: 6,  carteira: 38, vgv: 4200000, vendas: 3, vgc: 294000 },
]

/* ── Mock data: Comissões ───────────────────────────────── */

const COMMISSIONS: CommissionRow[] = [
  { id: 1, previsao: '05/01/2026', cliente: 'Rafael Andrade',    imovel: 'Apto 204 — Pinheiros',         parcela: '1/3', bruto: 18000,  liquido: 12600, status: 'recebido' },
  { id: 2, previsao: '10/02/2026', cliente: 'Camila Ferreira',   imovel: 'Casa 7 — Morumbi',             parcela: '2/3', bruto: 24000,  liquido: 16800, status: 'recebido' },
  { id: 3, previsao: '15/03/2026', cliente: 'Bruno Menezes',     imovel: 'Cobertura — Jardins',          parcela: '1/2', bruto: 42000,  liquido: 29400, status: 'recebido' },
  { id: 4, previsao: '22/03/2026', cliente: 'Patrícia Souza',    imovel: 'Apto 31 — Itaim Bibi',         parcela: '3/3', bruto: 9200,   liquido: 6440,  status: 'recebido' },
  { id: 5, previsao: '08/04/2026', cliente: 'Thiago Nunes',      imovel: 'Studio 12B — Vila Madalena',   parcela: '1/2', bruto: 15000,  liquido: 10500, status: 'previsto' },
  { id: 6, previsao: '20/04/2026', cliente: 'Fernanda Lima',     imovel: 'Casa em condomínio — Alphaville', parcela: '2/3', bruto: 28000, liquido: 19600, status: 'previsto' },
  { id: 7, previsao: '05/05/2026', cliente: 'Marcelo Rocha',     imovel: 'Apto 4D — Moema',              parcela: '1/3', bruto: 38000,  liquido: 26600, status: 'previsto' },
  { id: 8, previsao: '01/03/2026', cliente: 'Juliana Costa',     imovel: 'Casa Térrea — Vila Prudente',  parcela: '2/2', bruto: 16000,  liquido: 11200, status: 'atrasado' },
]

/* ── Helpers ────────────────────────────────────────────── */

function fmtBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function getMonthStatus(mesIndex: number): 'concluido' | 'em-andamento' | 'planejado' {
  if (mesIndex < CURRENT_MONTH) return 'concluido'
  if (mesIndex === CURRENT_MONTH) return 'em-andamento'
  return 'planejado'
}

function MonthStatusBadge({ mesIndex }: { mesIndex: number }) {
  const status = getMonthStatus(mesIndex)
  const labels: Record<string, string> = {
    'concluido': 'Concluído',
    'em-andamento': 'Em Andamento',
    'planejado': 'Planejado',
  }
  return (
    <span className={styles.badge} data-goal-status={status}>
      {labels[status]}
    </span>
  )
}

function CommissionBadge({ status }: { status: CommissionRow['status'] }) {
  const labels: Record<string, string> = {
    recebido: 'Recebido',
    previsto: 'Previsto',
    atrasado: 'Atrasado',
  }
  return (
    <span className={styles.badge} data-commission-status={status}>
      {labels[status]}
    </span>
  )
}

/* ── Component ──────────────────────────────────────────── */

export default function MetricsPage() {
  const [tab, setTab] = useState('planejamento')

  /* Planejamento — edit modal */
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMonth, setEditingMonth] = useState<MonthGoal | null>(null)
  const [editForm, setEditForm] = useState({ captacao: '', carteira: '', vgv: '', vendas: '', vgc: '' })

  function openEditModal(month: MonthGoal) {
    setEditingMonth(month)
    setEditForm({
      captacao: String(month.captacao),
      carteira: String(month.carteira),
      vgv:      String(month.vgv),
      vendas:   String(month.vendas),
      vgc:      String(month.vgc),
    })
    setIsEditModalOpen(true)
  }

  /* Comissões — add modal */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [commissionForm, setCommissionForm] = useState({
    cliente: '',
    imovel: '',
    parcelaNum: '',
    parcelaDen: '',
    bruto: '',
    liquido: '',
    previsao: '',
    status: 'previsto' as CommissionRow['status'],
  })

  /* Filter state */
  const [filterMonth, setFilterMonth] = useState('4')
  const [filterYear,  setFilterYear]  = useState('2026')

  /* Totals */
  const totalCaptacao = MONTHS_GOALS.reduce((s, r) => s + r.captacao, 0)
  const totalCarteira = MONTHS_GOALS.reduce((s, r) => s + r.carteira, 0)
  const totalVGV      = MONTHS_GOALS.reduce((s, r) => s + r.vgv, 0)
  const totalVendas   = MONTHS_GOALS.reduce((s, r) => s + r.vendas, 0)
  const totalVGC      = MONTHS_GOALS.reduce((s, r) => s + r.vgc, 0)

  const recebidoLiquido = COMMISSIONS.filter((c) => c.status === 'recebido').reduce((s, c) => s + c.liquido, 0)
  const aReceberLiquido = COMMISSIONS.filter((c) => c.status !== 'recebido').reduce((s, c) => s + c.liquido, 0)

  return (
    <div className={styles.page}>

      {/* Page header */}
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Planejamento</h1>
        <p className={styles.page__subtitle}>Gerencie metas estratégicas e acompanhe suas comissões</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="planejamento">Planejamento Estratégico</TabsTrigger>
          <TabsTrigger value="comissoes">Minhas Comissões</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Planejamento Estratégico ── */}
        <TabsPanel value="planejamento">
          <div className={styles.panel}>
            <div className={styles.panel__toolbar}>
              <div className={styles.panel__lock}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className={styles.panel__lock__text}>Metas desbloqueadas — clique em um mês para editar</span>
              </div>
              <Button size="sm" variant="secondary" onClick={() => openEditModal(MONTHS_GOALS[CURRENT_MONTH - 1])}>
                Editar Metas
              </Button>
            </div>

            <Card>
              <CardHeader>
                <span className={styles.card__title}>Metas Anuais por Mês</span>
                <span className={styles.card__subtitle}>2026</span>
              </CardHeader>
              <CardBody>
                <div className={styles.table__wrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.table__th}>Mês</th>
                        <th className={styles.table__th}>Captação</th>
                        <th className={styles.table__th}>Carteira</th>
                        <th className={styles.table__th}>VGV</th>
                        <th className={styles.table__th}>Vendas</th>
                        <th className={styles.table__th}>VGC</th>
                        <th className={styles.table__th}>Status</th>
                        <th className={styles.table__th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Totals header row */}
                      <tr className={styles.table__row__total}>
                        <td className={styles.table__td__total}>Total anual</td>
                        <td className={styles['table__td--num__total']}>{totalCaptacao}</td>
                        <td className={styles['table__td--num__total']}>{totalCarteira}</td>
                        <td className={styles['table__td--num__total']}>{fmtBRL(totalVGV)}</td>
                        <td className={styles['table__td--num__total']}>{totalVendas}</td>
                        <td className={styles['table__td--num__total']}>{fmtBRL(totalVGC)}</td>
                        <td className={styles.table__td__total}></td>
                        <td className={styles.table__td__total}></td>
                      </tr>
                      {MONTHS_GOALS.map((row) => (
                        <tr key={row.mes} className={styles.table__row}>
                          <td className={styles.table__td}>{row.mes}</td>
                          <td className={styles['table__td--num']}>{row.captacao}</td>
                          <td className={styles['table__td--num']}>{row.carteira}</td>
                          <td className={styles['table__td--num']}>{fmtBRL(row.vgv)}</td>
                          <td className={styles['table__td--num']}>{row.vendas}</td>
                          <td className={styles['table__td--num']}>{fmtBRL(row.vgc)}</td>
                          <td className={styles.table__td}><MonthStatusBadge mesIndex={row.mesIndex} /></td>
                          <td className={styles.table__td}>
                            <button
                              type="button"
                              className={styles.table__edit__btn}
                              onClick={() => openEditModal(row)}
                              aria-label={`Editar metas de ${row.mes}`}
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
        </TabsPanel>

        {/* ── Tab 2: Minhas Comissões ── */}
        <TabsPanel value="comissoes">
          <div className={styles.panel}>
            {/* Top bar: filter + add button */}
            <div className={styles.panel__toolbar}>
              <div className={styles.panel__filters}>
                <Select
                  label=""
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  <option value="1">Janeiro</option>
                  <option value="2">Fevereiro</option>
                  <option value="3">Março</option>
                  <option value="4">Abril</option>
                  <option value="5">Maio</option>
                  <option value="6">Junho</option>
                  <option value="7">Julho</option>
                  <option value="8">Agosto</option>
                  <option value="9">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </Select>
                <Select
                  label=""
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </Select>
              </div>
              <Button size="sm" variant="primary" onClick={() => setIsAddModalOpen(true)}>
                + Adicionar Comissão
              </Button>
            </div>

            {/* Summary stat cards */}
            <div className={styles.panel__summary}>
              <StatCard
                label="Recebido Líquido"
                value={`R$ ${(recebidoLiquido / 1000).toFixed(1).replace('.', ',')}k`}
                trend={18}
                trendLabel="vs. mês anterior"
                variant="accent"
                icon={<IconDollar />}
              />
              <StatCard
                label="A Receber Líquido"
                value={`R$ ${(aReceberLiquido / 1000).toFixed(1).replace('.', ',')}k`}
                trendLabel="previsão do período"
                icon={<IconClock />}
              />
            </div>

            {/* Commissions table */}
            <Card>
              <CardHeader>
                <span className={styles.card__title}>Parcelas de Comissão</span>
                <span className={styles.card__subtitle}>
                  {['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][Number(filterMonth)]} {filterYear}
                </span>
              </CardHeader>
              <CardBody>
                <div className={styles.table__wrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.table__th}>Previsão</th>
                        <th className={styles.table__th}>Cliente</th>
                        <th className={styles.table__th}>Imóvel</th>
                        <th className={styles.table__th}>Parcela</th>
                        <th className={styles.table__th}>Bruto</th>
                        <th className={styles.table__th}>Líq. Corretor</th>
                        <th className={styles.table__th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMMISSIONS.map((row) => (
                        <tr key={row.id} className={styles.table__row}>
                          <td className={styles.table__td}>{row.previsao}</td>
                          <td className={styles.table__td}>{row.cliente}</td>
                          <td className={styles.table__td}>{row.imovel}</td>
                          <td className={styles['table__td--num']}>{row.parcela}</td>
                          <td className={styles['table__td--num']}>{fmtBRL(row.bruto)}</td>
                          <td className={styles['table__td--num']}>{fmtBRL(row.liquido)}</td>
                          <td className={styles.table__td}><CommissionBadge status={row.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
        </TabsPanel>
      </Tabs>

      {/* ── Modal: Editar Metas do Mês ── */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingMonth ? `Editar Metas — ${editingMonth.mes}` : 'Editar Metas'}
        footer={
          <div className={styles.modal__actions}>
            <Button variant="tertiary" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsEditModalOpen(false)}>
              Salvar Metas
            </Button>
          </div>
        }
      >
        <form className={styles.form}>
          <Input
            label="Captação (meta)"
            type="number"
            placeholder="Ex: 6"
            value={editForm.captacao}
            onChange={(e) => setEditForm((p) => ({ ...p, captacao: e.target.value }))}
          />
          <Input
            label="Carteira (meta)"
            type="number"
            placeholder="Ex: 24"
            value={editForm.carteira}
            onChange={(e) => setEditForm((p) => ({ ...p, carteira: e.target.value }))}
          />
          <Input
            label="VGV (meta R$)"
            type="number"
            placeholder="Ex: 3200000"
            value={editForm.vgv}
            onChange={(e) => setEditForm((p) => ({ ...p, vgv: e.target.value }))}
          />
          <Input
            label="Vendas (meta)"
            type="number"
            placeholder="Ex: 2"
            value={editForm.vendas}
            onChange={(e) => setEditForm((p) => ({ ...p, vendas: e.target.value }))}
          />
          <Input
            label="VGC (meta R$)"
            type="number"
            placeholder="Ex: 224000"
            value={editForm.vgc}
            onChange={(e) => setEditForm((p) => ({ ...p, vgc: e.target.value }))}
          />
        </form>
      </Modal>

      {/* ── Modal: Adicionar Comissão ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar Comissão"
        footer={
          <div className={styles.modal__actions}>
            <Button variant="tertiary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Salvar Comissão
            </Button>
          </div>
        }
      >
        <form className={styles.form}>
          <Input
            label="Cliente"
            placeholder="Ex: João da Silva"
            value={commissionForm.cliente}
            onChange={(e) => setCommissionForm((p) => ({ ...p, cliente: e.target.value }))}
          />
          <Input
            label="Imóvel"
            placeholder="Ex: Apto 204 — Pinheiros"
            value={commissionForm.imovel}
            onChange={(e) => setCommissionForm((p) => ({ ...p, imovel: e.target.value }))}
          />
          <div className={styles.form__row}>
            <Input
              label="Parcela nº"
              type="number"
              placeholder="1"
              value={commissionForm.parcelaNum}
              onChange={(e) => setCommissionForm((p) => ({ ...p, parcelaNum: e.target.value }))}
            />
            <Input
              label="De quantas"
              type="number"
              placeholder="3"
              value={commissionForm.parcelaDen}
              onChange={(e) => setCommissionForm((p) => ({ ...p, parcelaDen: e.target.value }))}
            />
          </div>
          <Input
            label="Valor Bruto (R$)"
            type="number"
            placeholder="Ex: 18000"
            value={commissionForm.bruto}
            onChange={(e) => setCommissionForm((p) => ({ ...p, bruto: e.target.value }))}
          />
          <Input
            label="Líquido Corretor (R$)"
            type="number"
            placeholder="Ex: 12600"
            value={commissionForm.liquido}
            onChange={(e) => setCommissionForm((p) => ({ ...p, liquido: e.target.value }))}
          />
          <Input
            label="Data de Previsão"
            type="date"
            value={commissionForm.previsao}
            onChange={(e) => setCommissionForm((p) => ({ ...p, previsao: e.target.value }))}
          />
          <Select
            label="Status"
            value={commissionForm.status}
            onChange={(e) => setCommissionForm((p) => ({ ...p, status: e.target.value as CommissionRow['status'] }))}
          >
            <option value="previsto">Previsto</option>
            <option value="recebido">Recebido</option>
            <option value="atrasado">Atrasado</option>
          </Select>
        </form>
      </Modal>
    </div>
  )
}
