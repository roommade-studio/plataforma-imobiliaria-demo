'use client'

import { useState } from 'react'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import ProgressRing from '@/components/ui/ProgressRing'
import Button from '@/components/ui/Button'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import styles from './page.module.css'

/* ── Mock data ──────────────────────────────────────────────── */

const equipe = [
  { nome: 'Ana Lima',    captacoes: 6, vgc: 5, vgv: 2.8, vendas: 2, ticket: 1.4, ligacoes: 180, visitas: 28 },
  { nome: 'Bruno Reis',  captacoes: 4, vgc: 3, vgv: 1.6, vendas: 1, ticket: 1.6, ligacoes: 120, visitas: 18 },
  { nome: 'Carla Matos', captacoes: 8, vgc: 6, vgv: 3.2, vendas: 3, ticket: 1.0, ligacoes: 200, visitas: 35 },
  { nome: 'Diego Souza', captacoes: 3, vgc: 2, vgv: 0.9, vendas: 1, ticket: 0.9, ligacoes: 90,  visitas: 14 },
  { nome: 'Eva Santos',  captacoes: 5, vgc: 4, vgv: 2.1, vendas: 2, ticket: 1.0, ligacoes: 155, visitas: 22 },
]

const meta = { captacoes: 6, vgc: 5, vgv: 2.8, vendas: 2, ticket: 1.0 }

/* Monthly performance mock — 6 months per broker */
const historicoPorCorretor: Record<string, { mes: string; realizado: number; meta: number }[]> = {
  'Ana Lima': [
    { mes: 'Nov', realizado: 3, meta: 5 },
    { mes: 'Dez', realizado: 4, meta: 5 },
    { mes: 'Jan', realizado: 5, meta: 5 },
    { mes: 'Fev', realizado: 4, meta: 5 },
    { mes: 'Mar', realizado: 5, meta: 5 },
    { mes: 'Abr', realizado: 5, meta: 5 },
  ],
  'Bruno Reis': [
    { mes: 'Nov', realizado: 2, meta: 5 },
    { mes: 'Dez', realizado: 3, meta: 5 },
    { mes: 'Jan', realizado: 3, meta: 5 },
    { mes: 'Fev', realizado: 2, meta: 5 },
    { mes: 'Mar', realizado: 3, meta: 5 },
    { mes: 'Abr', realizado: 3, meta: 5 },
  ],
  'Carla Matos': [
    { mes: 'Nov', realizado: 4, meta: 5 },
    { mes: 'Dez', realizado: 5, meta: 5 },
    { mes: 'Jan', realizado: 6, meta: 5 },
    { mes: 'Fev', realizado: 5, meta: 5 },
    { mes: 'Mar', realizado: 6, meta: 5 },
    { mes: 'Abr', realizado: 6, meta: 5 },
  ],
  'Diego Souza': [
    { mes: 'Nov', realizado: 2, meta: 5 },
    { mes: 'Dez', realizado: 1, meta: 5 },
    { mes: 'Jan', realizado: 2, meta: 5 },
    { mes: 'Fev', realizado: 3, meta: 5 },
    { mes: 'Mar', realizado: 2, meta: 5 },
    { mes: 'Abr', realizado: 2, meta: 5 },
  ],
  'Eva Santos': [
    { mes: 'Nov', realizado: 3, meta: 5 },
    { mes: 'Dez', realizado: 4, meta: 5 },
    { mes: 'Jan', realizado: 4, meta: 5 },
    { mes: 'Fev', realizado: 3, meta: 5 },
    { mes: 'Mar', realizado: 4, meta: 5 },
    { mes: 'Abr', realizado: 4, meta: 5 },
  ],
}

/* Aggregated team chart data */
const teamChartData = equipe.map((b) => ({
  nome:      b.nome.split(' ')[0],
  realizado: b.vgc,
  meta:      meta.vgc,
}))

/* Commissions mock */
const comissoes = [
  { nome: 'Ana Lima',    prevista: 84, paga: 56, receber: 28 },
  { nome: 'Bruno Reis',  prevista: 48, paga: 30, receber: 18 },
  { nome: 'Carla Matos', prevista: 96, paga: 72, receber: 24 },
  { nome: 'Diego Souza', prevista: 27, paga: 18, receber:  9 },
  { nome: 'Eva Santos',  prevista: 65, paga: 34, receber: 31 },
]

const totalComissoes = {
  prevista: comissoes.reduce((s, c) => s + c.prevista, 0),
  paga:     comissoes.reduce((s, c) => s + c.paga,     0),
  receber:  comissoes.reduce((s, c) => s + c.receber,  0),
}

const alertasEquipe = [
  'Diego Souza — VGC abaixo da meta (2/5)',
  'Bruno Reis — sem captação nova em 15 dias',
  '3 imóveis da equipe vencem este mês',
  'Equipe em 84% do VGV mensal',
]

/* ── Helpers ────────────────────────────────────────────────── */

function getInitials(nome: string) {
  return nome.split(' ').slice(0, 2).map((n) => n[0]).join('')
}

function getStatusColor(pct: number): 'green' | 'yellow' | 'red' {
  if (pct >= 80) return 'green'
  if (pct >= 60) return 'yellow'
  return 'red'
}

function pct(value: number, goal: number) {
  return Math.min(Math.round((value / goal) * 100), 100)
}

/* ── Icons ──────────────────────────────────────────────────── */

function IconAlert() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

/* ── Broker mini-funnel card ─────────────────────────────────── */

function BrokerCard({ broker }: { broker: typeof equipe[0] }) {
  const [expanded, setExpanded] = useState(false)

  const overallPct = Math.round(
    (pct(broker.captacoes, meta.captacoes) +
      pct(broker.vgc, meta.vgc) +
      pct(broker.vendas, meta.vendas)) /
      3,
  )
  const status = getStatusColor(overallPct)
  const historico = historicoPorCorretor[broker.nome] ?? []

  const funnelMetrics = [
    { label: 'Ligações',  value: broker.ligacoes, goal: 150, suffix: ''    },
    { label: 'Visitas',   value: broker.visitas,  goal: 25,  suffix: ''    },
    { label: 'VGC',       value: broker.vgc,      goal: meta.vgc, suffix: '' },
    { label: 'Vendas',    value: broker.vendas,   goal: meta.vendas, suffix: '' },
  ]

  return (
    <Card className={styles['broker-card']}>
      <CardBody>
        <div className={styles['broker-card__header']}>
          <div className={styles['broker-card__avatar']}>{getInitials(broker.nome)}</div>
          <div className={styles['broker-card__info']}>
            <span className={styles['broker-card__name']}>{broker.nome}</span>
            <span className={styles[`broker-card__status--${status}`]}>
              {status === 'green' && 'Acima da meta'}
              {status === 'yellow' && 'Próximo da meta'}
              {status === 'red' && 'Abaixo da meta'}
            </span>
          </div>
          <div className={styles['broker-card__score']}>
            <span className={styles[`broker-card__score-dot--${status}`]} />
            <span className={styles['broker-card__score-pct']}>{overallPct}%</span>
          </div>
        </div>

        <div className={styles['broker-card__metrics']}>
          {funnelMetrics.map((m) => {
            const p = pct(m.value, m.goal)
            return (
              <div key={m.label} className={styles['broker-card__metric-row']}>
                <ProgressRing
                  value={p}
                  size={32}
                  stroke={3}
                  color={p >= 80 ? 'var(--heading-accent)' : p >= 60 ? '#f59e0b' : '#ef4444'}
                />
                <span className={styles['broker-card__metric-label']}>{m.label}</span>
                <span className={styles['broker-card__metric-value']}>{m.value}{m.suffix}</span>
                <span className={styles['broker-card__metric-goal']}>/ {m.goal}</span>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          className={styles['broker-card__toggle']}
          onClick={() => setExpanded((v) => !v)}
        >
          Ver Detalhes
          <IconChevron open={expanded} />
        </button>

        {expanded && (
          <div className={styles['broker-card__chart']}>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={historico} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 11 }}
                />
                <Bar dataKey="realizado" name="Realizado" fill="var(--btn-primary-background)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="meta"      name="Meta"      fill="var(--card-border)"            radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

/* ── Page ───────────────────────────────────────────────────── */

export default function GestorDashboardPage() {
  const totalCaptacoes = equipe.reduce((s, b) => s + b.captacoes, 0)
  const totalVgc       = equipe.reduce((s, b) => s + b.vgc,       0)
  const totalVgv       = equipe.reduce((s, b) => s + b.vgv,       0)
  const totalVendas    = equipe.reduce((s, b) => s + b.vendas,     0)
  const totalLigacoes  = equipe.reduce((s, b) => s + b.ligacoes,   0)

  return (
    <div className={styles.page}>

      {/* Page title */}
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Visão da Equipe</h1>
        <span className={styles.page__subtitle}>Abril 2026 · {equipe.length} corretores</span>
      </div>

      {/* Aggregated stat cards */}
      <div className={styles.page__stats}>
        <StatCard
          label="Total Captações"
          value={totalCaptacoes}
          trendLabel={`meta: 30`}
          trend={Math.round(((totalCaptacoes - 30) / 30) * 100)}
        />
        <StatCard
          label="Total VGC (Gestões)"
          value={totalVgc}
          trendLabel="meta: 25"
          trend={Math.round(((totalVgc - 25) / 25) * 100)}
        />
        <StatCard
          label="VGV Total"
          value={`R$ ${totalVgv.toFixed(1)}M`}
        />
        <StatCard
          label="Total Vendas"
          value={totalVendas}
        />
        <StatCard
          label="Ligações no Mês"
          value={totalLigacoes}
        />
      </div>

      {/* Broker mini-funnel grid */}
      <div className={styles.page__section}>
        <h2 className={styles.section__title}>Funil Individual por Corretor</h2>
        <div className={styles.brokers__grid}>
          {equipe.map((b) => (
            <BrokerCard key={b.nome} broker={b} />
          ))}
        </div>
      </div>

      {/* Team VGC vs Meta bar chart */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>VGC da Equipe vs Meta</span>
          <span className={styles.card__subtitle}>Gestões assinadas · Abril 2026</span>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={teamChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="nome" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="realizado" name="Realizado" fill="var(--btn-primary-background)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="meta"      name="Meta"      fill="var(--card-border)"            radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Commissions pipeline table */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Pipeline de Comissões da Equipe</span>
        </CardHeader>
        <CardBody>
          <div className={styles.table__wrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.table__th}>Corretor</th>
                  <th className={styles['table__th--num']}>Comissão Prevista</th>
                  <th className={styles['table__th--num']}>Comissão Paga</th>
                  <th className={styles['table__th--num']}>A Receber</th>
                </tr>
              </thead>
              <tbody>
                {comissoes.map((c) => (
                  <tr key={c.nome} className={styles.table__row}>
                    <td className={styles.table__td}>{c.nome}</td>
                    <td className={styles['table__td--num']}>R$ {c.prevista}k</td>
                    <td className={styles['table__td--num']}>R$ {c.paga}k</td>
                    <td className={styles['table__td--num']}><strong>R$ {c.receber}k</strong></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={styles.table__total}>
                  <td className={styles.table__td}><strong>Total</strong></td>
                  <td className={styles['table__td--num']}><strong>R$ {totalComissoes.prevista}k</strong></td>
                  <td className={styles['table__td--num']}><strong>R$ {totalComissoes.paga}k</strong></td>
                  <td className={styles['table__td--num']}><strong>R$ {totalComissoes.receber}k</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Team alerts */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Alertas da Equipe</span>
        </CardHeader>
        <CardBody>
          <ul className={styles.alertas__list}>
            {alertasEquipe.map((alerta) => (
              <li key={alerta} className={styles.alertas__item}>
                <span className={styles.alertas__icon}><IconAlert /></span>
                <span className={styles.alertas__text}>{alerta}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

    </div>
  )
}
