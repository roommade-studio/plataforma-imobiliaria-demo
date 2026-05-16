'use client'

import { useState } from 'react'
import { useSession } from '@/lib/auth/client'
import ProgressRing from '@/components/ui/ProgressRing'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from '@/components/ui/Tabs'
import StatCard from '@/components/ui/StatCard'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import styles from './page.module.css'

/* ── mock data ──────────────────────────────────────────── */

const vgcData = [
  { mes: 'Nov', gestoes: 2 },
  { mes: 'Dez', gestoes: 3 },
  { mes: 'Jan', gestoes: 2 },
  { mes: 'Fev', gestoes: 5 },
  { mes: 'Mar', gestoes: 3 },
  { mes: 'Abr', gestoes: 4 },
]

const funnelData = [
  { etapa: 'Leads', quantidade: 120 },
  { etapa: 'Qualif.', quantidade: 72 },
  { etapa: 'Visitas', quantidade: 45 },
  { etapa: 'Proposta', quantidade: 18 },
  { etapa: 'Fechado', quantidade: 9 },
]

const pipelineData = [
  { name: 'Pré-aprovado', value: 38 },
  { name: 'Em análise', value: 27 },
  { name: 'Aguardando', value: 20 },
  { name: 'Frio', value: 15 },
]

const PIE_COLORS = ['#3b6ef5', '#6090fa', '#93b4fd', '#c2d4fe']

const performanceData = [
  { corretor: 'Ana Lima',    vendas: 5, meta: 6 },
  { corretor: 'Bruno Reis',  vendas: 4, meta: 5 },
  { corretor: 'Carla Matos', vendas: 7, meta: 6 },
  { corretor: 'Diego Souza', vendas: 3, meta: 5 },
  { corretor: 'Eu',          vendas: 3, meta: 4 },
]

const metasGoals = [
  { label: 'Captações',             value: 63,  goal: '5 de 8 captações' },
  { label: 'VGV Bruto',             value: 75,  goal: 'R$ 2.4M de R$ 3.2M' },
  { label: 'VGC — Gestões Assin.', value: 67,  goal: '4 de 6 gestões' },
  { label: 'Taxa de Conversão',     value: 85,  goal: '34% — meta 40%' },
]

/* ── KPI data ───────────────────────────────────────────── */

interface KpiItem {
  label:    string
  value:    string
  meta?:    string
  trend?:   string
  progress: number
  icon:     React.ReactNode
}

const kpiItems: KpiItem[] = [
  { label: 'Captações',            value: '5',        meta: 'Meta: 8',        progress: Math.round((5 / 8) * 100),     icon: <KpiIconBuilding />  },
  { label: 'Carteira Ativa',       value: '18',       meta: 'Meta: 20',       progress: Math.round((18 / 20) * 100),   icon: <KpiIconBriefcase /> },
  { label: 'Valor de Carteira',    value: 'R$ 14.2M', meta: 'Meta: R$ 16M',   progress: Math.round((14.2 / 16) * 100), icon: <KpiIconDollar />    },
  { label: 'Ticket Médio',         value: 'R$ 790k',  trend: '+3.2%',         progress: 100,                            icon: <KpiIconTag />       },
  { label: 'VGV Bruto',            value: 'R$ 2.4M',  meta: 'Meta: R$ 3.2M', progress: Math.round((2.4 / 3.2) * 100), icon: <KpiIconTrendUp />   },
  { label: 'VGC — Gestões Assin.', value: '4',        meta: 'Meta: 6',        progress: Math.round((4 / 6) * 100),     icon: <KpiIconPercent />   },
  { label: 'Vendas',               value: '3',        meta: 'Meta: 4', trend: '+50%', progress: Math.round((3 / 4) * 100), icon: <KpiIconCheck /> },
]

/* ── alert data ─────────────────────────────────────────── */

const alertas = [
  '2 imóveis com vencimento em 15 dias',
  'VGC abaixo da meta em 33%',
  '3 leads sem contato há mais de 7 dias',
]

/* ── icons ──────────────────────────────────────────────── */

function IconSales() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}
function IconProperties() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function IconAlert() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

/* ── KPI semicircle gauge ───────────────────────────────── */

function gaugeColor(pct: number) {
  return pct >= 80 ? '#16A34A' : pct >= 50 ? '#2563EB' : '#DC2626'
}

function SemiCircleGauge({ percentage, color }: { percentage: number; color: string }) {
  const angle    = (percentage / 100) * 180
  const radians  = (angle - 180) * (Math.PI / 180)
  const x        = 50 + 40 * Math.cos(radians)
  const y        = 50 + 40 * Math.sin(radians)
  const largeArc = angle > 180 ? 1 : 0

  return (
    <svg viewBox="0 0 100 55" width="100" height="55">
      <path
        d="M 10 50 A 40 40 0 0 1 90 50"
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {percentage > 0 && (
        <path
          d={`M 10 50 A 40 40 0 ${largeArc} 1 ${x} ${y}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
      )}
      <text
        x="50"
        y="46"
        textAnchor="middle"
        fontSize="13"
        fontWeight="bold"
        fill={color}
      >
        {percentage}%
      </text>
    </svg>
  )
}

/* ── KPI card icons ─────────────────────────────────────── */

function KpiIconBuilding() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22V12h6v10" />
      <rect x="8" y="6" width="2" height="2" />
      <rect x="14" y="6" width="2" height="2" />
      <rect x="8" y="10" width="2" height="2" />
      <rect x="14" y="10" width="2" height="2" />
    </svg>
  )
}
function KpiIconBriefcase() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  )
}
function KpiIconDollar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
function KpiIconTag() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}
function KpiIconTrendUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
function KpiIconPercent() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  )
}
function KpiIconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ── component ──────────────────────────────────────────── */

export default function DashboardPage() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Usuário'

  const [tab, setTab] = useState('geral')

  /* Health score: 50% taxa de conversão + 50% realização VGC */
  const taxaConversao = 34  /* atual: 34%, meta: 40% */
  const realizacaoVgc = Math.round((4 / 6) * 100) /* 67% */
  const healthScore = Math.round((taxaConversao / 40) * 50 + (realizacaoVgc / 100) * 50)

  return (
    <div className={styles.page}>

      {/* Header / Greeting */}
      <div className={styles.page__header}>
        <div>
          <p className={styles.page__greeting}>Bem-vindo de volta,</p>
          <h1 className={styles.page__title}>{firstName}</h1>
        </div>
      </div>

      {/* Health Score */}
      <Card className={styles.page__health}>
        <CardBody>
          <div className={styles.health__inner}>
            <div className={styles.health__ring}>
              <ProgressRing value={healthScore} size={120} stroke={10} label={`${healthScore}%`} sublabel="Score" />
            </div>
            <div className={styles.health__content}>
              <p className={styles.health__eyebrow}>Visão Geral</p>
              <h2 className={styles.health__title}>Score de Saúde do Negócio</h2>
              <p className={styles.health__desc}>Baseado na taxa de conversão e realização de VGC do período atual.</p>
              <div className={styles.health__metrics}>
                <div className={styles.health__metric}>
                  <span className={styles['health__metric-label']}>Taxa de Conversão (50%)</span>
                  <span className={styles['health__metric-value']}>34% <span className={styles['health__metric-sub']}>meta 40%</span></span>
                </div>
                <div className={styles.health__metric}>
                  <span className={styles['health__metric-label']}>Realização VGC (50%)</span>
                  <span className={styles['health__metric-value']}>4 de 6 gestões</span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* KPI Grid */}
      <div className={styles.page__kpis}>
        {kpiItems.map((kpi) => (
          <div key={kpi.label} className={styles.kpi__card}>
            {/* Icon + label */}
            <div className={styles.kpi__header}>
              <span className={styles.kpi__icon}>{kpi.icon}</span>
              <p className={styles.kpi__label}>{kpi.label}</p>
            </div>
            {/* Semicircle gauge */}
            <div className={styles['kpi__gauge-area']}>
              <SemiCircleGauge percentage={kpi.progress} color={gaugeColor(kpi.progress)} />
            </div>
            {/* Meta + realizado */}
            <div className={styles.kpi__bottom}>
              <div className={styles['kpi__bottom-item']}>
                <span className={styles['kpi__bottom-label']}>Realizado</span>
                <span className={styles['kpi__bottom-value']}>{kpi.value}</span>
              </div>
              {kpi.meta && (
                <div className={styles['kpi__bottom-item']}>
                  <span className={styles['kpi__bottom-label']}>{kpi.meta}</span>
                </div>
              )}
              {kpi.trend && (
                <div className={styles['kpi__bottom-item']}>
                  <span className={styles['kpi__meta--trend']}>{kpi.trend}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Alertas */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Alertas</span>
        </CardHeader>
        <CardBody>
          <ul className={styles.alertas__list}>
            {alertas.map((alerta) => (
              <li key={alerta} className={styles.alertas__item}>
                <span className={styles.alertas__icon}><IconAlert /></span>
                <span className={styles.alertas__text}>{alerta}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {/* Evolução VGC mini chart */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Evolução VGC</span>
          <span className={styles.card__subtitle}>Gestões assinadas · últimos 6 meses</span>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={vgcData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="vgcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b6ef5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b6ef5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                formatter={(v) => [`${v}`, 'Gestões']}
              />
              <Area type="monotone" dataKey="gestoes" stroke="#3b6ef5" strokeWidth={2} fill="url(#vgcGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
        </TabsList>

        {/* ── Visão Geral ── */}
        <TabsPanel value="geral">
          <div className={styles.panel}>
            <div className={styles.panel__row}>
              <Card>
                <CardHeader>
                  <span className={styles.card__title}>Funil de Vendas</span>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 16, left: 16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="etapa" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} width={56} />
                      <Tooltip
                        contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                      />
                      <Bar dataKey="quantidade" fill="#3b6ef5" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <span className={styles.card__title}>Pipeline de Compradores</span>
                </CardHeader>
                <CardBody className={styles['pie-body']}>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pipelineData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pipelineData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                        formatter={(v) => [`${v}%`, '']}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </div>
          </div>
        </TabsPanel>

        {/* ── Performance ── */}
        <TabsPanel value="performance">
          <div className={styles.panel}>
            <Card>
              <CardHeader>
                <span className={styles.card__title}>Comparativo de Performance</span>
                <span className={styles.card__subtitle}>Vendas realizadas vs. meta — mês atual</span>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={performanceData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="corretor" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="vendas" name="Vendas" fill="#3b6ef5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="meta"   name="Meta"   fill="#c2d4fe" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <div className={styles.page__kpis}>
              <StatCard label="Posição no Ranking" value="3°"      trendLabel="entre 5 corretores" />
              <StatCard label="Captações no Mês"   value="5"       trendLabel="meta: 8"            icon={<IconProperties />} />
              <StatCard label="Taxa de Conversão"  value="34%"     trend={-6} trendLabel="meta 40%"  />
              <StatCard label="VGC Realizadas"     value="4"       trendLabel="de 6 gestões"       variant="accent" />
            </div>
          </div>
        </TabsPanel>

        {/* ── Metas ── */}
        <TabsPanel value="metas">
          <div className={styles.metas}>
            {metasGoals.map((meta) => (
              <Card key={meta.label}>
                <CardBody>
                  <div className={styles.meta__card}>
                    <ProgressRing value={meta.value} size={72} stroke={7} label={`${meta.value}%`} />
                    <div className={styles.meta__info}>
                      <p className={styles.meta__label}>{meta.label}</p>
                      <p className={styles.meta__progress}>{meta.goal}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </TabsPanel>
      </Tabs>
    </div>
  )
}
