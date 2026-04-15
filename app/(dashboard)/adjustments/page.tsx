'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import Card, { CardBody } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Input, { Select, Textarea } from '@/components/ui/Input'
import styles from './page.module.css'

/* ─── Types ─────────────────────────────────────────────── */

type AdjustmentReason = 'IPCA' | 'Mercado' | 'Correção' | 'Avaliação'

interface Adjustment {
  id:            string
  imovel:        string
  valorAnterior: string
  novoValor:     string
  variacao:      number   /* percentage */
  data:          string
  motivo:        AdjustmentReason
}

/* ─── Mock data ──────────────────────────────────────────── */

const MOCK_ADJUSTMENTS: Adjustment[] = [
  { id: 'A001', imovel: 'Av. Paulista, 2100 – Apto 84',             valorAnterior: 'R$ 1.190.000', novoValor: 'R$ 1.250.000', variacao:  5.04, data: '01/04/2025', motivo: 'Mercado'   },
  { id: 'A002', imovel: 'R. Oscar Freire, 412 – Cobertura',         valorAnterior: 'R$ 4.650.000', novoValor: 'R$ 4.800.000', variacao:  3.23, data: '01/04/2025', motivo: 'IPCA'      },
  { id: 'A003', imovel: 'Al. Santos, 700 – Sala 32',                valorAnterior: 'R$ 700.000',   novoValor: 'R$ 680.000',   variacao: -2.86, data: '15/03/2025', motivo: 'Correção'  },
  { id: 'A004', imovel: 'R. Haddock Lobo, 55 – Apto 11',           valorAnterior: 'R$ 920.000',   novoValor: 'R$ 950.000',   variacao:  3.26, data: '01/03/2025', motivo: 'Avaliação' },
  { id: 'A005', imovel: 'Av. Brigadeiro Faria Lima, 1204 – Apto 5', valorAnterior: 'R$ 2.130.000', novoValor: 'R$ 2.200.000', variacao:  3.29, data: '01/04/2025', motivo: 'IPCA'      },
  { id: 'A006', imovel: 'R. Pamplona, 145 – Apto 62',              valorAnterior: 'R$ 1.080.000', novoValor: 'R$ 1.100.000', variacao:  1.85, data: '10/03/2025', motivo: 'Mercado'   },
  { id: 'A007', imovel: 'Al. Campinas, 1234 – Apto 31',            valorAnterior: 'R$ 540.000',   novoValor: 'R$ 520.000',   variacao: -3.70, data: '20/03/2025', motivo: 'Correção'  },
  { id: 'A008', imovel: 'Av. Rebouças, 3970 – Terreno 01',         valorAnterior: 'R$ 5.200.000', novoValor: 'R$ 5.500.000', variacao:  5.77, data: '05/04/2025', motivo: 'Avaliação' },
]

/* ─── Helpers ────────────────────────────────────────────── */

function motivoBadgeClass(motivo: AdjustmentReason): string {
  switch (motivo) {
    case 'IPCA':      return cn(styles.badge, styles['badge--blue'])
    case 'Mercado':   return cn(styles.badge, styles['badge--green'])
    case 'Correção':  return cn(styles.badge, styles['badge--yellow'])
    case 'Avaliação': return cn(styles.badge, styles['badge--gray'])
  }
}

const PROPERTY_OPTIONS = [
  'Av. Paulista, 2100 – Apto 84',
  'R. Oscar Freire, 412 – Cobertura',
  'Al. Santos, 700 – Sala 32',
  'R. Haddock Lobo, 55 – Apto 11',
  'Av. Brigadeiro Faria Lima, 1204 – Apto 5',
  'R. Pamplona, 145 – Apto 62',
  'Al. Campinas, 1234 – Apto 31',
  'Av. Rebouças, 3970 – Terreno 01',
]

const CURRENT_VALUES: Record<string, string> = {
  'Av. Paulista, 2100 – Apto 84':               'R$ 1.250.000',
  'R. Oscar Freire, 412 – Cobertura':            'R$ 4.800.000',
  'Al. Santos, 700 – Sala 32':                   'R$ 680.000',
  'R. Haddock Lobo, 55 – Apto 11':              'R$ 950.000',
  'Av. Brigadeiro Faria Lima, 1204 – Apto 5':   'R$ 2.200.000',
  'R. Pamplona, 145 – Apto 62':                 'R$ 1.100.000',
  'Al. Campinas, 1234 – Apto 31':               'R$ 520.000',
  'Av. Rebouças, 3970 – Terreno 01':            'R$ 5.500.000',
}

/* ─── Page ───────────────────────────────────────────────── */

export default function AdjustmentsPage() {
  const [modalOpen,  setModalOpen]  = useState(false)

  /* form state */
  const [fImovel,    setFImovel]    = useState('')
  const [fNovoValor, setFNovoValor] = useState('')
  const [fMotivo,    setFMotivo]    = useState('')
  const [fData,      setFData]      = useState('')
  const [fObs,       setFObs]       = useState('')

  const valorAtual = fImovel ? (CURRENT_VALUES[fImovel] ?? '') : ''

  function handleClose() {
    setModalOpen(false)
    setFImovel(''); setFNovoValor(''); setFMotivo(''); setFData(''); setFObs('')
  }

  return (
    <>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.page__header}>
          <h1 className={styles.page__title}>Reajustes de Imóveis</h1>
          <Button size="sm" onClick={() => setModalOpen(true)}>+ Registrar Reajuste</Button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <StatCard label="Reajustes no Mês"      value={5}      trend={0} trendLabel="vs. mês anterior" />
          <StatCard label="Valorização Média"      value="+3,2%"            />
          <StatCard label="Imóveis Reajustados"    value="5/18"             />
        </div>

        {/* Table */}
        <Card>
          <CardBody className={styles['table-wrapper']}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Imóvel</th>
                  <th>Valor Anterior</th>
                  <th>Novo Valor</th>
                  <th>Variação</th>
                  <th>Data</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ADJUSTMENTS.map(adj => (
                  <tr key={adj.id} className={styles.table__row}>
                    <td className={styles['td--primary']}>{adj.imovel}</td>
                    <td className={styles['td--number']}>{adj.valorAnterior}</td>
                    <td className={styles['td--number']}>{adj.novoValor}</td>
                    <td>
                      <span className={cn(
                        styles['variacao'],
                        adj.variacao >= 0 ? styles['variacao--up'] : styles['variacao--down'],
                      )}>
                        {adj.variacao >= 0 ? '+' : ''}{adj.variacao.toFixed(2)}%
                      </span>
                    </td>
                    <td>{adj.data}</td>
                    <td><span className={motivoBadgeClass(adj.motivo)}>{adj.motivo}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

      {/* Modal Registrar Reajuste */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title="Registrar Reajuste"
        maxWidth="36rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleClose}>Salvar Reajuste</Button>
          </div>
        }
      >
        <div className={styles.form}>
          <Select label="Imóvel" required value={fImovel} onChange={e => setFImovel(e.target.value)}>
            <option value="">Selecione o imóvel</option>
            {PROPERTY_OPTIONS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          <Input
            label="Valor Anterior"
            value={valorAtual}
            readOnly
            placeholder="Selecione um imóvel acima"
          />
          <Input
            label="Novo Valor"
            required
            value={fNovoValor}
            onChange={e => setFNovoValor(e.target.value)}
            placeholder="R$ 0,00"
          />
          <Select label="Motivo" required value={fMotivo} onChange={e => setFMotivo(e.target.value)}>
            <option value="">Selecione o motivo</option>
            <option value="IPCA">IPCA</option>
            <option value="Mercado">Mercado</option>
            <option value="Correção">Correção</option>
            <option value="Avaliação">Avaliação</option>
          </Select>
          <Input label="Data" required type="date" value={fData} onChange={e => setFData(e.target.value)} />
          <Textarea label="Observações" value={fObs} onChange={e => setFObs(e.target.value)} placeholder="Justificativa ou notas adicionais..." rows={3} />
        </div>
      </Modal>
    </>
  )
}
