'use client'

import { useState } from 'react'
import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from '@/components/ui/Tabs'
import Modal from '@/components/ui/Modal'
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

const funnelStages = [
  { stage: 'Ligações', realizado: 148, meta: 160 },
  { stage: 'Visitas',  realizado: 32,  meta: 40  },
  { stage: 'ACM',      realizado: 18,  meta: 20  },
  { stage: 'Gestões',  realizado: 4,   meta: 6   },
  { stage: 'Vendas',   realizado: 3,   meta: 4   },
]

const funnelFull = [
  { stage: 'Ligações/Contatos', realizado: 148, meta: 160 },
  { stage: 'Visitas/Captações', realizado: 32,  meta: 40  },
  { stage: 'ACM Apresentados',  realizado: 18,  meta: 20  },
  { stage: 'Gestões (VGC)',     realizado: 4,   meta: 6   },
  { stage: 'Vendas',            realizado: 3,   meta: 4   },
]

/* 30 days of daily ligações */
const dailyLigacoes = Array.from({ length: 30 }, (_, i) => ({
  dia: `${i + 1}`,
  ligacoes: Math.floor(4 + Math.random() * 6),
}))
/* deterministic mock instead of random */
const dailyFixed = [
  { dia: '1',  ligacoes: 5 }, { dia: '2',  ligacoes: 7 }, { dia: '3',  ligacoes: 4 },
  { dia: '4',  ligacoes: 6 }, { dia: '5',  ligacoes: 9 }, { dia: '6',  ligacoes: 3 },
  { dia: '7',  ligacoes: 5 }, { dia: '8',  ligacoes: 8 }, { dia: '9',  ligacoes: 6 },
  { dia: '10', ligacoes: 4 }, { dia: '11', ligacoes: 7 }, { dia: '12', ligacoes: 5 },
  { dia: '13', ligacoes: 9 }, { dia: '14', ligacoes: 6 }, { dia: '15', ligacoes: 4 },
  { dia: '16', ligacoes: 5 }, { dia: '17', ligacoes: 8 }, { dia: '18', ligacoes: 4 },
  { dia: '19', ligacoes: 6 }, { dia: '20', ligacoes: 7 }, { dia: '21', ligacoes: 5 },
  { dia: '22', ligacoes: 9 }, { dia: '23', ligacoes: 4 }, { dia: '24', ligacoes: 6 },
  { dia: '25', ligacoes: 5 }, { dia: '26', ligacoes: 8 }, { dia: '27', ligacoes: 7 },
  { dia: '28', ligacoes: 4 }, { dia: '29', ligacoes: 6 }, { dia: '30', ligacoes: 5 },
]

const monthComparison = [
  { stage: 'Ligações', mesAtual: 148, mesAnterior: 137 },
  { stage: 'Visitas',  mesAtual: 32,  mesAnterior: 28  },
  { stage: 'ACM',      mesAtual: 18,  mesAnterior: 15  },
  { stage: 'Gestões',  mesAtual: 4,   mesAnterior: 5   },
  { stage: 'Vendas',   mesAtual: 3,   mesAnterior: 4   },
]

/* ── helpers ────────────────────────────────────────────── */

function getStatusClass(pct: number) {
  if (pct >= 80) return styles['status--green']
  if (pct >= 60) return styles['status--yellow']
  return styles['status--red']
}

function getStatusLabel(pct: number) {
  if (pct >= 80) return 'No prazo'
  if (pct >= 60) return 'Atenção'
  return 'Abaixo'
}

/* ── icons ──────────────────────────────────────────────── */

function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
    </svg>
  )
}

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconPercent() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  )
}

/* ── component ──────────────────────────────────────────── */

export default function MinhaPerformancePage() {
  const [tab, setTab]         = useState('atividades')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm]       = useState({
    ligacoes: '',
    visitas:  '',
    acm:      '',
    gestoes:  '',
    vendas:   '',
  })

  function handleFormChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    setModalOpen(false)
  }

  const tooltipStyle = {
    background:   'var(--card-background)',
    border:       '1px solid var(--card-border)',
    borderRadius: 'var(--radius-md)',
    fontSize:     12,
  }

  return (
    <div className={styles.page}>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Minha Performance</h1>
      </div>

      {/* KPIs */}
      <div className={styles.page__kpis}>
        <StatCard
          label="Ligações no Mês"
          value={148}
          trend={8}
          trendLabel="vs. mês anterior"
          icon={<IconPhone />}
        />
        <StatCard
          label="Visitas Realizadas"
          value={24}
          trend={15}
          trendLabel="vs. mês anterior"
          icon={<IconHome />}
          variant="accent"
        />
        <StatCard
          label="Taxa de Conversão Geral"
          value="34"
          suffix="%"
          trend={-2}
          trendLabel="vs. mês anterior"
          icon={<IconPercent />}
        />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
        </TabsList>

        {/* ── Atividades ── */}
        <TabsPanel value="atividades">
          <div className={styles.panel}>

            {/* Panel header with button */}
            <div className={styles.panel__actions}>
              <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
                Preencher Mês
              </Button>
            </div>

            {/* Funil Prontos — grouped bar chart */}
            <Card>
              <CardHeader>
                <span className={styles.card__title}>Funil Prontos — Mês Atual</span>
                <span className={styles.card__subtitle}>Realizado vs. Meta</span>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={funnelFull}
                    layout="vertical"
                    margin={{ top: 4, right: 24, left: 120, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: 'var(--paragraph)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="stage"
                      tick={{ fontSize: 11, fill: 'var(--paragraph)' }}
                      axisLine={false}
                      tickLine={false}
                      width={116}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="realizado" name="Realizado" fill="var(--btn-primary-background)" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="meta"      name="Meta"      fill="var(--card-border)"            radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Evolução Diária */}
            <Card>
              <CardHeader>
                <span className={styles.card__title}>Evolução Diária de Ligações</span>
                <span className={styles.card__subtitle}>Últimos 30 dias</span>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dailyFixed} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="dia"
                      tick={{ fontSize: 10, fill: 'var(--paragraph)' }}
                      axisLine={false}
                      tickLine={false}
                      interval={4}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'var(--paragraph)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line
                      type="monotone"
                      dataKey="ligacoes"
                      name="Ligações"
                      stroke="var(--btn-primary-background)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Comparação Mensal */}
            <Card>
              <CardHeader>
                <span className={styles.card__title}>Comparação Mensal</span>
                <span className={styles.card__subtitle}>Este mês vs. mês anterior</span>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthComparison} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="stage"
                      tick={{ fontSize: 11, fill: 'var(--paragraph)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'var(--paragraph)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="mesAtual"    name="Este Mês"  fill="var(--btn-primary-background)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="mesAnterior" name="Mês Anterior" fill="var(--card-border)"         radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Resumo Mensal */}
            <Card>
              <CardHeader>
                <span className={styles.card__title}>Resumo Mensal</span>
              </CardHeader>
              <CardBody>
                <div className={styles.summary__grid}>
                  {funnelStages.map((s) => {
                    const pct = Math.round((s.realizado / s.meta) * 100)
                    return (
                      <div key={s.stage} className={styles.summary__cell}>
                        <span className={styles.summary__stage}>{s.stage}</span>
                        <span className={styles.summary__values}>
                          {s.realizado} <span className={styles.summary__sep}>/</span> {s.meta}
                        </span>
                        <span className={styles.summary__pct}>{pct}%</span>
                        <span className={`${styles.summary__status} ${getStatusClass(pct)}`}>
                          {getStatusLabel(pct)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardBody>
            </Card>
          </div>
        </TabsPanel>
      </Tabs>

      {/* Modal Preencher Mês */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Preencher Mês"
        maxWidth="28rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Salvar
            </Button>
          </div>
        }
      >
        <div className={styles.modal__form}>
          {[
            { field: 'ligacoes', label: 'Ligações / Contatos' },
            { field: 'visitas',  label: 'Visitas / Captações' },
            { field: 'acm',      label: 'ACM Apresentados'   },
            { field: 'gestoes',  label: 'Gestões Assinadas (VGC)' },
            { field: 'vendas',   label: 'Vendas'              },
          ].map(({ field, label }) => (
            <div key={field} className={styles.form__field}>
              <label className={styles.form__label} htmlFor={`field-${field}`}>
                {label}
              </label>
              <input
                id={`field-${field}`}
                type="number"
                min="0"
                className={styles.form__input}
                placeholder="0"
                value={form[field as keyof typeof form]}
                onChange={(e) => handleFormChange(field, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
