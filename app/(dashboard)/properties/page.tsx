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

type PropStatus = 'Disponível' | 'Reservado' | 'Em Negociação'
type PropType   = 'Apartamento' | 'Casa' | 'Sala Comercial' | 'Cobertura' | 'Terreno'

interface Property {
  id:         string
  endereco:   string
  tipo:       PropType
  valor:      string
  area:       string
  dormitorios: number
  vagas:      number
  status:     PropStatus
}

/* ─── Mock data ──────────────────────────────────────────── */

const MOCK_PROPERTIES: Property[] = [
  { id: 'P001', endereco: 'Av. Paulista, 2100 – Apto 84',            tipo: 'Apartamento',   valor: 'R$ 1.250.000', area: '98 m²',  dormitorios: 3, vagas: 2, status: 'Disponível'     },
  { id: 'P002', endereco: 'R. Oscar Freire, 412 – Cobertura Duplex', tipo: 'Cobertura',     valor: 'R$ 4.800.000', area: '280 m²', dormitorios: 4, vagas: 4, status: 'Em Negociação'   },
  { id: 'P003', endereco: 'Al. Santos, 700 – Sala 32',               tipo: 'Sala Comercial',valor: 'R$ 680.000',   area: '62 m²',  dormitorios: 0, vagas: 1, status: 'Disponível'     },
  { id: 'P004', endereco: 'R. Haddock Lobo, 55 – Apto 11',           tipo: 'Apartamento',   valor: 'R$ 950.000',   area: '78 m²',  dormitorios: 2, vagas: 1, status: 'Reservado'       },
  { id: 'P005', endereco: 'Av. Brigadeiro Faria Lima, 1204 – Apto 5', tipo: 'Apartamento',  valor: 'R$ 2.200.000', area: '145 m²', dormitorios: 3, vagas: 3, status: 'Disponível'     },
  { id: 'P006', endereco: 'R. José Maria Lisboa, 220',               tipo: 'Casa',          valor: 'R$ 3.100.000', area: '320 m²', dormitorios: 4, vagas: 4, status: 'Em Negociação'   },
  { id: 'P007', endereco: 'Al. Campinas, 1234 – Apto 31',            tipo: 'Apartamento',   valor: 'R$ 520.000',   area: '52 m²',  dormitorios: 1, vagas: 1, status: 'Disponível'     },
  { id: 'P008', endereco: 'R. Pamplona, 145 – Apto 62',              tipo: 'Apartamento',   valor: 'R$ 1.100.000', area: '88 m²',  dormitorios: 2, vagas: 2, status: 'Reservado'       },
  { id: 'P009', endereco: 'Av. Rebouças, 3970 – Terreno 01',         tipo: 'Terreno',       valor: 'R$ 5.500.000', area: '800 m²', dormitorios: 0, vagas: 0, status: 'Disponível'     },
]

/* ─── Helpers ────────────────────────────────────────────── */

function statusBadgeClass(status: PropStatus): string {
  switch (status) {
    case 'Disponível':    return cn(styles.badge, styles['badge--green'])
    case 'Reservado':     return cn(styles.badge, styles['badge--yellow'])
    case 'Em Negociação': return cn(styles.badge, styles['badge--blue'])
  }
}

function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
      <path d="M3 9h6" />
      <path d="M3 15h6" />
      <path d="M15 9h3" />
      <path d="M15 15h3" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function IconArrows() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

function BedIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
    </svg>
  )
}

function CarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
}

function AreaIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
    </svg>
  )
}

/* ─── Property Card ──────────────────────────────────────── */

function PropertyCard({ property }: { property: Property }) {
  return (
    <Card hoverable className={styles.prop}>
      <CardBody>
        <div className={styles.prop__header}>
          <span className={cn(styles.badge, styles['badge--type'])}>{property.tipo}</span>
          <span className={statusBadgeClass(property.status)}>{property.status}</span>
        </div>
        <h3 className={styles.prop__address}>{property.endereco}</h3>
        <p className={styles.prop__value}>{property.valor}</p>
        <div className={styles.prop__meta}>
          <span className={styles.prop__meta__item}>
            <AreaIcon />
            {property.area}
          </span>
          {property.dormitorios > 0 && (
            <span className={styles.prop__meta__item}>
              <BedIcon />
              {property.dormitorios} dorm.
            </span>
          )}
          {property.vagas > 0 && (
            <span className={styles.prop__meta__item}>
              <CarIcon />
              {property.vagas} {property.vagas === 1 ? 'vaga' : 'vagas'}
            </span>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

/* ─── Page ───────────────────────────────────────────────── */

export default function PropertiesPage() {
  const [search,        setSearch]        = useState('')
  const [tipoFilter,    setTipoFilter]    = useState('')
  const [statusFilter,  setStatusFilter]  = useState('')
  const [modalOpen,     setModalOpen]     = useState(false)

  /* form state */
  const [fEndereco,    setFEndereco]    = useState('')
  const [fTipo,        setFTipo]        = useState('')
  const [fValor,       setFValor]       = useState('')
  const [fArea,        setFArea]        = useState('')
  const [fDorm,        setFDorm]        = useState('')
  const [fVagas,       setFVagas]       = useState('')
  const [fDescricao,   setFDescricao]   = useState('')

  const filtered = MOCK_PROPERTIES.filter(p => {
    const matchSearch = p.endereco.toLowerCase().includes(search.toLowerCase())
    const matchTipo   = tipoFilter   === '' || p.tipo   === tipoFilter
    const matchStatus = statusFilter === '' || p.status === statusFilter
    return matchSearch && matchTipo && matchStatus
  })

  function handleClose() {
    setModalOpen(false)
    setFEndereco(''); setFTipo(''); setFValor(''); setFArea('')
    setFDorm(''); setFVagas(''); setFDescricao('')
  }

  return (
    <>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.page__header}>
          <h1 className={styles.page__title}>Minha Carteira</h1>
          <Button size="sm" onClick={() => setModalOpen(true)}>+ Adicionar Imóvel</Button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <StatCard label="Total de Imóveis" value={18}                                          icon={<IconBuilding />} />
          <StatCard label="Disponíveis"      value={12} trend={6.5} trendLabel="vs. mês anterior" icon={<IconCheck />} />
          <StatCard label="Reservados"       value={3}                                             icon={<IconClock />} />
          <StatCard label="Em Negociação"    value={3}                                             icon={<IconArrows />} />
        </div>

        {/* Filters */}
        <Card>
          <CardBody>
            <div className={styles.filters}>
              <Input
                placeholder="Buscar por endereço..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.filters__search}
              />
              <Select value={tipoFilter} onChange={e => setTipoFilter(e.target.value)} className={styles.filters__select}>
                <option value="">Todos os tipos</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Sala Comercial">Sala Comercial</option>
                <option value="Terreno">Terreno</option>
              </Select>
              <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={styles.filters__select}>
                <option value="">Todos os status</option>
                <option value="Disponível">Disponível</option>
                <option value="Reservado">Reservado</option>
                <option value="Em Negociação">Em Negociação</option>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <Card>
            <CardBody>
              <p className={styles.empty}>Nenhum imóvel encontrado com os filtros selecionados.</p>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Modal Adicionar Imóvel */}
      <Modal
        isOpen={modalOpen}
        onClose={handleClose}
        title="Adicionar Imóvel"
        maxWidth="38rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleClose}>Salvar Imóvel</Button>
          </div>
        }
      >
        <div className={styles.form}>
          <Input label="Endereço" required value={fEndereco} onChange={e => setFEndereco(e.target.value)} placeholder="Ex: Av. Paulista, 1000 – Apto 42" />
          <Select label="Tipo" required value={fTipo} onChange={e => setFTipo(e.target.value)}>
            <option value="">Selecione o tipo</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
            <option value="Cobertura">Cobertura</option>
            <option value="Sala Comercial">Sala Comercial</option>
            <option value="Terreno">Terreno</option>
          </Select>
          <Input label="Valor" required value={fValor} onChange={e => setFValor(e.target.value)} placeholder="R$ 0,00" />
          <div className={styles['form__row--3']}>
            <Input label="Área (m²)" required value={fArea}  onChange={e => setFArea(e.target.value)}  placeholder="0" type="number" />
            <Input label="Dormitórios"        value={fDorm}  onChange={e => setFDorm(e.target.value)}  placeholder="0" type="number" />
            <Input label="Vagas"              value={fVagas} onChange={e => setFVagas(e.target.value)} placeholder="0" type="number" />
          </div>
          <Textarea label="Descrição" value={fDescricao} onChange={e => setFDescricao(e.target.value)} placeholder="Descrição do imóvel, características, diferenciais..." rows={3} />
        </div>
      </Modal>
    </>
  )
}
