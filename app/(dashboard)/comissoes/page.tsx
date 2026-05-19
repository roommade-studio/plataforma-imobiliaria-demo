'use client'

import { useState } from 'react'
import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input, { Select } from '@/components/ui/Input'
import styles from '../metrics/page.module.css'

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

const COMMISSIONS: CommissionRow[] = [
  { id: 1, previsao: '05/01/2026', cliente: 'Rafael Andrade',  imovel: 'Apto 204 — Pinheiros',            parcela: '1/3', bruto: 18000, liquido: 12600, status: 'recebido' },
  { id: 2, previsao: '10/02/2026', cliente: 'Camila Ferreira', imovel: 'Casa 7 — Morumbi',                parcela: '2/3', bruto: 24000, liquido: 16800, status: 'recebido' },
  { id: 3, previsao: '15/03/2026', cliente: 'Bruno Menezes',   imovel: 'Cobertura — Jardins',             parcela: '1/2', bruto: 42000, liquido: 29400, status: 'recebido' },
  { id: 4, previsao: '22/03/2026', cliente: 'Patrícia Souza',  imovel: 'Apto 31 — Itaim Bibi',            parcela: '3/3', bruto: 9200,  liquido: 6440,  status: 'recebido' },
  { id: 5, previsao: '08/04/2026', cliente: 'Thiago Nunes',    imovel: 'Studio 12B — Vila Madalena',      parcela: '1/2', bruto: 15000, liquido: 10500, status: 'previsto' },
  { id: 6, previsao: '20/04/2026', cliente: 'Fernanda Lima',   imovel: 'Casa em condomínio — Alphaville', parcela: '2/3', bruto: 28000, liquido: 19600, status: 'previsto' },
  { id: 7, previsao: '05/05/2026', cliente: 'Marcelo Rocha',   imovel: 'Apto 4D — Moema',                 parcela: '1/3', bruto: 38000, liquido: 26600, status: 'previsto' },
  { id: 8, previsao: '01/03/2026', cliente: 'Juliana Costa',   imovel: 'Casa Térrea — Vila Prudente',     parcela: '2/2', bruto: 16000, liquido: 11200, status: 'atrasado' },
]

function fmtBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
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

export default function ComissoesPage() {
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

  const [filterMonth, setFilterMonth] = useState('4')
  const [filterYear,  setFilterYear]  = useState('2026')

  const recebidoLiquido = COMMISSIONS.filter((c) => c.status === 'recebido').reduce((s, c) => s + c.liquido, 0)
  const aReceberLiquido = COMMISSIONS.filter((c) => c.status !== 'recebido').reduce((s, c) => s + c.liquido, 0)

  return (
    <div className={styles.page}>

      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Minhas Comissões</h1>
        <p className={styles.page__subtitle}>Acompanhe parcelas recebidas, previstas e atrasadas</p>
      </div>

      <div className={styles.panel}>
        <div className={styles.panel__toolbar}>
          <div className={styles.panel__filters}>
            <Select label="" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
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
            <Select label="" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </Select>
          </div>
          <Button size="sm" variant="primary" onClick={() => setIsAddModalOpen(true)}>
            + Adicionar Comissão
          </Button>
        </div>

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
