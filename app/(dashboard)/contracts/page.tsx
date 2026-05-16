'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Card, { CardBody } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Input, { Select, Textarea } from '@/components/ui/Input'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from '@/components/ui/Tabs'
import styles from './page.module.css'

/* ─── Types ─────────────────────────────────────────────── */

type ContractTipo   = 'gestao' | 'compra-venda'
type ContractStatus = 'Rascunho' | 'Aguardando Revisão' | 'Ajustes Solicitados' | 'Aprovado' | 'Assinado'

interface Contract {
  id:       string
  numero:   string
  tipo:     ContractTipo
  imovel:   string
  corretor: string
  partes:   string
  valor:    string
  inicio:   string
  status:   ContractStatus
}

/* ─── Mock data ──────────────────────────────────────────── */

const MOCK_CONTRACTS: Contract[] = [
  // Rascunho
  { id: 'C001', numero: '#G-2025-001', tipo: 'gestao',        imovel: 'Av. Paulista, 2100 – Apto 84',         corretor: 'Lucas Martins',  partes: 'J. Silva (prop.) / Roommade',            valor: '3% s/ venda',  inicio: '01/01/2025', status: 'Rascunho'            },
  { id: 'C007', numero: '#V-2025-001', tipo: 'compra-venda',  imovel: 'Al. Campinas, 1234 – Apto 31',          corretor: 'Ana Paula',       partes: 'D. Rocha (vend.) / E. Martins (comp.)',   valor: 'R$ 720.000',   inicio: '15/02/2025', status: 'Rascunho'            },
  // Aguardando Revisão
  { id: 'C002', numero: '#G-2025-002', tipo: 'gestao',        imovel: 'R. Oscar Freire, 412 – Cobertura',      corretor: 'Lucas Martins',  partes: 'R. Nunes (prop.) / Roommade',             valor: '3% s/ venda',  inicio: '01/02/2025', status: 'Aguardando Revisão'  },
  { id: 'C008', numero: '#V-2025-002', tipo: 'compra-venda',  imovel: 'R. José Maria Lisboa, 220',              corretor: 'Fernanda Costa', partes: 'K. Alves (vend.) / P. Rodrigues (comp.)', valor: 'R$ 1.340.000', inicio: '01/04/2025', status: 'Aguardando Revisão'  },
  // Ajustes Solicitados
  { id: 'C003', numero: '#G-2025-003', tipo: 'gestao',        imovel: 'Al. Santos, 700 – Sala 32',             corretor: 'Rodrigo Lima',   partes: 'Alfa Ltda (prop.) / Roommade',            valor: '5% s/ venda',  inicio: '01/03/2024', status: 'Ajustes Solicitados' },
  { id: 'C009', numero: '#V-2025-003', tipo: 'compra-venda',  imovel: 'R. dos Pinheiros, 450 – Apto 82',       corretor: 'Ana Paula',       partes: 'C. Mendes (vend.) / B. Lima (comp.)',     valor: 'R$ 1.350.000', inicio: '10/03/2025', status: 'Ajustes Solicitados' },
  // Aprovado
  { id: 'C004', numero: '#G-2025-004', tipo: 'gestao',        imovel: 'R. Haddock Lobo, 55 – Apto 11',        corretor: 'Rodrigo Lima',   partes: 'P. Teixeira (prop.) / Roommade',          valor: '3% s/ venda',  inicio: '01/06/2024', status: 'Aprovado'            },
  { id: 'C005', numero: '#V-2025-005', tipo: 'compra-venda',  imovel: 'Av. Brigadeiro Faria Lima, 3900',       corretor: 'Fernanda Costa', partes: 'L. Ferreira (vend.) / G. Costa (comp.)',  valor: 'R$ 1.850.000', inicio: '01/01/2024', status: 'Aprovado'            },
  // Assinado
  { id: 'C006', numero: '#G-2024-008', tipo: 'gestao',        imovel: 'R. Pamplona, 145 – Apto 62',            corretor: 'Lucas Martins',  partes: 'M. Oliveira (prop.) / Roommade',          valor: '3% s/ venda',  inicio: '01/08/2023', status: 'Assinado'            },
  { id: 'C010', numero: '#V-2024-011', tipo: 'compra-venda',  imovel: 'Av. Rebouças, 1045 – Apto 7',           corretor: 'Fernanda Costa', partes: 'F. Dias (vend.) / S. Costa (comp.)',      valor: 'R$ 895.000',   inicio: '01/11/2024', status: 'Assinado'            },
]

/* ─── Constants ──────────────────────────────────────────── */

const ALL_STATUSES: ContractStatus[] = [
  'Rascunho', 'Aguardando Revisão', 'Ajustes Solicitados', 'Aprovado', 'Assinado',
]

/* ─── Badge helpers ──────────────────────────────────────── */

function statusBadgeClass(s: ContractStatus): string {
  switch (s) {
    case 'Rascunho':            return cn(styles.badge, styles['badge--gray'])
    case 'Aguardando Revisão':  return cn(styles.badge, styles['badge--yellow'])
    case 'Ajustes Solicitados': return cn(styles.badge, styles['badge--orange'])
    case 'Aprovado':            return cn(styles.badge, styles['badge--green'])
    case 'Assinado':            return cn(styles.badge, styles['badge--teal'])
  }
}

function tipoBadgeClass(t: ContractTipo): string {
  switch (t) {
    case 'gestao':       return cn(styles.badge, styles['badge--blue'])
    case 'compra-venda': return cn(styles.badge, styles['badge--purple'])
  }
}

function tipoLabel(t: ContractTipo): string {
  switch (t) {
    case 'gestao':       return 'Gestão'
    case 'compra-venda': return 'Compra e Venda'
  }
}

/* ─── SVG Icons ──────────────────────────────────────────── */

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M8 4.5V8.25L10.5 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconComment() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M14 10.333A1.333 1.333 0 0 1 12.667 11.667H4.667L2 14V3.333A1.333 1.333 0 0 1 3.333 2H12.667A1.333 1.333 0 0 1 14 3.333v7Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconSigned() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M9.5 2.5L13.5 6.5L5.5 14.5H1.5V10.5L9.5 2.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 4L12 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
}

/* ─── Status card meta ───────────────────────────────────── */

type CardVariant = 'neutral' | 'amber' | 'green' | 'teal'

const STATUS_CARD_META: Record<ContractStatus, { label: string; icon: React.ReactNode; variant: CardVariant }> = {
  'Rascunho':            { label: 'Rascunhos',           icon: <IconClock />,   variant: 'neutral' },
  'Aguardando Revisão':  { label: 'Aguardando Revisão',  icon: <IconClock />,   variant: 'amber'   },
  'Ajustes Solicitados': { label: 'Ajustes Solicitados', icon: <IconComment />, variant: 'neutral' },
  'Aprovado':            { label: 'Aprovados',            icon: <IconCheck />,   variant: 'green'   },
  'Assinado':            { label: 'Assinados',            icon: <IconSigned />,  variant: 'teal'    },
}

/* ─── Contract table ─────────────────────────────────────── */

function ContractTable({ rows }: { rows: Contract[] }) {
  const router = useRouter()
  return (
    <div className={styles['table-wrapper']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Tipo</th>
            <th>Imóvel</th>
            <th>Corretor</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(c => (
            <tr
              key={c.id}
              className={styles.table__row}
              onClick={() => router.push('/contracts/novo')}
            >
              <td><span className={statusBadgeClass(c.status)}>{c.status}</span></td>
              <td><span className={tipoBadgeClass(c.tipo)}>{tipoLabel(c.tipo)}</span></td>
              <td className={styles['td--primary']}>{c.imovel}</td>
              <td>{c.corretor}</td>
              <td className={styles['td--mono']}>{c.inicio}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className={styles['td--empty']}>
                Nenhum contrato encontrado nesta categoria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */

export default function ContractsPage() {
  const router = useRouter()
  const [activeStatus, setActiveStatus] = useState<ContractStatus | 'todos'>('Rascunho')
  const [filterTipo,   setFilterTipo]   = useState<'todos' | ContractTipo | 'outros'>('todos')
  const [search,       setSearch]       = useState('')
  const [modalOpen,    setModalOpen]    = useState(false)
  const [formTipo,     setFormTipo]     = useState<ContractTipo>('gestao')

  const [fImovel, setFImovel] = useState('')
  const [fParteA, setFParteA] = useState('')
  const [fParteB, setFParteB] = useState('')
  const [fValor,  setFValor]  = useState('')
  const [fInicio, setFInicio] = useState('')
  const [fFim,    setFFim]    = useState('')
  const [fObs,    setFObs]    = useState('')

  function handleClose() {
    setModalOpen(false)
    setFormTipo('gestao')
    setFImovel(''); setFParteA(''); setFParteB('')
    setFValor(''); setFInicio(''); setFFim(''); setFObs('')
  }

  const filtered = MOCK_CONTRACTS
    .filter(c => activeStatus === 'todos' || c.status === activeStatus)
    .filter(c => {
      if (filterTipo === 'todos') return true
      if (filterTipo === 'outros') return c.tipo !== 'gestao' && c.tipo !== 'compra-venda'
      return c.tipo === filterTipo
    })
    .filter(c => {
      const q = search.trim().toLowerCase()
      if (!q) return true
      return (
        c.imovel.toLowerCase().includes(q) ||
        c.corretor.toLowerCase().includes(q) ||
        c.partes.toLowerCase().includes(q)
      )
    })

  return (
    <>
      <div className={styles.page}>

        {/* ── Header ── */}
        <div className={styles.page__header}>
          <div className={styles.page__title__wrap}>
            <h1 className={styles.page__title}>Jurídico</h1>
            <span className={styles.page__beta}>beta</span>
          </div>
          <Button size="sm" onClick={() => router.push('/contracts/novo')}>+ Novo Contrato</Button>
        </div>

        {/* ── Status summary cards ── */}
        <div className={styles.status__cards}>
          {ALL_STATUSES.map(s => {
            const meta  = STATUS_CARD_META[s]
            const count = MOCK_CONTRACTS.filter(c => c.status === s).length
            const isActive = activeStatus === s
            return (
              <button
                key={s}
                type="button"
                className={cn(
                  styles.status__card,
                  styles[`status__card--${meta.variant}` as keyof typeof styles],
                  isActive && styles['status__card--selected'],
                )}
                onClick={() => setActiveStatus(prev => prev === s ? 'todos' : s)}
              >
                <span className={cn(
                  styles.status__card__icon,
                  styles[`status__card__icon--${meta.variant}` as keyof typeof styles],
                )}>
                  {meta.icon}
                </span>
                <span className={styles.status__card__body}>
                  <span className={styles.status__card__count}>{count}</span>
                  <span className={styles.status__card__label}>{meta.label}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Type filter pills ── */}
        <div className={styles.type__pills}>
          {(['todos', 'gestao', 'compra-venda', 'outros'] as const).map(t => (
            <button
              key={t}
              type="button"
              className={cn(styles.type__pill, filterTipo === t && styles['type__pill--active'])}
              onClick={() => setFilterTipo(t)}
            >
              {t === 'todos'          ? 'Todos os contratos'
               : t === 'gestao'      ? 'Gestão'
               : t === 'compra-venda'? 'Compra e Venda'
               :                       'Outros'}
            </button>
          ))}
        </div>

        {/* ── Card: search + tabs + table ── */}
        <Card>
          <CardBody>

            {/* Toolbar */}
            <div className={styles.table__toolbar}>
              <div className={styles.table__search}>
                <span className={styles.table__search__icon} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.25"/>
                    <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type="search"
                  className={styles.table__search__input}
                  placeholder="Buscar imóvel, corretor ou parte..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                className={styles.table__status__select}
                value={activeStatus}
                onChange={e => setActiveStatus(e.target.value as ContractStatus | 'todos')}
              >
                <option value="todos">Todos os Status</option>
                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Status tabs */}
            <Tabs
              value={activeStatus}
              onValueChange={v => setActiveStatus(v as ContractStatus | 'todos')}
            >
              <TabsList>
                <TabsTrigger value="Rascunho">Rascunhos</TabsTrigger>
                <TabsTrigger value="Aguardando Revisão">Aguardando Revisão</TabsTrigger>
                <TabsTrigger value="Ajustes Solicitados">Ajustes Solicitados</TabsTrigger>
                <TabsTrigger value="Aprovado">Aprovados</TabsTrigger>
                <TabsTrigger value="Assinado">Assinados</TabsTrigger>
              </TabsList>
              {([...ALL_STATUSES, 'todos'] as const).map(s => (
                <TabsPanel key={s} value={s}>
                  <ContractTable rows={filtered} />
                </TabsPanel>
              ))}
            </Tabs>

          </CardBody>
        </Card>
      </div>

      {/* ── Modal: Novo Contrato ── */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title="Novo Contrato"
        maxWidth="38rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleClose}>Salvar Rascunho</Button>
          </div>
        }
      >
        <div className={styles.form}>
          <Select
            label="Tipo de contrato"
            value={formTipo}
            onChange={e => setFormTipo(e.target.value as ContractTipo)}
          >
            <option value="gestao">Gestão (Exclusividade/Prioridade)</option>
            <option value="compra-venda">Compra e Venda</option>
          </Select>
          <Input
            label="Imóvel"
            required
            value={fImovel}
            onChange={e => setFImovel(e.target.value)}
            placeholder="Endereço do imóvel"
          />
          {formTipo === 'compra-venda' ? (
            <>
              <div className={styles['form__row--2']}>
                <Input label="Vendedor"  required value={fParteA} onChange={e => setFParteA(e.target.value)} placeholder="Nome do vendedor"  />
                <Input label="Comprador" required value={fParteB} onChange={e => setFParteB(e.target.value)} placeholder="Nome do comprador" />
              </div>
              <Input label="Valor de Venda" required value={fValor} onChange={e => setFValor(e.target.value)} placeholder="R$ 0,00" />
            </>
          ) : (
            <>
              <Input label="Proprietário"      required value={fParteA} onChange={e => setFParteA(e.target.value)} placeholder="Nome completo do proprietário"   />
              <Input label="Comissão / Taxa"   required value={fValor}  onChange={e => setFValor(e.target.value)}  placeholder="Ex: 3% sobre o valor de venda" />
            </>
          )}
          <div className={styles['form__row--2']}>
            <Input label="Data de Início"      required type="date" value={fInicio} onChange={e => setFInicio(e.target.value)} />
            <Input label="Data de Vencimento"  required type="date" value={fFim}    onChange={e => setFFim(e.target.value)}    />
          </div>
          <Textarea
            label="Observações"
            value={fObs}
            onChange={e => setFObs(e.target.value)}
            placeholder="Cláusulas adicionais, notas..."
            rows={3}
          />
        </div>
      </Modal>
    </>
  )
}
