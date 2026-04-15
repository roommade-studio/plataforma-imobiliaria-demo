'use client'

import { useState } from 'react'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input, { Select } from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import styles from './page.module.css'

/* ── Mock data ──────────────────────────────────────────────── */

const mesesLabels = ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr']

/* Historic goals (last 6 months) */
const historicoMetas = [
  { mes: 'Nov/2025', captacoes: 5, vgv: 'R$ 2.8M', vgc: 4, vendas: 2, ticket: 'R$ 700k', por: 'Gestor' },
  { mes: 'Dez/2025', captacoes: 5, vgv: 'R$ 2.8M', vgc: 4, vendas: 2, ticket: 'R$ 700k', por: 'Gestor' },
  { mes: 'Jan/2026', captacoes: 6, vgv: 'R$ 3.0M', vgc: 5, vendas: 2, ticket: 'R$ 750k', por: 'Gestor' },
  { mes: 'Fev/2026', captacoes: 6, vgv: 'R$ 3.0M', vgc: 5, vendas: 2, ticket: 'R$ 750k', por: 'Gestor' },
  { mes: 'Mar/2026', captacoes: 6, vgv: 'R$ 3.2M', vgc: 5, vendas: 2, ticket: 'R$ 800k', por: 'Gestor' },
  { mes: 'Abr/2026', captacoes: 6, vgv: 'R$ 3.2M', vgc: 5, vendas: 2, ticket: 'R$ 800k', por: 'Gestor' },
]

/* VGC chart: team totals vs company minimum */
const vgcChartData = [
  { mes: 'Nov', equipe: 16, meta: 20 },
  { mes: 'Dez', equipe: 18, meta: 20 },
  { mes: 'Jan', equipe: 17, meta: 25 },
  { mes: 'Fev', equipe: 19, meta: 25 },
  { mes: 'Mar', equipe: 22, meta: 25 },
  { mes: 'Abr', equipe: 20, meta: 25 },
]

/* Vendas chart */
const vendasChartData = [
  { mes: 'Nov', equipe: 6,  meta: 10 },
  { mes: 'Dez', equipe: 8,  meta: 10 },
  { mes: 'Jan', equipe: 7,  meta: 10 },
  { mes: 'Fev', equipe: 9,  meta: 10 },
  { mes: 'Mar', equipe: 10, meta: 10 },
  { mes: 'Abr', equipe: 9,  meta: 10 },
]

/* Brokers in sector */
const corretoresSetor = [
  { nome: 'Ana Lima',    cargo: 'Corretor', email: 'ana@imob.com',    status: 'Ativo' },
  { nome: 'Bruno Reis',  cargo: 'Corretor', email: 'bruno@imob.com',  status: 'Ativo' },
  { nome: 'Carla Matos', cargo: 'Corretor', email: 'carla@imob.com',  status: 'Ativo' },
  { nome: 'Diego Souza', cargo: 'Corretor', email: 'diego@imob.com',  status: 'Ativo' },
  { nome: 'Eva Santos',  cargo: 'Corretor', email: 'eva@imob.com',    status: 'Ativo' },
]

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const ANOS = ['2025', '2026', '2027']

/* ── Component ──────────────────────────────────────────────── */

export default function MetasPage() {
  /* Period selectors */
  const [mes,  setMes]  = useState('Abril')
  const [ano,  setAno]  = useState('2026')

  /* Goals form state */
  const [captacoes, setCaptacoes] = useState('6')
  const [vgv,       setVgv]       = useState('3.2')
  const [vgc,       setVgc]       = useState('5')
  const [vendas,    setVendas]    = useState('2')
  const [ticket,    setTicket]    = useState('800')

  /* Add broker modal */
  const [modalOpen,   setModalOpen]   = useState(false)
  const [novoNome,    setNovoNome]    = useState('')
  const [novoEmail,   setNovoEmail]   = useState('')
  const [novoCreci,   setNovoCreci]   = useState('')
  const [brokers,     setBrokers]     = useState(corretoresSetor)

  function handleSalvarMetas(e: React.FormEvent) {
    e.preventDefault()
    /* In production: persist to DB */
    alert(`Metas salvas para ${mes}/${ano}`)
  }

  function handleCancelar() {
    setCaptacoes('6')
    setVgv('3.2')
    setVgc('5')
    setVendas('2')
    setTicket('800')
  }

  function handleAdicionarCorretor(e: React.FormEvent) {
    e.preventDefault()
    if (!novoNome || !novoEmail) return
    setBrokers((prev) => [
      ...prev,
      { nome: novoNome, cargo: 'Corretor', email: novoEmail, status: 'Ativo' },
    ])
    setNovoNome('')
    setNovoEmail('')
    setNovoCreci('')
    setModalOpen(false)
  }

  function handleRemover(nome: string) {
    setBrokers((prev) => prev.filter((b) => b.nome !== nome))
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.page__header}>
        <div className={styles.page__heading}>
          <h1 className={styles.page__title}>Metas da Empresa</h1>
          <span className={styles.page__subtitle}>Defina as metas mínimas mensais do setor</span>
        </div>

        {/* Period selectors */}
        <div className={styles.page__period}>
          <Select
            label="Mês"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            {MESES.map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select
            label="Ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
          >
            {ANOS.map((a) => <option key={a} value={a}>{a}</option>)}
          </Select>
        </div>
      </div>

      {/* Goals form */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Metas Mensais Mínimas</span>
          <span className={styles.card__subtitle}>{mes} {ano}</span>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSalvarMetas} className={styles.form}>
            <div className={styles.form__grid}>
              <Input
                label="Captações mínimas"
                type="number"
                min={0}
                value={captacoes}
                onChange={(e) => setCaptacoes(e.target.value)}
                hint="Número de captações por corretor"
              />
              <Input
                label="VGV mínimo — R$ (M)"
                type="number"
                min={0}
                step={0.1}
                value={vgv}
                onChange={(e) => setVgv(e.target.value)}
                hint="Em milhões · ex: 3.2 para R$ 3,2M"
              />
              <Input
                label="VGC mínimas — Gestões Assinadas"
                type="number"
                min={0}
                value={vgc}
                onChange={(e) => setVgc(e.target.value)}
                hint="Número de gestões por corretor"
              />
              <Input
                label="Vendas mínimas"
                type="number"
                min={0}
                value={vendas}
                onChange={(e) => setVendas(e.target.value)}
                hint="Número de vendas por corretor"
              />
              <Input
                label="Ticket Médio mínimo — R$ (k)"
                type="number"
                min={0}
                step={50}
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                hint="Em milhares · ex: 800 para R$ 800k"
              />
            </div>
            <div className={styles.form__actions}>
              <Button type="submit" variant="primary" size="md">Salvar Metas</Button>
              <Button type="button" variant="tertiary" size="md" onClick={handleCancelar}>Cancelar</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Goals history table */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Histórico de Metas</span>
          <span className={styles.card__subtitle}>Últimos 6 meses</span>
        </CardHeader>
        <CardBody>
          <div className={styles.table__wrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.table__th}>Mês</th>
                  <th className={styles['table__th--num']}>Captações</th>
                  <th className={styles['table__th--num']}>VGV</th>
                  <th className={styles['table__th--num']}>VGC</th>
                  <th className={styles['table__th--num']}>Vendas</th>
                  <th className={styles['table__th--num']}>Ticket Médio</th>
                  <th className={styles.table__th}>Atualizado por</th>
                </tr>
              </thead>
              <tbody>
                {historicoMetas.map((row) => (
                  <tr key={row.mes} className={styles.table__row}>
                    <td className={styles.table__td}>{row.mes}</td>
                    <td className={styles['table__td--num']}>{row.captacoes}</td>
                    <td className={styles['table__td--num']}>{row.vgv}</td>
                    <td className={styles['table__td--num']}>{row.vgc}</td>
                    <td className={styles['table__td--num']}>{row.vendas}</td>
                    <td className={styles['table__td--num']}>{row.ticket}</td>
                    <td className={styles.table__td}>{row.por}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Performance charts */}
      <div className={styles.charts__row}>
        {/* VGC chart */}
        <Card>
          <CardHeader>
            <span className={styles.card__title}>VGC — Equipe vs Meta</span>
            <span className={styles.card__subtitle}>Últimos 6 meses</span>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={vgcChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="equipe" name="Equipe" stroke="var(--btn-primary-background)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="meta"   name="Meta"   stroke="var(--paragraph)" strokeWidth={2} strokeDasharray="5 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Vendas chart */}
        <Card>
          <CardHeader>
            <span className={styles.card__title}>Vendas — Equipe vs Meta</span>
            <span className={styles.card__subtitle}>Últimos 6 meses</span>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={vendasChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="equipe" name="Equipe" stroke="var(--heading-accent)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="meta"   name="Meta"   stroke="var(--paragraph)" strokeWidth={2} strokeDasharray="5 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Sector management table */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Gestão do Setor</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setModalOpen(true)}
          >
            Adicionar Corretor ao Setor
          </Button>
        </CardHeader>
        <CardBody>
          <div className={styles.table__wrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.table__th}>Corretor</th>
                  <th className={styles.table__th}>Cargo</th>
                  <th className={styles.table__th}>Email</th>
                  <th className={styles.table__th}>Status</th>
                  <th className={styles.table__th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((b) => (
                  <tr key={b.email} className={styles.table__row}>
                    <td className={styles.table__td}>
                      <div className={styles.broker__cell}>
                        <span className={styles.broker__avatar}>
                          {b.nome.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                        </span>
                        {b.nome}
                      </div>
                    </td>
                    <td className={styles.table__td}>{b.cargo}</td>
                    <td className={styles.table__td}>{b.email}</td>
                    <td className={styles.table__td}>
                      <span className={styles['status--ativo']}>✓ {b.status}</span>
                    </td>
                    <td className={styles.table__td}>
                      <button
                        type="button"
                        className={styles.btn__remove}
                        onClick={() => handleRemover(b.nome)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Add broker modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Adicionar Corretor ao Setor"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="tertiary" size="md" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary"  size="md" onClick={handleAdicionarCorretor as unknown as React.MouseEventHandler}>Adicionar</Button>
          </div>
        }
      >
        <form onSubmit={handleAdicionarCorretor} className={styles.modal__form}>
          <Input
            label="Nome completo"
            type="text"
            required
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Ex: João Silva"
          />
          <Input
            label="E-mail"
            type="email"
            required
            value={novoEmail}
            onChange={(e) => setNovoEmail(e.target.value)}
            placeholder="Ex: joao@imob.com"
          />
          <Input
            label="CRECI"
            type="text"
            value={novoCreci}
            onChange={(e) => setNovoCreci(e.target.value)}
            placeholder="Ex: 123456-F"
          />
        </form>
      </Modal>

    </div>
  )
}
