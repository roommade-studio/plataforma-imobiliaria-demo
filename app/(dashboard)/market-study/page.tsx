'use client'

import { useState } from 'react'
import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
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
} from 'recharts'
import styles from './page.module.css'

/* ── mock data ──────────────────────────────────────────── */

const precoPorBairroData = [
  { bairro: 'Itaim Bibi',      preco: 18.4 },
  { bairro: 'Jardins',         preco: 16.2 },
  { bairro: 'Moema',           preco: 14.8 },
  { bairro: 'Pinheiros',       preco: 13.5 },
  { bairro: 'Vila Madalena',   preco: 12.1 },
  { bairro: 'Brooklin',        preco: 11.4 },
  { bairro: 'Lapa',            preco: 9.2 },
  { bairro: 'Butantã',         preco: 7.8 },
]

const evolucaoPrecoData = [
  { mes: 'Jan', preco: 7.8 },
  { mes: 'Fev', preco: 7.9 },
  { mes: 'Mar', preco: 8.0 },
  { mes: 'Abr', preco: 8.1 },
  { mes: 'Mai', preco: 8.0 },
  { mes: 'Jun', preco: 8.2 },
  { mes: 'Jul', preco: 8.3 },
  { mes: 'Ago', preco: 8.4 },
  { mes: 'Set', preco: 8.5 },
  { mes: 'Out', preco: 8.4 },
  { mes: 'Nov', preco: 8.6 },
  { mes: 'Dez', preco: 8.7 },
]

const bairrosTable = [
  { bairro: 'Itaim Bibi',    preco: 'R$ 18.4k', qtd: 24, variacao: '+2.1%', tendencia: '↑' },
  { bairro: 'Jardins',       preco: 'R$ 16.2k', qtd: 18, variacao: '+1.5%', tendencia: '↑' },
  { bairro: 'Moema',         preco: 'R$ 14.8k', qtd: 31, variacao: '+0.8%', tendencia: '→' },
  { bairro: 'Pinheiros',     preco: 'R$ 13.5k', qtd: 28, variacao: '+1.2%', tendencia: '↑' },
  { bairro: 'Vila Madalena', preco: 'R$ 12.1k', qtd: 15, variacao: '-0.3%', tendencia: '↓' },
  { bairro: 'Brooklin',      preco: 'R$ 11.4k', qtd: 19, variacao: '+0.5%', tendencia: '→' },
  { bairro: 'Lapa',          preco: 'R$ 9.2k',  qtd: 11, variacao: '+1.8%', tendencia: '↑' },
  { bairro: 'Butantã',       preco: 'R$ 7.8k',  qtd: 10, variacao: '-0.6%', tendencia: '↓' },
]

/* ── icons ──────────────────────────────────────────────── */

function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M12 14h.01" />
    </svg>
  )
}
function IconPrice() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
function IconTrend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  )
}
function IconMap() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}

/* ── component ──────────────────────────────────────────── */

export default function MarketStudyPage() {
  const [localidade, setLocalidade] = useState('')
  const [tipo, setTipo] = useState('')
  const [precoMin, setPrecoMin] = useState('')
  const [precoMax, setPrecoMax] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // mock — form would trigger study generation
    alert('Estudo iniciado! Você receberá os resultados em breve.')
  }

  return (
    <div className={styles.page}>
      <div className={styles.page__header}>
        <div className={styles.page__title__group}>
          <h1 className={styles.page__title}>Estudo de Mercado</h1>
          <span className={styles.badge__beta}>Beta</span>
        </div>
      </div>

      {/* KPIs */}
      <div className={styles.page__kpis}>
        <StatCard label="Imóveis Analisados"  value={156}      trendLabel="base de dados atual" icon={<IconBuilding />} />
        <StatCard label="Preço Médio m²"      value="R$ 8.4k"  trend={1.2} trendLabel="vs. mês anterior" icon={<IconPrice />} variant="accent" />
        <StatCard label="Variação Mensal"      value="+1.2"     suffix="%" trend={1.2} trendLabel="este mês" icon={<IconTrend />} />
        <StatCard label="Bairros Mapeados"     value={12}       trendLabel="cobertura atual" icon={<IconMap />} />
      </div>

      {/* Charts */}
      <div className={styles.page__cols}>
        <Card>
          <CardHeader>
            <span className={styles.card__title}>Preço por m² por Bairro</span>
            <span className={styles.card__subtitle}>em R$ mil</span>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={precoPorBairroData} margin={{ top: 4, right: 8, left: -8, bottom: 32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="bairro" tick={{ fontSize: 10, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                  formatter={(v: unknown) => [`R$ ${v as number}k/m²`, 'Preço']} />
                <Bar dataKey="preco" name="R$/m²" fill="#3b6ef5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span className={styles.card__title}>Evolução de Preços</span>
            <span className={styles.card__subtitle}>Preço médio m² · R$ mil</span>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={evolucaoPrecoData} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[7, 9]} tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                  formatter={(v: unknown) => [`R$ ${v as number}k/m²`, 'Preço']} />
                <Line type="monotone" dataKey="preco" stroke="#3b6ef5" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Dados por Bairro</span>
        </CardHeader>
        <CardBody>
          <div className={styles.table__wrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.table__th}>Bairro</th>
                  <th className={styles.table__th}>Preço Médio m²</th>
                  <th className={styles.table__th}>Qtd. Imóveis</th>
                  <th className={styles.table__th}>Variação Mensal</th>
                  <th className={styles.table__th}>Tendência</th>
                </tr>
              </thead>
              <tbody>
                {bairrosTable.map((row, i) => (
                  <tr key={i} className={styles.table__tr}>
                    <td className={styles.table__td}>{row.bairro}</td>
                    <td className={styles.table__td}>{row.preco}</td>
                    <td className={styles.table__td}>{row.qtd}</td>
                    <td className={styles.table__td}>
                      <span className={
                        row.variacao.startsWith('+') ? styles['badge--up'] :
                        row.variacao.startsWith('-') ? styles['badge--down'] :
                        styles['badge--neutral']
                      }>
                        {row.variacao}
                      </span>
                    </td>
                    <td className={styles.table__td}>
                      <span className={
                        row.tendencia === '↑' ? styles['trend--up'] :
                        row.tendencia === '↓' ? styles['trend--down'] :
                        styles['trend--neutral']
                      }>
                        {row.tendencia}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* New Study Form */}
      <Card>
        <CardHeader>
          <span className={styles.card__title}>Novo Estudo de Mercado</span>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.form__row}>
              <Input
                label="Localidade"
                placeholder="Ex: Pinheiros, São Paulo"
                value={localidade}
                onChange={(e) => setLocalidade(e.target.value)}
              />
              <Input
                label="Tipo de Imóvel"
                placeholder="Ex: Apartamento, Casa, Comercial"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              />
            </div>
            <div className={styles.form__row}>
              <Input
                label="Preço Mínimo (R$)"
                placeholder="Ex: 500000"
                type="number"
                value={precoMin}
                onChange={(e) => setPrecoMin(e.target.value)}
              />
              <Input
                label="Preço Máximo (R$)"
                placeholder="Ex: 2000000"
                type="number"
                value={precoMax}
                onChange={(e) => setPrecoMax(e.target.value)}
              />
            </div>
            <div className={styles.form__actions}>
              <Button type="submit" variant="primary" size="md">Iniciar Estudo</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
