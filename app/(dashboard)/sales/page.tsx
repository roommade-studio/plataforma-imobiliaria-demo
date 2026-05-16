'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import Card, { CardBody } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Input, { Select, Textarea } from '@/components/ui/Input'
import styles from './page.module.css'

/* ─── Icons ──────────────────────────────────────────────── */

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function IconDollar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
function IconCoins() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <line x1="16.71" y1="13.88" x2="17" y2="14" />
    </svg>
  )
}
function IconTag() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

/* ─── Types ─────────────────────────────────────────────── */

type SaleStatus = 'Concluída' | 'Em Análise' | 'Cancelada'

interface Sale {
  id:         string
  imovel:     string
  comprador:  string
  valor:      string
  data:       string
  comissao:   string
  status:     SaleStatus
}

/* ─── Mock data ──────────────────────────────────────────── */

const MOCK_SALES: Sale[] = [
  { id: 'V001', imovel: 'Av. Paulista, 2100 – Apto 84', comprador: 'Carlos Eduardo Mendes',    valor: 'R$ 1.250.000', data: '12/03/2025', comissao: 'R$ 37.500',  status: 'Concluída'  },
  { id: 'V002', imovel: 'R. Oscar Freire, 412 – Cobertura', comprador: 'Fernanda Lima Sousa',  valor: 'R$ 2.800.000', data: '25/03/2025', comissao: 'R$ 84.000',  status: 'Concluída'  },
  { id: 'V003', imovel: 'Al. Santos, 700 – Sala 32',    comprador: 'Grupo Alfa Investimentos', valor: 'R$ 680.000',   data: '01/04/2025', comissao: 'R$ 20.400',  status: 'Em Análise' },
  { id: 'V004', imovel: 'R. Haddock Lobo, 55 – Apto 11', comprador: 'Renata Carvalho Nunes',  valor: 'R$ 950.000',   data: '03/04/2025', comissao: 'R$ 28.500',  status: 'Em Análise' },
  { id: 'V005', imovel: 'Av. Brigadeiro Faria Lima, 3900', comprador: 'Paulo Roberto Teixeira', valor: 'R$ 3.400.000', data: '28/02/2025', comissao: 'R$ 102.000', status: 'Concluída'  },
  { id: 'V006', imovel: 'R. José Maria Lisboa, 220',   comprador: 'Marina Oliveira Castro',   valor: 'R$ 780.000',   data: '15/03/2025', comissao: 'R$ 23.400',  status: 'Cancelada'  },
  { id: 'V007', imovel: 'Al. Campinas, 1234 – Apto 31', comprador: 'João Henrique Barbosa',   valor: 'R$ 520.000',   data: '07/04/2025', comissao: 'R$ 15.600',  status: 'Em Análise' },
  { id: 'V008', imovel: 'R. Pamplona, 145 – Apto 62',  comprador: 'Luciana Ferreira Dias',    valor: 'R$ 1.100.000', data: '10/04/2025', comissao: 'R$ 33.000',  status: 'Concluída'  },
]

/* ─── Helpers ────────────────────────────────────────────── */

function statusBadgeClass(status: SaleStatus): string {
  switch (status) {
    case 'Concluída':  return cn(styles.badge, styles['badge--green'])
    case 'Em Análise': return cn(styles.badge, styles['badge--yellow'])
    case 'Cancelada':  return cn(styles.badge, styles['badge--red'])
  }
}

/* ─── Component ──────────────────────────────────────────── */

export default function SalesPage() {
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen,    setModalOpen]    = useState(false)

  /* form state */
  const [fImovel,      setFImovel]     = useState('')
  const [fComprador,   setFComprador]  = useState('')
  const [fValor,       setFValor]      = useState('')
  const [fData,        setFData]       = useState('')
  const [fObs,         setFObs]        = useState('')

  const filtered = MOCK_SALES.filter(s => {
    const matchSearch = s.imovel.toLowerCase().includes(search.toLowerCase())
                     || s.comprador.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === '' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  function handleClose() {
    setModalOpen(false)
    setFImovel(''); setFComprador(''); setFValor(''); setFData(''); setFObs('')
  }

  return (
    <>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.page__header}>
          <h1 className={styles.page__title}>Minhas Vendas</h1>
          <Button size="sm" onClick={() => setModalOpen(true)}>+ Nova Venda</Button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <StatCard label="Vendas no Mês"        value={3}           trend={15}    trendLabel="vs. mês anterior" icon={<IconCheck />} />
          <StatCard label="Receita Total"         value="R$ 2,4M"                  icon={<IconDollar />} />
          <StatCard label="Comissão Recebida"     value="R$ 72k"      trend={8.3}  trendLabel="vs. mês anterior" icon={<IconCoins />} />
          <StatCard label="Ticket Médio"          value="R$ 800k"                  icon={<IconTag />} />
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className={styles.filters}>
              <Input
                placeholder="Buscar por imóvel ou comprador..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.filters__search}
              />
              <Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className={styles.filters__select}
              >
                <option value="">Todos os status</option>
                <option value="Concluída">Concluída</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Cancelada">Cancelada</option>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Table */}
        <Card>
          <CardBody className={styles['table-wrapper']}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Imóvel</th>
                  <th>Comprador</th>
                  <th>Valor</th>
                  <th>Data</th>
                  <th>Comissão</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sale => (
                  <tr key={sale.id} className={styles.table__row}>
                    <td className={styles['td--primary']}>{sale.imovel}</td>
                    <td>{sale.comprador}</td>
                    <td className={styles['td--number']}>{sale.valor}</td>
                    <td>{sale.data}</td>
                    <td className={styles['td--number']}>{sale.comissao}</td>
                    <td><span className={statusBadgeClass(sale.status)}>{sale.status}</span></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles['td--empty']}>Nenhuma venda encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

      {/* Modal Nova Venda */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title="Nova Venda"
        maxWidth="36rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleClose}>Salvar Venda</Button>
          </div>
        }
      >
        <div className={styles.form}>
          <Input label="Imóvel"         required value={fImovel}    onChange={e => setFImovel(e.target.value)}    placeholder="Ex: Av. Paulista, 1000 – Apto 42" />
          <Input label="Comprador"      required value={fComprador} onChange={e => setFComprador(e.target.value)} placeholder="Nome completo do comprador" />
          <div className={styles['form__row--2']}>
            <Input label="Valor de Venda" required value={fValor}   onChange={e => setFValor(e.target.value)}     placeholder="R$ 0,00" />
            <Input label="Data"           required type="date" value={fData} onChange={e => setFData(e.target.value)} />
          </div>
          <Textarea label="Observações" value={fObs} onChange={e => setFObs(e.target.value)} placeholder="Informações adicionais..." rows={3} />
        </div>
      </Modal>
    </>
  )
}
