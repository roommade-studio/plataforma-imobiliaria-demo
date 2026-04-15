'use client'

import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import styles from './page.module.css'

/* ── mock data ──────────────────────────────────────────── */

interface MetricSummary {
  name:      string
  meu:       number
  meta:      number
  unit:      string
  display:   string
  metaDisplay: string
}

const metrics: MetricSummary[] = [
  { name: 'Captações',    meu: 5,       meta: 8,       unit: 'un',   display: '5',        metaDisplay: '8'        },
  { name: 'VGV',          meu: 2400000, meta: 3200000, unit: 'R$',   display: 'R$2,4M',   metaDisplay: 'R$3,2M'   },
  { name: 'VGC',          meu: 4,       meta: 6,       unit: 'un',   display: '4',        metaDisplay: '6'        },
  { name: 'Carteira',     meu: 18,      meta: 20,      unit: 'un',   display: '18',       metaDisplay: '20'       },
  { name: 'Ticket Médio', meu: 790000,  meta: 800000,  unit: 'R$',   display: 'R$790k',   metaDisplay: 'R$800k'   },
]

/* Grouped bar chart — index by metric name, 2 series */
const metricBarData = metrics.map((m) => ({
  metrica:    m.name,
  meuResultado: m.unit === 'R$' ? m.meu / 1000 : m.meu,
  meta:         m.unit === 'R$' ? m.meta / 1000 : m.meta,
}))

/* VGC monthly evolution — 12 months */
const vgcEvolucao = [
  { mes: 'Abr/25', meu: 3, meta: 6 },
  { mes: 'Mai/25', meu: 5, meta: 6 },
  { mes: 'Jun/25', meu: 4, meta: 6 },
  { mes: 'Jul/25', meu: 6, meta: 6 },
  { mes: 'Ago/25', meu: 5, meta: 6 },
  { mes: 'Set/25', meu: 3, meta: 6 },
  { mes: 'Out/25', meu: 4, meta: 6 },
  { mes: 'Nov/25', meu: 5, meta: 6 },
  { mes: 'Dez/25', meu: 6, meta: 6 },
  { mes: 'Jan/26', meu: 5, meta: 6 },
  { mes: 'Fev/26', meu: 3, meta: 6 },
  { mes: 'Mar/26', meu: 4, meta: 6 },
]

/* ── helpers ────────────────────────────────────────────── */

function getPct(meu: number, meta: number) {
  return Math.round((meu / meta) * 100)
}

function getBadgeClass(pct: number) {
  if (pct >= 90) return styles['badge--acima']
  if (pct >= 70) return styles['badge--proximo']
  return styles['badge--abaixo']
}

function getBadgeLabel(pct: number) {
  if (pct >= 90) return 'Acima'
  if (pct >= 70) return 'Próximo'
  return 'Abaixo'
}

/* ── icons ──────────────────────────────────────────────── */

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconMoney() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconSign() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

/* ── component ──────────────────────────────────────────── */

export default function MetasVsRealizadoPage() {
  const tooltipStyle = {
    background:   'var(--card-background)',
    border:       '1px solid var(--card-border)',
    borderRadius: 'var(--radius-md)',
    fontSize:     12,
  }

  return (
    <div className={styles.page}>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Metas vs Realizado</h1>
      </div>

      {/* KPIs */}
      <div className={styles.page__kpis}>
        <StatCard label="Captações"    value="5"      suffix="/mês"  trend={-37.5} trendLabel="vs. meta 8"    icon={<IconHome />} />
        <StatCard label="VGV"          value="R$2,4M" trend={-25}   trendLabel="vs. meta R$3,2M"              icon={<IconMoney />} />
        <StatCard label="VGC (Gestões)" value="4"     suffix="/mês"  trend={-33.3} trendLabel="vs. meta 6"   icon={<IconSign />} variant="accent" />
        <StatCard label="Carteira"     value="18"     suffix=" imóveis" trend={-10} trendLabel="vs. meta 20" icon={<IconHome />} />
        <StatCard label="Ticket Médio" value="R$790k" trend={-1.25} trendLabel="vs. meta R$800k"              icon={<IconMoney />} />
      </div>

      {/* Summary cards row */}
      <div className={styles.summary__row}>
        {metrics.map((m) => {
          const pct = getPct(m.meu, m.meta)
          return (
            <div key={m.name} className={styles.summary__card}>
              <span className={styles.summary__name}>{m.name}</span>
              <div className={styles.summary__values}>
                <span className={styles.summary__meu}>{m.display}</span>
                <span className={styles.summary__meta}>meta: {m.metaDisplay}</span>
              </div>
              <span className={`${styles.summary__badge} ${getBadgeClass(pct)}`}>
                {getBadgeLabel(pct)} — {pct}%
              </span>
            </div>
          )
        })}
      </div>

      {/* Grouped BarChart — all metrics */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Meu Resultado vs Meta da Empresa</span>
          <span className={styles.card__subtitle}>Valores normalizados (R$ em milhares, unidades em unidades)</span>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={metricBarData} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="metrica"
                tick={{ fontSize: 11, fill: 'var(--paragraph)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--paragraph)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) =>
                  name === 'meuResultado'
                    ? [value, 'Meu Resultado']
                    : [value, 'Meta da Empresa']
                }
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
                formatter={(v) => v === 'meuResultado' ? 'Meu Resultado' : 'Meta da Empresa'}
              />
              <Bar dataKey="meuResultado" name="meuResultado" fill="var(--btn-primary-background)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="meta"         name="meta"         fill="var(--card-border)"            radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* VGC Monthly evolution line chart */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Evolução Mensal — VGC (Gestões Assinadas)</span>
          <span className={styles.card__subtitle}>Últimos 12 meses: Meu resultado vs Meta da empresa</span>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={vgcEvolucao} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 10, fill: 'var(--paragraph)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--paragraph)' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 8]}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="meu"
                name="Meu Resultado"
                stroke="var(--btn-primary-background)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--btn-primary-background)' }}
              />
              <Line
                type="monotone"
                dataKey="meta"
                name="Meta da Empresa"
                stroke="var(--warning-500)"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Análise do Gestor */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Análise do Gestor</span>
          <span className={styles.card__subtitle}>Atualizado em 06/04/2026</span>
        </CardHeader>
        <CardBody>
          <div className={styles.analise}>
            <p className={styles.analise__text}>
              Você está abaixo da meta em Captações e VGC. Foco em prospecção ativa nas próximas 2 semanas.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
