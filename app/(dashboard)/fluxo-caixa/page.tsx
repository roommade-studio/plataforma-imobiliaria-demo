'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import StatCard from '@/components/ui/StatCard'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from '@/components/ui/Tabs'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
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

const mensalData = [
  { mes: 'Jan', entradas: 95,  saidas: 68  },
  { mes: 'Fev', entradas: 108, saidas: 72  },
  { mes: 'Mar', entradas: 112, saidas: 80  },
  { mes: 'Abr', entradas: 98,  saidas: 74  },
  { mes: 'Mai', entradas: 125, saidas: 88  },
  { mes: 'Jun', entradas: 130, saidas: 92  },
  { mes: 'Jul', entradas: 118, saidas: 85  },
  { mes: 'Ago', entradas: 142, saidas: 98  },
  { mes: 'Set', entradas: 135, saidas: 94  },
  { mes: 'Out', entradas: 150, saidas: 102 },
  { mes: 'Nov', entradas: 138, saidas: 96  },
  { mes: 'Dez', entradas: 160, saidas: 110 },
]

const saldoAcumulado = mensalData.reduce<{ mes: string; saldo: number }[]>((acc, item, i) => {
  const prev = acc[i - 1]?.saldo ?? 0
  acc.push({ mes: item.mes, saldo: +(prev + item.entradas - item.saidas).toFixed(0) })
  return acc
}, [])

const lancamentosBase = [
  { data: '01/04/2026', descricao: 'Comissão — Venda Pinheiros',          categoria: 'Comissão',     tipo: 'Entrada', valor: 28_500, saldo: 284_200 },
  { data: '02/04/2026', descricao: 'Aluguel escritório',                   categoria: 'Despesa Fixa', tipo: 'Saída',   valor: 3_800,  saldo: 280_400 },
  { data: '03/04/2026', descricao: 'Comissão — Locação Moema',             categoria: 'Comissão',     tipo: 'Entrada', valor: 4_200,  saldo: 284_600 },
  { data: '05/04/2026', descricao: 'Marketing digital — Meta Ads',         categoria: 'Marketing',    tipo: 'Saída',   valor: 2_100,  saldo: 282_500 },
  { data: '08/04/2026', descricao: 'Comissão — Venda Itaim Bibi',          categoria: 'Comissão',     tipo: 'Entrada', valor: 42_000, saldo: 324_500 },
  { data: '10/04/2026', descricao: 'Seguro profissional anual',             categoria: 'Despesa Fixa', tipo: 'Saída',   valor: 1_800,  saldo: 322_700 },
  { data: '12/04/2026', descricao: 'Referral — Indicação de cliente',      categoria: 'Comissão',     tipo: 'Entrada', valor: 8_500,  saldo: 331_200 },
  { data: '15/04/2026', descricao: 'Curso especialização CRECI',            categoria: 'Educação',     tipo: 'Saída',   valor: 1_200,  saldo: 330_000 },
  { data: '18/04/2026', descricao: 'Comissão — Permuta Vila Madalena',     categoria: 'Comissão',     tipo: 'Entrada', valor: 18_000, saldo: 348_000 },
  { data: '20/04/2026', descricao: 'Combustível e transporte',              categoria: 'Variável',     tipo: 'Saída',   valor: 980,   saldo: 347_020 },
]

const projecaoData = [
  { mes: 'Jan', real: 27,  projetado: 27  },
  { mes: 'Fev', real: 36,  projetado: 36  },
  { mes: 'Mar', real: 32,  projetado: 34  },
  { mes: 'Abr', real: 24,  projetado: 28  },
  { mes: 'Mai', real: 37,  projetado: 38  },
  { mes: 'Jun', real: 38,  projetado: 40  },
  { mes: 'Jul', real: 33,  projetado: 35  },
  { mes: 'Ago', real: 44,  projetado: 45  },
  { mes: 'Set', real: 41,  projetado: 42  },
  { mes: 'Out', real: null as number | null, projetado: 48 },
  { mes: 'Nov', real: null as number | null, projetado: 52 },
  { mes: 'Dez', real: null as number | null, projetado: 58 },
]

const projecoesMeses = [
  { mes: 'Outubro 2026',  entradas: 'R$ 148k', saidas: 'R$ 100k', resultado: 'R$ 48k' },
  { mes: 'Novembro 2026', entradas: 'R$ 155k', saidas: 'R$ 103k', resultado: 'R$ 52k' },
  { mes: 'Dezembro 2026', entradas: 'R$ 168k', saidas: 'R$ 110k', resultado: 'R$ 58k' },
]

function fmtBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

/* ── icons ──────────────────────────────────────────────── */

function IconBalance() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
function IconIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  )
}
function IconOut() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
  )
}
function IconResult() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

/* ── component ──────────────────────────────────────────── */

export default function FluxoCaixaPage() {
  const [tab,             setTab]             = useState('mensal')
  const [filterTipo,      setFilterTipo]      = useState('todos')
  const [filterCategoria, setFilterCategoria] = useState('todas')
  const [modalOpen,       setModalOpen]       = useState(false)
  const [lancamentos,     setLancamentos]     = useState(lancamentosBase)

  const [novaDescricao, setNovaDescricao] = useState('')
  const [novaCategoria, setNovaCategoria] = useState('')
  const [novoTipo,      setNovoTipo]      = useState('Entrada')
  const [novoValor,     setNovoValor]     = useState('')
  const [novaData,      setNovaData]      = useState('')

  const lancamentosFiltrados = lancamentos.filter((l) => {
    const matchTipo = filterTipo === 'todos' || l.tipo === filterTipo
    const matchCat  = filterCategoria === 'todas' || l.categoria === filterCategoria
    return matchTipo && matchCat
  })

  function handleNovoLancamento(e: React.FormEvent) {
    e.preventDefault()
    if (!novaDescricao || !novoValor || !novaData) return
    const valor = Number(novoValor)
    const lastSaldo = lancamentos[lancamentos.length - 1]?.saldo ?? 0
    const newSaldo = novoTipo === 'Entrada' ? lastSaldo + valor : lastSaldo - valor
    setLancamentos(prev => [
      ...prev,
      {
        data: novaData,
        descricao: novaDescricao,
        categoria: novaCategoria || 'Outros',
        tipo: novoTipo,
        valor,
        saldo: newSaldo,
      },
    ])
    setModalOpen(false)
    setNovaDescricao(''); setNovaCategoria(''); setNovoTipo('Entrada'); setNovoValor(''); setNovaData('')
  }

  return (
    <>
      <Topbar
        title="Fluxo de Caixa"
        actions={
          <Button size="sm" onClick={() => setModalOpen(true)}>+ Novo Lançamento</Button>
        }
      />

      <div className={styles.page}>
        {/* KPIs */}
        <div className={styles.page__kpis}>
          <StatCard label="Saldo Atual"       value="R$ 347k" trendLabel="atualizado hoje"        icon={<IconBalance />} />
          <StatCard label="Entradas no Mês"   value="R$ 101k" trend={8.5}  trendLabel="vs. mês anterior" icon={<IconIn />} variant="accent" />
          <StatCard label="Saídas no Mês"     value="R$ 10k"  trend={-3.2} trendLabel="vs. mês anterior" icon={<IconOut />} />
          <StatCard label="Resultado do Mês"  value="R$ 91k"  trend={18}   trendLabel="vs. mês anterior" icon={<IconResult />} />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="mensal">Visão Mensal</TabsTrigger>
            <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
            <TabsTrigger value="projecao">Projeção</TabsTrigger>
          </TabsList>

          {/* ── Visão Mensal ── */}
          <TabsPanel value="mensal">
            <div className={styles.panel}>
              <Card>
                <CardHeader>
                  <span className={styles.card__title}>Entradas vs. Saídas</span>
                  <span className={styles.card__subtitle}>Últimos 12 meses · R$ mil</span>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={mensalData} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                        formatter={(v: unknown, name: unknown) => [`R$ ${v as number}k`, name === 'entradas' ? 'Entradas' : 'Saídas']} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }}
                        formatter={(v) => v === 'entradas' ? 'Entradas' : 'Saídas'} />
                      <Bar dataKey="entradas" fill="var(--success-500)" radius={[4, 4, 0, 0]} name="entradas" />
                      <Bar dataKey="saidas"   fill="var(--danger-500)"  radius={[4, 4, 0, 0]} name="saidas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <span className={styles.card__title}>Saldo Acumulado</span>
                  <span className={styles.card__subtitle}>R$ mil</span>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={saldoAcumulado} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="saldoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--brand-500)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--brand-500)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                        formatter={(v: unknown) => [`R$ ${v as number}k`, 'Saldo']} />
                      <Area type="monotone" dataKey="saldo" stroke="var(--brand-500)" strokeWidth={2} fill="url(#saldoGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>
            </div>
          </TabsPanel>

          {/* ── Lançamentos ── */}
          <TabsPanel value="lancamentos">
            <div className={styles.panel}>
              <div className={styles.lancamentos__toolbar}>
                <div className={styles.lancamentos__filters}>
                  <select className={styles.select} value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} aria-label="Filtrar por tipo">
                    <option value="todos">Todos os tipos</option>
                    <option value="Entrada">Entrada</option>
                    <option value="Saída">Saída</option>
                  </select>
                  <select className={styles.select} value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)} aria-label="Filtrar por categoria">
                    <option value="todas">Todas as categorias</option>
                    <option value="Comissão">Comissão</option>
                    <option value="Despesa Fixa">Despesa Fixa</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Educação">Educação</option>
                    <option value="Variável">Variável</option>
                  </select>
                </div>
                <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>+ Novo Lançamento</Button>
              </div>

              <Card>
                <CardBody>
                  <div className={styles.table__wrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th className={styles.table__th}>Data</th>
                          <th className={styles.table__th}>Descrição</th>
                          <th className={styles.table__th}>Categoria</th>
                          <th className={styles.table__th}>Tipo</th>
                          <th className={styles.table__th}>Valor</th>
                          <th className={styles.table__th}>Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lancamentosFiltrados.map((l, i) => (
                          <tr key={i} className={styles.table__tr}>
                            <td className={styles.table__td}>{l.data}</td>
                            <td className={styles.table__td}>{l.descricao}</td>
                            <td className={styles.table__td}>{l.categoria}</td>
                            <td className={styles.table__td}>
                              <span className={l.tipo === 'Entrada' ? styles['badge--entrada'] : styles['badge--saida']}>{l.tipo}</span>
                            </td>
                            <td className={styles[l.tipo === 'Entrada' ? 'td--entrada' : 'td--saida']}>
                              {l.tipo === 'Entrada' ? '+' : '-'}{fmtBRL(l.valor)}
                            </td>
                            <td className={styles.table__td}>{fmtBRL(l.saldo)}</td>
                          </tr>
                        ))}
                        {lancamentosFiltrados.length === 0 && (
                          <tr><td colSpan={6} className={styles['td--empty']}>Nenhum lançamento encontrado.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </div>
          </TabsPanel>

          {/* ── Projeção ── */}
          <TabsPanel value="projecao">
            <div className={styles.panel}>
              <Card>
                <CardHeader>
                  <span className={styles.card__title}>Resultado: Real vs. Projetado</span>
                  <span className={styles.card__subtitle}>R$ mil · linha tracejada = projeção</span>
                </CardHeader>
                <CardBody>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={projecaoData} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--paragraph)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--card-background)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', fontSize: 12 }}
                        formatter={(v: unknown, name: unknown) => v !== null && v !== undefined ? [`R$ ${v as number}k`, name === 'real' ? 'Real' : 'Projetado'] : ['—', '']} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }}
                        formatter={(v) => v === 'real' ? 'Real' : 'Projetado'} />
                      <Line type="monotone" dataKey="real"      stroke="var(--brand-500)"   strokeWidth={2} dot={{ r: 3 }} connectNulls={false} name="real" />
                      <Line type="monotone" dataKey="projetado" stroke="var(--warning-500)" strokeWidth={2} strokeDasharray="5 3" dot={false} name="projetado" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardBody>
              </Card>

              <div className={styles.projecoes__grid}>
                {projecoesMeses.map((p, i) => (
                  <Card key={i}>
                    <CardBody>
                      <div className={styles.projecao__card}>
                        <p className={styles.projecao__mes}>{p.mes}</p>
                        <div className={styles.projecao__rows}>
                          <div className={styles.projecao__row}>
                            <span className={styles.projecao__label}>Entradas</span>
                            <span className={styles['projecao__val--entrada']}>{p.entradas}</span>
                          </div>
                          <div className={styles.projecao__row}>
                            <span className={styles.projecao__label}>Saídas</span>
                            <span className={styles['projecao__val--saida']}>{p.saidas}</span>
                          </div>
                          <div className={styles.projecao__row}>
                            <span className={styles.projecao__label}>Resultado</span>
                            <span className={styles['projecao__val--resultado']}>{p.resultado}</span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </TabsPanel>
        </Tabs>
      </div>

      {/* Novo Lançamento Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Lançamento"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary"   size="md" onClick={handleNovoLancamento}>Salvar</Button>
          </div>
        }
      >
        <form onSubmit={handleNovoLancamento} className={styles.modal__form}>
          <Input label="Data" type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} required />
          <Input label="Descrição" placeholder="Ex: Comissão — Venda Jardins" value={novaDescricao} onChange={(e) => setNovaDescricao(e.target.value)} required />
          <Input label="Categoria" placeholder="Ex: Comissão, Despesa Fixa, Marketing" value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value)} />
          <div className={styles.modal__row}>
            <div className={styles.modal__field}>
              <label className={styles.modal__label}>Tipo</label>
              <select className={styles.select} value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)}>
                <option value="Entrada">Entrada</option>
                <option value="Saída">Saída</option>
              </select>
            </div>
            <Input label="Valor (R$)" placeholder="Ex: 28500" type="number" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} required />
          </div>
        </form>
      </Modal>
    </>
  )
}
