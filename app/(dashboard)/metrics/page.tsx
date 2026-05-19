'use client'

import { useState } from 'react'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import styles from './page.module.css'

interface MonthGoal {
  mes: string
  mesIndex: number
  captacao: number
  carteira: number
  vgv: number
  vendas: number
  vgc: number
}

const CURRENT_MONTH = 4

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

export default function MetricsPage() {
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

  const totalCaptacao = MONTHS_GOALS.reduce((s, r) => s + r.captacao, 0)
  const totalCarteira = MONTHS_GOALS.reduce((s, r) => s + r.carteira, 0)
  const totalVGV      = MONTHS_GOALS.reduce((s, r) => s + r.vgv, 0)
  const totalVendas   = MONTHS_GOALS.reduce((s, r) => s + r.vendas, 0)
  const totalVGC      = MONTHS_GOALS.reduce((s, r) => s + r.vgc, 0)

  return (
    <div className={styles.page}>

      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Planejamento</h1>
        <p className={styles.page__subtitle}>Gerencie metas estratégicas do ano</p>
      </div>

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
    </div>
  )
}
