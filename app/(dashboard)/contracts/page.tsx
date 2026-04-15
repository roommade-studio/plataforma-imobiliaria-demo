'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import Card, { CardBody } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Input, { Select, Textarea } from '@/components/ui/Input'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from '@/components/ui/Tabs'
import styles from './page.module.css'

/* ─── Types ─────────────────────────────────────────────── */

type ContractStatus = 'Ativo' | 'Vencendo' | 'Vencido' | 'Concluído'

interface Contract {
  id:         string
  numero:     string
  imovel:     string
  partes:     string
  valor:      string
  inicio:     string
  vencimento: string
  status:     ContractStatus
}

/* ─── Mock data ──────────────────────────────────────────── */

const MOCK_CONTRACTS: Contract[] = [
  { id: 'C001', numero: '#2025-001', imovel: 'Av. Paulista, 2100 – Apto 84',          partes: 'J. Silva / M. Costa',        valor: 'R$ 4.200/mês',  inicio: '01/01/2025', vencimento: '31/12/2025', status: 'Ativo'    },
  { id: 'C002', numero: '#2025-002', imovel: 'R. Oscar Freire, 412 – Cobertura',       partes: 'R. Nunes / F. Lima',         valor: 'R$ 8.500/mês',  inicio: '01/02/2025', vencimento: '31/01/2026', status: 'Ativo'    },
  { id: 'C003', numero: '#2025-003', imovel: 'Al. Santos, 700 – Sala 32',              partes: 'Alfa Ltda / Beta S.A.',      valor: 'R$ 3.800/mês',  inicio: '01/03/2024', vencimento: '30/04/2025', status: 'Vencendo' },
  { id: 'C004', numero: '#2025-004', imovel: 'R. Haddock Lobo, 55 – Apto 11',         partes: 'P. Teixeira / C. Mendes',    valor: 'R$ 2.200/mês',  inicio: '01/06/2024', vencimento: '31/05/2025', status: 'Vencendo' },
  { id: 'C005', numero: '#2024-012', imovel: 'Av. Brigadeiro Faria Lima, 3900',        partes: 'L. Ferreira / J. Barbosa',   valor: 'R$ 15.000/mês', inicio: '01/01/2024', vencimento: '31/12/2024', status: 'Concluído'},
  { id: 'C006', numero: '#2024-008', imovel: 'R. Pamplona, 145 – Apto 62',            partes: 'M. Oliveira / G. Santos',    valor: 'R$ 3.100/mês',  inicio: '01/08/2023', vencimento: '31/07/2024', status: 'Vencido'  },
  { id: 'C007', numero: '#2025-005', imovel: 'Al. Campinas, 1234 – Apto 31',          partes: 'D. Rocha / E. Martins',      valor: 'R$ 1.900/mês',  inicio: '15/02/2025', vencimento: '14/02/2026', status: 'Ativo'    },
  { id: 'C008', numero: '#2025-006', imovel: 'R. José Maria Lisboa, 220',             partes: 'K. Alves / P. Rodrigues',    valor: 'R$ 5.600/mês',  inicio: '01/04/2025', vencimento: '31/03/2026', status: 'Ativo'    },
]

/* ─── Helpers ────────────────────────────────────────────── */

function statusBadgeClass(status: ContractStatus): string {
  switch (status) {
    case 'Ativo':     return cn(styles.badge, styles['badge--green'])
    case 'Vencendo':  return cn(styles.badge, styles['badge--yellow'])
    case 'Vencido':   return cn(styles.badge, styles['badge--red'])
    case 'Concluído': return cn(styles.badge, styles['badge--gray'])
  }
}

const TAB_STATUSES: Record<string, ContractStatus[]> = {
  ativos:    ['Ativo'],
  vencendo:  ['Vencendo'],
  historico: ['Vencido', 'Concluído'],
}

/* ─── Sub-component: table ───────────────────────────────── */

function ContractTable({ rows }: { rows: Contract[] }) {
  return (
    <div className={styles['table-wrapper']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Contrato Nº</th>
            <th>Imóvel</th>
            <th>Partes</th>
            <th>Valor</th>
            <th>Início</th>
            <th>Vencimento</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(c => (
            <tr key={c.id} className={styles.table__row}>
              <td className={styles['td--mono']}>{c.numero}</td>
              <td className={styles['td--primary']}>{c.imovel}</td>
              <td>{c.partes}</td>
              <td className={styles['td--number']}>{c.valor}</td>
              <td>{c.inicio}</td>
              <td>{c.vencimento}</td>
              <td><span className={statusBadgeClass(c.status)}>{c.status}</span></td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className={styles['td--empty']}>Nenhum contrato encontrado nesta categoria.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */

export default function ContractsPage() {
  const [tab,       setTab]       = useState('ativos')
  const [modalOpen, setModalOpen] = useState(false)

  /* form state */
  const [fImovel,  setFImovel]  = useState('')
  const [fParteA,  setFParteA]  = useState('')
  const [fParteB,  setFParteB]  = useState('')
  const [fValor,   setFValor]   = useState('')
  const [fInicio,  setFInicio]  = useState('')
  const [fFim,     setFFim]     = useState('')
  const [fObs,     setFObs]     = useState('')

  function handleClose() {
    setModalOpen(false)
    setFImovel(''); setFParteA(''); setFParteB('')
    setFValor(''); setFInicio(''); setFFim(''); setFObs('')
  }

  const tabRows = MOCK_CONTRACTS.filter(c => TAB_STATUSES[tab].includes(c.status))

  return (
    <>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.page__header}>
          <h1 className={styles.page__title}>Meus Contratos</h1>
          <Button size="sm" onClick={() => setModalOpen(true)}>+ Novo Contrato</Button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <StatCard label="Total de Contratos"    value={12} />
          <StatCard label="Ativos"                value={8}  trend={0} trendLabel="estável" />
          <StatCard label="Vencendo em 30 dias"   value={2}  />
          <StatCard label="Concluídos"            value={4}  />
        </div>

        {/* Tabs + Table */}
        <Card>
          <CardBody>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="ativos">Ativos</TabsTrigger>
                <TabsTrigger value="vencendo">Vencendo</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>

              <TabsPanel value="ativos">
                <ContractTable rows={tabRows} />
              </TabsPanel>
              <TabsPanel value="vencendo">
                <ContractTable rows={tabRows} />
              </TabsPanel>
              <TabsPanel value="historico">
                <ContractTable rows={tabRows} />
              </TabsPanel>
            </Tabs>
          </CardBody>
        </Card>
      </div>

      {/* Modal Novo Contrato */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title="Novo Contrato"
        maxWidth="38rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleClose}>Salvar Contrato</Button>
          </div>
        }
      >
        <div className={styles.form}>
          <Input label="Imóvel" required value={fImovel} onChange={e => setFImovel(e.target.value)} placeholder="Endereço do imóvel" />
          <div className={styles['form__row--2']}>
            <Input label="Parte A (Locador/Vendedor)" required value={fParteA} onChange={e => setFParteA(e.target.value)} placeholder="Nome completo" />
            <Input label="Parte B (Locatário/Comprador)" required value={fParteB} onChange={e => setFParteB(e.target.value)} placeholder="Nome completo" />
          </div>
          <Input label="Valor Mensal / Total" required value={fValor} onChange={e => setFValor(e.target.value)} placeholder="R$ 0,00" />
          <div className={styles['form__row--2']}>
            <Input label="Data de Início" required type="date" value={fInicio} onChange={e => setFInicio(e.target.value)} />
            <Input label="Data de Vencimento" required type="date" value={fFim} onChange={e => setFFim(e.target.value)} />
          </div>
          <Textarea label="Observações" value={fObs} onChange={e => setFObs(e.target.value)} placeholder="Cláusulas adicionais, notas..." rows={3} />
        </div>
      </Modal>
    </>
  )
}
