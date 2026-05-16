'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Input, { Select } from '@/components/ui/Input'
import styles from './page.module.css'

/* ─── Steps config ───────────────────────────────────────── */

const STEPS = [
  { num: 1, label: 'Configuração Inicial',     subtitle: 'Unidade, tipo de contrato e corretor' },
  { num: 2, label: 'Vendedores/Cedentes',       subtitle: 'Dados das partes vendedoras' },
  { num: 3, label: 'Compradores/Cessionários',  subtitle: 'Dados dos compradores ou cessionários' },
  { num: 4, label: 'Anuentes',                  subtitle: 'Cônjuges e demais anuentes' },
  { num: 5, label: 'Dados do Imóvel',           subtitle: 'Endereço, matrícula e características' },
  { num: 6, label: 'Preço e Pagamento',         subtitle: 'Valor, condições e forma de pagamento' },
  { num: 7, label: 'Corretagem',                subtitle: 'Intermediação e comissão' },
  { num: 8, label: 'Revisão e Geração',         subtitle: 'Revise todos os dados e gere o contrato' },
] as const

/* ─── Step 1 mock options ────────────────────────────────── */

const UNIDADES = ['RE/MAX Noble', 'RE/MAX Elite', 'RE/MAX Master', 'RE/MAX Premium']

const TIPOS_CONTRATO = [
  'Gestão (Exclusividade/Prioridade)',
  'Compra e Venda',
  'Cessão de Direitos',
  'Distrato',
  'Termo Aditivo',
  'Outro',
]

const NEGOCIACOES = [
  { value: '',             label: 'Nenhuma negociação vinculada' },
  { value: 'NE-2025-001', label: 'NE-2025-001 — Rafael Andrade — R$ 650.000' },
  { value: 'NE-2025-002', label: 'NE-2025-002 — Camila Ferreira — R$ 900.000' },
  { value: 'NE-2025-003', label: 'NE-2025-003 — Bruno Menezes — R$ 1.100.000' },
  { value: 'NE-2025-004', label: 'NE-2025-004 — Fernanda Lima — R$ 1.400.000' },
]

const CORRETORES = [
  'Gabriel Avila',
  'Lucas Martins',
  'Ana Paula',
  'Fernanda Costa',
  'Rodrigo Lima',
]

/* ─── Step 2 constants ───────────────────────────────────── */

const ESTADOS_CIVIS = [
  'Solteiro(a)',
  'Casado(a)',
  'Divorciado(a)',
  'Viúvo(a)',
  'União Estável',
]

const GENEROS = [
  'Masculino',
  'Feminino',
  'Outro',
  'Prefiro não informar',
]

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]

const AUTO_CERTIDOES = [
  { id: 'cndt',    nome: 'CNDT',          orgao: 'Justiça do Trabalho - TST' },
  { id: 'trf4',    nome: 'TRF4',          orgao: 'Justiça Federal - TRF 4ª Região' },
  { id: 'cnd',     nome: 'CND RFB/PGFN',  orgao: 'Receita Federal e Dívida Ativa' },
  { id: 'fazenda', nome: 'Fazenda Estadual', orgao: 'Secretaria da Fazenda' },
  { id: 'tj',      nome: 'TJ Cível',      orgao: 'Tribunal de Justiça - Distribuição Cível' },
  { id: 'protest', nome: 'Protesto',       orgao: 'Cartório de Protesto de Títulos' },
]

const MANUAL_CERTIDOES = [
  { id: 'issptu', nome: 'ISS/IPTU', orgao: 'Prefeitura Municipal' },
]

/* ─── Step 2 types ───────────────────────────────────────── */

interface CertidaoEstado {
  id:   string
  mode: 'pendente' | 'auto' | 'manual'
}

interface VendedorData {
  _id:                  string
  isPessoaJuridica:     boolean
  // Dados pessoais
  nome:                 string
  cpf:                  string
  rg:                   string
  orgaoExpedidor:       string
  email:                string
  telefone:             string
  profissao:            string
  nacionalidade:        string
  estadoCivil:          string
  // Certidões info
  dataNascimento:       string
  nomeMae:              string
  genero:               string
  // Endereço
  rua:                  string
  numero:               string
  complemento:          string
  bairro:               string
  cep:                  string
  cidade:               string
  estado:               string
  // Pagamento
  recebePagamento:      boolean
  banco:                string
  chavePix:             string
  agencia:              string
  conta:                string
  // UI state
  certAutoOpen:         boolean
  certManualOpen:       boolean
  certEstados:          CertidaoEstado[]
}

function createVendor(): VendedorData {
  return {
    _id:             crypto.randomUUID(),
    isPessoaJuridica: false,
    nome:            '', cpf:  '', rg:       '', orgaoExpedidor: 'SSP/RS',
    email:           '', telefone: '', profissao: '', nacionalidade: 'brasileiro(a)',
    estadoCivil:     '',
    dataNascimento:  '', nomeMae: '', genero: '',
    rua:             '', numero: '', complemento: '', bairro: '',
    cep:             '', cidade: '', estado: 'RS',
    recebePagamento: false,
    banco: '', chavePix: '', agencia: '', conta: '',
    certAutoOpen:    true,
    certManualOpen:  true,
    certEstados: [
      ...AUTO_CERTIDOES.map(c => ({ id: c.id, mode: 'pendente' as const })),
      ...MANUAL_CERTIDOES.map(c => ({ id: c.id, mode: 'pendente' as const })),
    ],
  }
}

/* ─── Step 3 types ───────────────────────────────────────── */

interface CompradorData {
  _id:              string
  isPessoaJuridica: boolean
  nome:             string
  cpf:              string
  rg:               string
  orgaoExpedidor:   string
  email:            string
  telefone:         string
  profissao:        string
  nacionalidade:    string
  estadoCivil:      string
  dataNascimento:   string
  nomeMae:          string
  genero:           string
  rua:              string
  numero:           string
  complemento:      string
  bairro:           string
  cep:              string
  cidade:           string
  estado:           string
  certAutoOpen:     boolean
  certManualOpen:   boolean
  certEstados:      CertidaoEstado[]
}

function createComprador(): CompradorData {
  return {
    _id:              crypto.randomUUID(),
    isPessoaJuridica: false,
    nome:            '', cpf:  '', rg:       '', orgaoExpedidor: 'SSP/RS',
    email:           '', telefone: '', profissao: '', nacionalidade: 'brasileiro(a)',
    estadoCivil:     '',
    dataNascimento:  '', nomeMae: '', genero: '',
    rua:             '', numero: '', complemento: '', bairro: '',
    cep:             '', cidade: '', estado: 'RS',
    certAutoOpen:    true,
    certManualOpen:  true,
    certEstados: [
      ...AUTO_CERTIDOES.map(c => ({ id: c.id, mode: 'pendente' as const })),
      ...MANUAL_CERTIDOES.map(c => ({ id: c.id, mode: 'pendente' as const })),
    ],
  }
}

/* ─── Step 4 types ───────────────────────────────────────── */

interface AnuenteData {
  _id:              string
  isPessoaJuridica: boolean
  nome:             string
  nacionalidade:    string
  estadoCivil:      string
  profissao:        string
  cpf:              string
  rg:               string
  orgaoExpedidor:   string
  rua:              string
  numero:           string
  complemento:      string
  bairro:           string
  cidade:           string
  estado:           string
}

function createAnuente(): AnuenteData {
  return {
    _id:              crypto.randomUUID(),
    isPessoaJuridica: false,
    nome:             '',
    nacionalidade:    'brasileiro(a)',
    estadoCivil:      '',
    profissao:        '',
    cpf:              '',
    rg:               '',
    orgaoExpedidor:   'SSP/RS',
    rua:              '',
    numero:           '',
    complemento:      '',
    bairro:           '',
    cidade:           '',
    estado:           '',
  }
}

/* ─── Step 5 constants ───────────────────────────────────── */

const MOCK_IMOVEIS_PORTFOLIO = [
  { value: 'IM-001', label: 'IM-001 — Rua das Palmeiras, 123 — Centro, Florianópolis' },
  { value: 'IM-002', label: 'IM-002 — Av. Beira-Mar, 500 — Agronômica, Florianópolis' },
  { value: 'IM-003', label: 'IM-003 — Rua XV de Novembro, 89 — Centro, Porto Alegre' },
  { value: 'IM-004', label: 'IM-004 — Rua Borges de Medeiros, 1200 — Moinhos, Porto Alegre' },
]

const CERT_IMOVEL = [
  { id: 'onus',       nome: 'Ônus e Ações',   orgao: 'Registro de Imóveis Online' },
  { id: 'matricula',  nome: 'Matrícula',       orgao: 'Registro de Imóveis (máx 30 dias)' },
  { id: 'iptu',       nome: 'IPTU',            orgao: 'Prefeitura Municipal' },
  { id: 'condominio', nome: 'Condomínio',       orgao: 'Administradora do Condomínio' },
]

/* ─── Step 5 types ───────────────────────────────────────── */

interface BoxData {
  _id:       string
  matricula: string
  descricao: string
}

interface ImovelData {
  imovelVinculado:  string
  rua:              string
  numero:           string
  complemento:      string
  bairro:           string
  cep:              string
  cidade:           string
  estado:           string
  matriculaNum:     string
  cartorio:         string
  protocolo:        string
  areaTotal:        string
  areaPrivativa:    string
  ocupadoTerceiros: boolean
  saldoDevedor:     boolean
  bensMoveisTexto:  string
  boxes:            BoxData[]
  confirmado:       boolean
}

function createImovel(): ImovelData {
  return {
    imovelVinculado:  '',
    rua:              '',
    numero:           '',
    complemento:      '',
    bairro:           '',
    cep:              '',
    cidade:           '',
    estado:           '',
    matriculaNum:     '',
    cartorio:         '',
    protocolo:        '',
    areaTotal:        '0.00',
    areaPrivativa:    '0.00',
    ocupadoTerceiros: false,
    saldoDevedor:     false,
    bensMoveisTexto:  '',
    boxes:            [],
    confirmado:       false,
  }
}

/* ─── Step 6 constants ───────────────────────────────────── */

const TIPOS_PAGAMENTO = [
  'À Vista',
  'Sinal / Arras',
  'Entrada',
  'Financiamento Bancário',
  'FGTS',
  'Parcelamento Direto',
  'Quitação de Saldo Devedor',
  'Dação em Pagamento',
  'Permuta',
  'Plano Safra (Colheita)',
  'Outro',
]

const DATAS_PAGAMENTO = [
  'No ato da assinatura deste contrato',
  'Em até 24 (vinte e quatro) horas úteis após a assinatura deste contrato',
  'Em até 5 (cinco) dias úteis após a assinatura deste contrato',
  'No ato da Escritura Pública no Tabelionato de Notas',
  'Outro (especificar)',
]

const MOMENTOS_ENTREGA = [
  'Na assinatura do presente contrato',
  'No ato da assinatura da Escritura Pública no Tabelionato',
  'Na liberação dos recursos do financiamento',
  'Na quitação integral do preço',
  'Na liberação do laudo de engenharia',
  'Em data específica (indicar abaixo)',
  'Após desocupação do imóvel por terceiros',
  'Outro (especificar)',
]

/* ─── Step 6 types ───────────────────────────────────────── */

interface PagamentoData {
  _id:         string
  tipo:        string
  valor:       string
  dataPag:     string
  viaDeposito: boolean
  descricao:   string
}

interface PrecoPagamentoData {
  valorTotal:    string
  pagamentos:    PagamentoData[]
  entregaChaves: string
}

function createPagamento(): PagamentoData {
  return {
    _id:         crypto.randomUUID(),
    tipo:        '',
    valor:       '0.00',
    dataPag:     '',
    viaDeposito: true,
    descricao:   '',
  }
}

function createPrecoPagamento(): PrecoPagamentoData {
  return {
    valorTotal:    '0.00',
    pagamentos:    [],
    entregaChaves: 'Na assinatura do presente contrato',
  }
}

/* ─── Step 7 constants ───────────────────────────────────── */

const PCT_OPCOES = ['2', '3', '4', '5', '6', '8', '10', '12', '15', '20', 'Outro']

const TIPOS_VENDA = [
  'Venda Direta (sem parceria)',
  'Parceria Interna (entre corretores RE/MAX)',
  'Parceria Externa (com outra imobiliária)',
  'Parceria Mista (RE/MAX + imobiliária externa)',
]

const MOMENTOS_COM = [
  'No ato da assinatura do presente contrato',
  'No ato da assinatura da Escritura Pública no Tabelionato',
  'Na quitação integral do preço',
  'Proporcional aos recebimentos do negócio',
  'Na liberação dos recursos do financiamento',
  'Na liberação do laudo de engenharia',
  'Outro (especificar)',
]

const REMAX_PCT  = 55
const COR_PCT    = 45

/* ─── Step 7 types ───────────────────────────────────────── */

interface MomentoComData {
  _id:    string
  quando: string
  valor:  string
}

interface CorretagemData {
  percentualComissao: string
  modoManual:         boolean
  valorManual:        string
  tipoVenda:          string
  momentos:           MomentoComData[]
  incluirQuitacao:    boolean
  nomeCorretor:       string
  creci:              string
  banco:              string
  chavePix:           string
  agencia:            string
  conta:              string
}

function createMomentoComissao(): MomentoComData {
  return {
    _id:    crypto.randomUUID(),
    quando: 'No ato da assinatura do presente contrato',
    valor:  '0.00',
  }
}

function createCorretagem(): CorretagemData {
  return {
    percentualComissao: '6',
    modoManual:         false,
    valorManual:        '0.00',
    tipoVenda:          'Venda Direta (sem parceria)',
    momentos:           [createMomentoComissao()],
    incluirQuitacao:    false,
    nomeCorretor:       'Gabriel Avila',
    creci:              '',
    banco:              '',
    chavePix:           '',
    agencia:            '',
    conta:              '',
  }
}

/* ─── Format helpers ─────────────────────────────────────── */

function fmtBRL(raw: string): string {
  const n = parseFloat(raw) || 0
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtPct(raw: string): string {
  const n = parseFloat(raw) || 0
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%'
}

/* ─── Icons (shared) ─────────────────────────────────────── */

function IconCheck() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M9.5 2.5L4.5 8.5L1.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconWrench() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M20 4a8 8 0 1 0 0 16A8 8 0 0 0 20 4zm0 0l-4 4m4-4 4 4M4 28l8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─── Icons (step 2) ─────────────────────────────────────── */

function IconWarning() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5L14.5 13.5H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
      <path d="M8 6V9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      <circle cx="8" cy="11.5" r="0.625" fill="currentColor"/>
    </svg>
  )
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
      <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconDoc() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M8 1H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5L8 1Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
      <path d="M8 1v4h4M5 8h4M5 10.5h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconPerson({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M2.5 13.5c0-2.76 2.462-5 5.5-5s5.5 2.24 5.5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
}

function IconGarage() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4.5L8 1.5L12 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="1.5" y="4.5" width="13" height="10" rx="1" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M4 8h8M4 10.5h8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  )
}

function IconUpload() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 9V2M4.5 4.5L7 2l2.5 2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 10.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
}

function IconExternalLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M6 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M9 1h4m0 0v4M13 1 7 7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="1.5" y="5.5" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.1"/>
      <path d="M3.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  )
}

function IconCalc() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
      <path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  )
}

function IconDollarSign({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 7v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12.5 22c0 2.21 1.57 4 3.5 4s3.5-1.79 3.5-4-1.57-3.5-3.5-3.5-3.5-1.79-3.5-4 1.57-4 3.5-4 3.5 1.79 3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconCheckCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M4.5 7L6.5 9L9.5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconSave() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2.5A.5.5 0 0 1 2.5 2H9.5L12 4.5V11.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V2.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
      <path d="M5 2v2.5h4V2M4.5 12V8.5h5V12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconSend() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M12.5 1.5L5.5 8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.5 1.5L8.5 12.5L5.5 8.5L1.5 5.5L12.5 1.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
    </svg>
  )
}

function IconGavel() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 12.5L8.5 7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      <rect x="7.5" y="1.5" width="5" height="2.5" rx="0.5" transform="rotate(45 7.5 1.5)" stroke="currentColor" strokeWidth="1.1"/>
      <path d="M1.5 14h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
}

function IconFolder() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1.5 5a1 1 0 0 1 1-1h4.086l1.414 1.5H13.5a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
    </svg>
  )
}

function IconClockLg() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 10v6l4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconClockSm() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M8 5.5V8l2 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─── Progress bar ───────────────────────────────────────── */

function ProgressBar({ current }: { current: number }) {
  return (
    <div className={styles.progress} role="list" aria-label="Etapas do formulário">
      {STEPS.map((step, i) => {
        const isDone    = current > step.num
        const isCurrent = current === step.num
        const isFuture  = current < step.num
        return (
          <React.Fragment key={step.num}>
            <div className={styles.progress__step} role="listitem">
              <div className={cn(
                styles.progress__circle,
                isDone    && styles['progress__circle--done'],
                isCurrent && styles['progress__circle--current'],
                isFuture  && styles['progress__circle--future'],
              )}>
                {isDone ? <IconCheck /> : step.num}
              </div>
              <span className={cn(
                styles.progress__label,
                isCurrent && styles['progress__label--current'],
                isDone    && styles['progress__label--done'],
              )}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                styles.progress__connector,
                isDone && styles['progress__connector--done'],
              )} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

/* ─── Step 1 ─────────────────────────────────────────────── */

interface Step1Data {
  unidade:      string
  tipoContrato: string
  negociacao:   string
  corretor:     string
}

function Step1({ data, onChange }: {
  data:     Step1Data
  onChange: (patch: Partial<Step1Data>) => void
}) {
  return (
    <div className={styles.form}>
      <div className={styles.form__row}>
        <Select
          label="Unidade RE/MAX"
          required
          value={data.unidade}
          onChange={e => onChange({ unidade: e.target.value })}
        >
          <option value="">Selecionar unidade...</option>
          {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
        </Select>

        <Select
          label="Tipo de Contrato"
          required
          value={data.tipoContrato}
          onChange={e => onChange({ tipoContrato: e.target.value })}
        >
          <option value="">Selecionar tipo...</option>
          {TIPOS_CONTRATO.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
      </div>

      <Select
        label="Vincular Negociação (opcional)"
        value={data.negociacao}
        onChange={e => onChange({ negociacao: e.target.value })}
        hint="Vincular uma negociação permite pré-preencher dados do cliente e imóvel."
      >
        {NEGOCIACOES.map(n => (
          <option key={n.value} value={n.value}>{n.label}</option>
        ))}
      </Select>

      <Select
        label="Corretor Responsável"
        required
        value={data.corretor}
        onChange={e => onChange({ corretor: e.target.value })}
        hint="Por padrão, você é o corretor responsável. Pode alterar se necessário."
      >
        {CORRETORES.map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
    </div>
  )
}

/* ─── Step 2 — VendorBlock ───────────────────────────────── */

function VendorBlock({
  vendor,
  index,
  canRemove,
  onChange,
  onRemove,
}: {
  vendor:   VendedorData
  index:    number
  canRemove: boolean
  onChange: (patch: Partial<VendedorData>) => void
  onRemove: () => void
}) {
  const pj = vendor.isPessoaJuridica

  function setCertMode(id: string, mode: CertidaoEstado['mode']) {
    onChange({
      certEstados: vendor.certEstados.map(c =>
        c.id === id ? { ...c, mode: c.mode === mode ? 'pendente' : mode } : c
      ),
    })
  }

  function getCertMode(id: string): CertidaoEstado['mode'] {
    return vendor.certEstados.find(c => c.id === id)?.mode ?? 'pendente'
  }

  return (
    <div className={styles.vendor}>

      {/* ── Block header ── */}
      <div className={styles.vendor__head}>
        <h3 className={styles.vendor__title}>
          Vendedor {index + 1}
        </h3>
        <div className={styles.vendor__head__right}>
          <label className={styles.pjtoggle}>
            <input
              type="checkbox"
              className={styles.pjtoggle__input}
              checked={pj}
              onChange={e => onChange({ isPessoaJuridica: e.target.checked })}
            />
            <span className={styles.pjtoggle__track} />
            <span className={styles.pjtoggle__text}>Pessoa Jurídica</span>
          </label>
          {canRemove && (
            <button type="button" className={styles.vendor__remove} onClick={onRemove} aria-label="Remover vendedor">
              <IconClose />
            </button>
          )}
        </div>
      </div>

      {/* ── Auto-fill section ── */}
      <div className={styles.vsect}>
        <p className={styles.vsect__label}>Preencher automaticamente via documento</p>
        <div className={styles.autofill}>
          <button type="button" className={styles.autofill__btn}>
            <IconDoc />
            CNH — Extrair dados automaticamente
          </button>
          <button type="button" className={styles.autofill__btn}>
            <IconDoc />
            RG — Extrair dados automaticamente
          </button>
        </div>
      </div>

      {/* ── Dados pessoais ── */}
      <div className={styles.vsect}>
        <p className={styles.vsect__label}>Dados pessoais</p>
        <div className={styles.form}>
          <Input
            label={pj ? 'Razão Social' : 'Nome Completo'}
            required
            value={vendor.nome}
            onChange={e => onChange({ nome: e.target.value })}
            placeholder={pj ? 'Razão social da empresa' : 'Nome completo do vendedor'}
          />
          <div className={styles.form__row__3}>
            <Input
              label={pj ? 'CNPJ' : 'CPF'}
              required
              value={vendor.cpf}
              onChange={e => onChange({ cpf: e.target.value })}
              placeholder={pj ? '00.000.000/0000-00' : '000.000.000-00'}
            />
            <Input
              label={pj ? 'Inscrição Estadual' : 'RG'}
              required
              value={vendor.rg}
              onChange={e => onChange({ rg: e.target.value })}
            />
            {!pj && (
              <Input
                label="Órgão Expedidor"
                value={vendor.orgaoExpedidor}
                onChange={e => onChange({ orgaoExpedidor: e.target.value })}
                placeholder="SSP/RS"
              />
            )}
          </div>
          <div className={styles.form__row}>
            <Input
              label="E-mail"
              required
              type="email"
              value={vendor.email}
              onChange={e => onChange({ email: e.target.value })}
              placeholder="email@exemplo.com"
            />
            <Input
              label="Telefone"
              type="tel"
              value={vendor.telefone}
              onChange={e => onChange({ telefone: e.target.value })}
              placeholder="(51) 99999-9999"
            />
          </div>
          {!pj && (
            <div className={styles.form__row__3}>
              <Input
                label="Profissão"
                required
                value={vendor.profissao}
                onChange={e => onChange({ profissao: e.target.value })}
              />
              <Input
                label="Nacionalidade"
                required
                value={vendor.nacionalidade}
                onChange={e => onChange({ nacionalidade: e.target.value })}
                placeholder="brasileiro(a)"
              />
              <Select
                label="Estado Civil"
                required
                value={vendor.estadoCivil}
                onChange={e => onChange({ estadoCivil: e.target.value })}
              >
                <option value="">Selecionar...</option>
                {ESTADOS_CIVIS.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* ── Certidões info (personal only) ── */}
      {!pj && (
        <div className={styles.vsect}>
          <div className={styles.vsect__label__row}>
            <p className={cn(styles.vsect__label, styles['vsect__label--blue'])}>
              Dados para Emissão de Certidões
            </p>
            <span className={styles.vsect__note}>(não vai para a minuta)</span>
          </div>
          <div className={styles.form__row__3}>
            <Input
              label="Data de Nascimento"
              type="date"
              value={vendor.dataNascimento}
              onChange={e => onChange({ dataNascimento: e.target.value })}
            />
            <Input
              label="Nome da Mãe"
              required
              value={vendor.nomeMae}
              onChange={e => onChange({ nomeMae: e.target.value })}
            />
            <Select
              label="Gênero (opcional)"
              value={vendor.genero}
              onChange={e => onChange({ genero: e.target.value })}
            >
              <option value="">Selecionar...</option>
              {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
        </div>
      )}

      {/* ── Endereço ── */}
      <div className={styles.vsect}>
        <p className={styles.vsect__label}>Endereço</p>
        <div className={styles.form}>
          <Input
            label="Rua"
            required
            value={vendor.rua}
            onChange={e => onChange({ rua: e.target.value })}
            placeholder="Nome da rua, avenida ou logradouro"
          />
          <div className={styles.form__row}>
            <Input
              label="Número"
              required
              value={vendor.numero}
              onChange={e => onChange({ numero: e.target.value })}
            />
            <Input
              label="Complemento"
              value={vendor.complemento}
              onChange={e => onChange({ complemento: e.target.value })}
              placeholder="Apto, Sala, Bloco ou N/A"
            />
          </div>
          <Input
            label="Bairro"
            required
            value={vendor.bairro}
            onChange={e => onChange({ bairro: e.target.value })}
          />
          <div className={styles.form__row__3}>
            <Input
              label="CEP"
              value={vendor.cep}
              onChange={e => onChange({ cep: e.target.value })}
              placeholder="00000-000"
            />
            <Input
              label="Cidade"
              required
              value={vendor.cidade}
              onChange={e => onChange({ cidade: e.target.value })}
            />
            <Select
              label="Estado"
              required
              value={vendor.estado}
              onChange={e => onChange({ estado: e.target.value })}
            >
              {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </Select>
          </div>
        </div>
      </div>

      {/* ── Pagamento ── */}
      <div className={styles.vsect}>
        <div className={styles.payment}>
          <div className={styles.payment__head}>
            <span className={styles.payment__icon}><IconWarning /></span>
            <label className={styles.payment__check}>
              <input
                type="checkbox"
                checked={vendor.recebePagamento}
                onChange={e => onChange({ recebePagamento: e.target.checked })}
              />
              <span className={styles.payment__check__label}>
                Este vendedor receberá pagamento diretamente
              </span>
            </label>
          </div>
          {vendor.recebePagamento && (
            <div className={styles.payment__bank}>
              <p className={styles.payment__bank__title}>Dados Bancários (obrigatórios)</p>
              <div className={styles.form}>
                <Input
                  label="Banco"
                  required
                  value={vendor.banco}
                  onChange={e => onChange({ banco: e.target.value })}
                  placeholder="Ex: 001 — Banco do Brasil"
                />
                <Input
                  label="Chave PIX"
                  required
                  value={vendor.chavePix}
                  onChange={e => onChange({ chavePix: e.target.value })}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                />
                <div className={styles.form__row}>
                  <Input
                    label="Agência"
                    required
                    value={vendor.agencia}
                    onChange={e => onChange({ agencia: e.target.value })}
                    placeholder="0000"
                  />
                  <Input
                    label="Conta"
                    required
                    value={vendor.conta}
                    onChange={e => onChange({ conta: e.target.value })}
                    placeholder="00000-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Certidões ── */}
      <div className={styles.vsect}>
        <p className={styles.vsect__label}>Certidões de Vendedor</p>
        <p className={styles.vsect__hint}>Preencha o CPF para consultar certidões.</p>

        <div className={styles.certs}>
          {/* Auto */}
          <div className={styles.certs__group}>
            <button
              type="button"
              className={styles.certs__group__head}
              onClick={() => onChange({ certAutoOpen: !vendor.certAutoOpen })}
            >
              <span className={styles.certs__group__label}>Consulta Automática</span>
              <span className={cn(styles.certs__badge, styles['certs__badge--blue'])}>
                {AUTO_CERTIDOES.length} certidões
              </span>
              <span className={styles.certs__group__spacer} />
              <IconChevron open={vendor.certAutoOpen} />
            </button>
            <p className={styles.certs__group__note}>
              Estas certidões podem ser obtidas automaticamente via API.
            </p>
            {vendor.certAutoOpen && (
              <ul className={styles.certs__list}>
                {AUTO_CERTIDOES.map(cert => {
                  const mode = getCertMode(cert.id)
                  return (
                    <li key={cert.id} className={styles.cert__row}>
                      <div className={styles.cert__info}>
                        <span className={styles.cert__name}>{cert.nome}</span>
                        <span className={styles.cert__org}>{cert.orgao}</span>
                      </div>
                      <div className={styles.cert__actions}>
                        <button
                          type="button"
                          className={cn(styles.cert__btn, mode === 'auto' ? styles['cert__btn--auto--active'] : styles['cert__btn--auto'])}
                          onClick={() => setCertMode(cert.id, 'auto')}
                        >
                          Auto
                        </button>
                        <button
                          type="button"
                          className={cn(styles.cert__btn, mode === 'manual' ? styles['cert__btn--manual--active'] : styles['cert__btn--manual'])}
                          onClick={() => setCertMode(cert.id, 'manual')}
                        >
                          Manual
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Manual */}
          <div className={styles.certs__group}>
            <button
              type="button"
              className={styles.certs__group__head}
              onClick={() => onChange({ certManualOpen: !vendor.certManualOpen })}
            >
              <span className={styles.certs__group__label}>Certidões Manuais</span>
              <span className={cn(styles.certs__badge, styles['certs__badge--gray'])}>
                {MANUAL_CERTIDOES.length} certidão
              </span>
              <span className={styles.certs__group__spacer} />
              <IconChevron open={vendor.certManualOpen} />
            </button>
            <p className={styles.certs__group__note}>
              Estas certidões precisam ser obtidas nos sites oficiais.
            </p>
            {vendor.certManualOpen && (
              <ul className={styles.certs__list}>
                {MANUAL_CERTIDOES.map(cert => (
                  <li key={cert.id} className={styles.cert__row}>
                    <div className={styles.cert__info}>
                      <span className={styles.cert__name}>{cert.nome}</span>
                      <span className={styles.cert__org}>{cert.orgao}</span>
                    </div>
                    <div className={styles.cert__actions}>
                      <button type="button" className={cn(styles.cert__btn, styles['cert__btn--anexar'])}>
                        Anexar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className={styles.certs__footer}>
            Tenha o CPF em mãos. Validade média: 30 a 180 dias dependendo do tipo.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 2 ─────────────────────────────────────────────── */

function Step2({
  vendors,
  onAdd,
  onChange,
  onRemove,
}: {
  vendors:  VendedorData[]
  onAdd:    () => void
  onChange: (id: string, patch: Partial<VendedorData>) => void
  onRemove: (id: string) => void
}) {
  return (
    <div className={styles.s2}>
      <div className={styles.s2__top}>
        <p className={styles.s2__instruction}>
          Adicione os dados de todos os vendedores/cedentes do contrato.
        </p>
        <Button size="sm" onClick={onAdd}>+ Adicionar Vendedor</Button>
      </div>
      {vendors.map((v, i) => (
        <VendorBlock
          key={v._id}
          vendor={v}
          index={i}
          canRemove={vendors.length > 1}
          onChange={patch => onChange(v._id, patch)}
          onRemove={() => onRemove(v._id)}
        />
      ))}
    </div>
  )
}

/* ─── Step 3 — CompradorBlock ────────────────────────────── */

function CompradorBlock({
  comprador,
  index,
  canRemove,
  onChange,
  onRemove,
}: {
  comprador: CompradorData
  index:     number
  canRemove: boolean
  onChange:  (patch: Partial<CompradorData>) => void
  onRemove:  () => void
}) {
  const pj = comprador.isPessoaJuridica

  function setCertMode(id: string, mode: CertidaoEstado['mode']) {
    onChange({
      certEstados: comprador.certEstados.map(c =>
        c.id === id ? { ...c, mode: c.mode === mode ? 'pendente' : mode } : c
      ),
    })
  }

  function getCertMode(id: string): CertidaoEstado['mode'] {
    return comprador.certEstados.find(c => c.id === id)?.mode ?? 'pendente'
  }

  return (
    <div className={styles.vendor}>

      {/* ── Block header ── */}
      <div className={styles.vendor__head}>
        <h3 className={styles.vendor__title}>Comprador {index + 1}</h3>
        <div className={styles.vendor__head__right}>
          <label className={styles.pjtoggle}>
            <input
              type="checkbox"
              className={styles.pjtoggle__input}
              checked={pj}
              onChange={e => onChange({ isPessoaJuridica: e.target.checked })}
            />
            <span className={styles.pjtoggle__track} />
            <span className={styles.pjtoggle__text}>Pessoa Jurídica</span>
          </label>
          {canRemove && (
            <button type="button" className={styles.vendor__remove} onClick={onRemove} aria-label="Remover comprador">
              <IconClose />
            </button>
          )}
        </div>
      </div>

      {/* ── Auto-fill ── */}
      <div className={styles.vsect}>
        <p className={styles.vsect__label}>Preencher automaticamente via documento</p>
        <div className={styles.autofill}>
          <button type="button" className={styles.autofill__btn}><IconDoc />CNH — Extrair dados automaticamente</button>
          <button type="button" className={styles.autofill__btn}><IconDoc />RG — Extrair dados automaticamente</button>
        </div>
      </div>

      {/* ── Dados pessoais ── */}
      <div className={styles.vsect}>
        <p className={styles.vsect__label}>Dados pessoais</p>
        <div className={styles.form}>
          <Input
            label={pj ? 'Razão Social' : 'Nome Completo'}
            required
            value={comprador.nome}
            onChange={e => onChange({ nome: e.target.value })}
            placeholder={pj ? 'Razão social da empresa' : 'Nome completo do comprador'}
          />
          <div className={styles.form__row__3}>
            <Input
              label={pj ? 'CNPJ' : 'CPF'}
              required
              value={comprador.cpf}
              onChange={e => onChange({ cpf: e.target.value })}
              placeholder={pj ? '00.000.000/0000-00' : '000.000.000-00'}
            />
            <Input
              label={pj ? 'Inscrição Estadual' : 'RG'}
              required
              value={comprador.rg}
              onChange={e => onChange({ rg: e.target.value })}
            />
            {!pj && (
              <Input
                label="Órgão Expedidor"
                value={comprador.orgaoExpedidor}
                onChange={e => onChange({ orgaoExpedidor: e.target.value })}
                placeholder="SSP/RS"
              />
            )}
          </div>
          <div className={styles.form__row}>
            <Input
              label="E-mail"
              required
              type="email"
              value={comprador.email}
              onChange={e => onChange({ email: e.target.value })}
              placeholder="email@exemplo.com"
            />
            <Input
              label="Telefone"
              type="tel"
              value={comprador.telefone}
              onChange={e => onChange({ telefone: e.target.value })}
              placeholder="(51) 99999-9999"
            />
          </div>
          {!pj && (
            <div className={styles.form__row__3}>
              <Input
                label="Profissão"
                required
                value={comprador.profissao}
                onChange={e => onChange({ profissao: e.target.value })}
              />
              <Input
                label="Nacionalidade"
                required
                value={comprador.nacionalidade}
                onChange={e => onChange({ nacionalidade: e.target.value })}
                placeholder="brasileiro(a)"
              />
              <Select
                label="Estado Civil"
                required
                value={comprador.estadoCivil}
                onChange={e => onChange({ estadoCivil: e.target.value })}
              >
                <option value="">Selecionar...</option>
                {ESTADOS_CIVIS.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* ── Certidões info (PF only) ── */}
      {!pj && (
        <div className={styles.vsect}>
          <div className={styles.vsect__label__row}>
            <p className={cn(styles.vsect__label, styles['vsect__label--blue'])}>
              Dados para Emissão de Certidões
            </p>
            <span className={styles.vsect__note}>(não vai para a minuta)</span>
          </div>
          <div className={styles.form__row__3}>
            <Input
              label="Data de Nascimento"
              type="date"
              required
              value={comprador.dataNascimento}
              onChange={e => onChange({ dataNascimento: e.target.value })}
            />
            <Input
              label="Nome da Mãe"
              required
              value={comprador.nomeMae}
              onChange={e => onChange({ nomeMae: e.target.value })}
            />
            <Select
              label="Gênero (opcional)"
              value={comprador.genero}
              onChange={e => onChange({ genero: e.target.value })}
            >
              <option value="">Selecionar...</option>
              {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
        </div>
      )}

      {/* ── Endereço ── */}
      <div className={styles.vsect}>
        <p className={styles.vsect__label}>Endereço</p>
        <div className={styles.form}>
          <Input
            label="Rua"
            required
            value={comprador.rua}
            onChange={e => onChange({ rua: e.target.value })}
            placeholder="Nome da rua, avenida ou logradouro"
          />
          <div className={styles.form__row}>
            <Input label="Número" required value={comprador.numero} onChange={e => onChange({ numero: e.target.value })} />
            <Input label="Complemento" value={comprador.complemento} onChange={e => onChange({ complemento: e.target.value })} placeholder="Apto, Sala, Bloco ou N/A" />
          </div>
          <Input label="Bairro" required value={comprador.bairro} onChange={e => onChange({ bairro: e.target.value })} />
          <div className={styles.form__row__3}>
            <Input label="CEP" value={comprador.cep} onChange={e => onChange({ cep: e.target.value })} placeholder="00000-000" />
            <Input label="Cidade" required value={comprador.cidade} onChange={e => onChange({ cidade: e.target.value })} />
            <Select label="Estado" required value={comprador.estado} onChange={e => onChange({ estado: e.target.value })}>
              {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </Select>
          </div>
        </div>
      </div>

      {/* ── Certidões ── */}
      <div className={styles.vsect}>
        <p className={styles.vsect__label}>Certidões de Comprador</p>
        <p className={styles.vsect__hint}>Preencha o CPF para consultar certidões.</p>
        <div className={styles.certs}>
          <div className={styles.certs__group}>
            <button type="button" className={styles.certs__group__head} onClick={() => onChange({ certAutoOpen: !comprador.certAutoOpen })}>
              <span className={styles.certs__group__label}>Consulta Automática</span>
              <span className={cn(styles.certs__badge, styles['certs__badge--blue'])}>{AUTO_CERTIDOES.length} certidões</span>
              <span className={styles.certs__group__spacer} />
              <IconChevron open={comprador.certAutoOpen} />
            </button>
            <p className={styles.certs__group__note}>Estas certidões podem ser obtidas automaticamente via API.</p>
            {comprador.certAutoOpen && (
              <ul className={styles.certs__list}>
                {AUTO_CERTIDOES.map(cert => {
                  const mode = getCertMode(cert.id)
                  return (
                    <li key={cert.id} className={styles.cert__row}>
                      <div className={styles.cert__info}>
                        <span className={styles.cert__name}>{cert.nome}</span>
                        <span className={styles.cert__org}>{cert.orgao}</span>
                      </div>
                      <div className={styles.cert__actions}>
                        <button
                          type="button"
                          className={cn(styles.cert__btn, mode === 'auto' ? styles['cert__btn--auto-c--active'] : styles['cert__btn--auto-c'])}
                          onClick={() => setCertMode(cert.id, 'auto')}
                        >
                          Auto
                        </button>
                        <button
                          type="button"
                          className={cn(styles.cert__btn, mode === 'manual' ? styles['cert__btn--manual-c--active'] : styles['cert__btn--manual-c'])}
                          onClick={() => setCertMode(cert.id, 'manual')}
                        >
                          Manual
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <div className={styles.certs__group}>
            <button type="button" className={styles.certs__group__head} onClick={() => onChange({ certManualOpen: !comprador.certManualOpen })}>
              <span className={styles.certs__group__label}>Certidões Manuais</span>
              <span className={cn(styles.certs__badge, styles['certs__badge--gray'])}>{MANUAL_CERTIDOES.length} certidão</span>
              <span className={styles.certs__group__spacer} />
              <IconChevron open={comprador.certManualOpen} />
            </button>
            <p className={styles.certs__group__note}>Estas certidões precisam ser obtidas nos sites oficiais.</p>
            {comprador.certManualOpen && (
              <ul className={styles.certs__list}>
                {MANUAL_CERTIDOES.map(cert => (
                  <li key={cert.id} className={styles.cert__row}>
                    <div className={styles.cert__info}>
                      <span className={styles.cert__name}>{cert.nome}</span>
                      <span className={styles.cert__org}>{cert.orgao}</span>
                    </div>
                    <div className={styles.cert__actions}>
                      <button type="button" className={cn(styles.cert__btn, styles['cert__btn--anexar'])}>Anexar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className={styles.certs__footer}>Tenha o CPF em mãos. Validade média: 30 a 180 dias dependendo do tipo.</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 3 ─────────────────────────────────────────────── */

function Step3({
  compradores,
  onAdd,
  onChange,
  onRemove,
}: {
  compradores: CompradorData[]
  onAdd:       () => void
  onChange:    (id: string, patch: Partial<CompradorData>) => void
  onRemove:    (id: string) => void
}) {
  return (
    <div className={styles.s2}>
      <div className={styles.s2__top}>
        <p className={styles.s2__instruction}>
          Adicione os dados de todos os compradores/cessionários do contrato.
        </p>
        <Button size="sm" onClick={onAdd}>+ Adicionar Comprador</Button>
      </div>
      {compradores.map((c, i) => (
        <CompradorBlock
          key={c._id}
          comprador={c}
          index={i}
          canRemove={compradores.length > 1}
          onChange={patch => onChange(c._id, patch)}
          onRemove={() => onRemove(c._id)}
        />
      ))}
    </div>
  )
}

/* ─── Step 4 — AnuenteBlock ──────────────────────────────── */

function AnuenteBlock({
  anuente,
  index,
  onChange,
  onRemove,
}: {
  anuente:  AnuenteData
  index:    number
  onChange: (patch: Partial<AnuenteData>) => void
  onRemove: () => void
}) {
  const pj = anuente.isPessoaJuridica

  return (
    <div className={styles.vendor}>

      {/* ── Header ── */}
      <div className={styles.vendor__head}>
        <div className={styles.anuente__head__left}>
          <span className={styles.anuente__icon}><IconPerson /></span>
          <h3 className={styles.vendor__title}>Anuente {index + 1}</h3>
        </div>
        <div className={styles.vendor__head__right}>
          <label className={styles.pjtoggle}>
            <input
              type="checkbox"
              className={styles.pjtoggle__input}
              checked={pj}
              onChange={e => onChange({ isPessoaJuridica: e.target.checked })}
            />
            <span className={styles.pjtoggle__track} />
            <span className={styles.pjtoggle__text}>Pessoa Jurídica</span>
          </label>
          <button type="button" className={styles.vendor__remove} onClick={onRemove} aria-label="Remover anuente">
            <IconClose />
          </button>
        </div>
      </div>

      {/* ── Auto-fill ── */}
      <div className={styles.vsect}>
        <p className={styles.vsect__label}>Preencher automaticamente via documento</p>
        <div className={styles.autofill}>
          <button type="button" className={styles.autofill__btn}><IconDoc />CNH — Extrair dados automaticamente</button>
          <button type="button" className={styles.autofill__btn}><IconDoc />RG — Extrair dados automaticamente</button>
        </div>
      </div>

      {/* ── Dados ── */}
      <div className={styles.vsect}>
        <div className={styles.form}>
          <div className={styles.form__row}>
            <Input
              label={pj ? 'Razão Social' : 'Nome Completo'}
              required
              value={anuente.nome}
              onChange={e => onChange({ nome: e.target.value })}
              placeholder={pj ? 'Razão social da empresa' : 'Nome completo'}
            />
            <Input
              label="Nacionalidade"
              required
              value={anuente.nacionalidade}
              onChange={e => onChange({ nacionalidade: e.target.value })}
              placeholder="brasileiro(a)"
            />
          </div>
          <div className={styles.form__row}>
            <Select
              label="Estado Civil"
              required
              value={anuente.estadoCivil}
              onChange={e => onChange({ estadoCivil: e.target.value })}
            >
              <option value="">Selecionar...</option>
              {ESTADOS_CIVIS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Input
              label="Profissão"
              required
              value={anuente.profissao}
              onChange={e => onChange({ profissao: e.target.value })}
            />
          </div>
          <div className={styles.form__row}>
            <Input
              label={pj ? 'CNPJ' : 'CPF'}
              required
              value={anuente.cpf}
              onChange={e => onChange({ cpf: e.target.value })}
              placeholder={pj ? '00.000.000/0000-00' : '000.000.000-00'}
            />
            <Input
              label={pj ? 'Inscrição Estadual' : 'RG'}
              value={anuente.rg}
              onChange={e => onChange({ rg: e.target.value })}
            />
          </div>
          {!pj && (
            <Input
              label="Órgão Expedidor"
              value={anuente.orgaoExpedidor}
              onChange={e => onChange({ orgaoExpedidor: e.target.value })}
              placeholder="SSP/RS"
            />
          )}
        </div>
      </div>

      {/* ── Endereço ── */}
      <div className={styles.vsect}>
        <p className={styles.vsect__label}>Endereço</p>
        <div className={styles.form}>
          <div className={styles.form__row}>
            <Input
              label="Rua"
              required
              value={anuente.rua}
              onChange={e => onChange({ rua: e.target.value })}
              placeholder="Nome da rua, avenida ou logradouro"
            />
            <Input
              label="Número"
              required
              value={anuente.numero}
              onChange={e => onChange({ numero: e.target.value })}
            />
          </div>
          <div className={styles.form__row__4}>
            <Input
              label="Complemento"
              value={anuente.complemento}
              onChange={e => onChange({ complemento: e.target.value })}
              placeholder="Apto ou N/A"
            />
            <Input
              label="Bairro"
              required
              value={anuente.bairro}
              onChange={e => onChange({ bairro: e.target.value })}
            />
            <Input
              label="Cidade"
              required
              value={anuente.cidade}
              onChange={e => onChange({ cidade: e.target.value })}
            />
            <Select
              label="Estado"
              required
              value={anuente.estado}
              onChange={e => onChange({ estado: e.target.value })}
            >
              <option value="">UF</option>
              {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 4 ─────────────────────────────────────────────── */

function Step4({
  anuentes,
  onAdd,
  onChange,
  onRemove,
}: {
  anuentes: AnuenteData[]
  onAdd:    () => void
  onChange: (id: string, patch: Partial<AnuenteData>) => void
  onRemove: (id: string) => void
}) {
  const isEmpty = anuentes.length === 0

  return (
    <div className={styles.s4}>
      <div className={styles.s4__top}>
        <Button variant="secondary" size="sm" onClick={onAdd}>+ Adicionar Anuente</Button>
      </div>
      {isEmpty ? (
        <div className={styles.empty}>
          <span className={styles.empty__icon}><IconPerson size={32} /></span>
          <p className={styles.empty__text}>Nenhum anuente adicionado.</p>
          <Button onClick={onAdd}>+ Adicionar Primeiro Anuente</Button>
        </div>
      ) : (
        anuentes.map((a, i) => (
          <AnuenteBlock
            key={a._id}
            anuente={a}
            index={i}
            onChange={patch => onChange(a._id, patch)}
            onRemove={() => onRemove(a._id)}
          />
        ))
      )}
    </div>
  )
}

/* ─── Step 5 ─────────────────────────────────────────────── */

function Step5({
  data,
  onChange,
}: {
  data:     ImovelData
  onChange: (patch: Partial<ImovelData>) => void
}) {
  function addBox() {
    onChange({ boxes: [...data.boxes, { _id: crypto.randomUUID(), matricula: '', descricao: '' }] })
  }
  function updateBox(id: string, patch: Partial<Omit<BoxData, '_id'>>) {
    onChange({ boxes: data.boxes.map(b => b._id === id ? { ...b, ...patch } : b) })
  }
  function removeBox(id: string) {
    onChange({ boxes: data.boxes.filter(b => b._id !== id) })
  }

  return (
    <div className={styles.s2}>
      <div className={styles.vendor}>

        {/* ── Vincular imóvel ── */}
        <div className={styles.vsect}>
          <p className={styles.vsect__label}>Vincular Imóvel do Sistema</p>
          <Select
            label="Imóvel da Carteira"
            value={data.imovelVinculado}
            onChange={e => onChange({ imovelVinculado: e.target.value })}
            hint="Vincular um imóvel do sistema pré-preenche endereço e áreas."
          >
            <option value="">Nenhum (preencher manualmente)</option>
            {MOCK_IMOVEIS_PORTFOLIO.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </Select>
        </div>

        {/* ── Matrícula auto-fill ── */}
        <div className={styles.vsect}>
          <p className={styles.vsect__label}>Preencher automaticamente via Matrícula</p>
          <div className={styles.autofill}>
            <button type="button" className={styles.autofill__btn}>
              <IconUpload />
              Enviar Matrícula — Extrair dados automaticamente
            </button>
          </div>
          <p className={styles.vsect__hint}>
            Extraia automaticamente nº da matrícula, cartório, endereço e áreas.
          </p>
        </div>

        {/* ── Endereço ── */}
        <div className={styles.vsect}>
          <p className={styles.vsect__label}>Endereço do Imóvel</p>
          <div className={styles.form}>
            <Input
              label="Rua / Logradouro"
              required
              value={data.rua}
              onChange={e => onChange({ rua: e.target.value })}
              placeholder="Rua das Palmeiras"
            />
            <div className={styles.form__row}>
              <Input
                label="Número"
                required
                value={data.numero}
                onChange={e => onChange({ numero: e.target.value })}
                placeholder="123"
              />
              <Input
                label="Complemento"
                value={data.complemento}
                onChange={e => onChange({ complemento: e.target.value })}
                placeholder="Apto 401, Bloco A (ou - se não houver)"
              />
            </div>
            <div className={styles.form__row}>
              <Input
                label="Bairro"
                required
                value={data.bairro}
                onChange={e => onChange({ bairro: e.target.value })}
                placeholder="Centro"
              />
              <Input
                label="CEP"
                required
                value={data.cep}
                onChange={e => onChange({ cep: e.target.value })}
                placeholder="00000-000"
              />
            </div>
            <div className={styles.form__row}>
              <Input
                label="Cidade"
                required
                value={data.cidade}
                onChange={e => onChange({ cidade: e.target.value })}
                placeholder="Florianópolis"
              />
              <Select
                label="Estado"
                required
                value={data.estado}
                onChange={e => onChange({ estado: e.target.value })}
              >
                <option value="">UF</option>
                {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </Select>
            </div>
          </div>
        </div>

        {/* ── Registro e áreas ── */}
        <div className={styles.vsect}>
          <p className={styles.vsect__label}>Registro e Áreas</p>
          <div className={styles.form}>
            <div className={styles.form__row}>
              <Input
                label="Número da Matrícula"
                required
                value={data.matriculaNum}
                onChange={e => onChange({ matriculaNum: e.target.value })}
                placeholder="000000"
              />
              <Input
                label="Cartório de Registro"
                value={data.cartorio}
                onChange={e => onChange({ cartorio: e.target.value })}
                placeholder="Xº Registro de Imóveis de Porto Alegre"
              />
            </div>
            <Input
              label="Protocolo de Atualização da Matrícula"
              value={data.protocolo}
              onChange={e => onChange({ protocolo: e.target.value })}
              placeholder="Número do protocolo (se houver)"
              hint="Informe caso a matrícula esteja em processo de atualização no cartório."
            />
            <div className={styles.form__row}>
              <Input
                label="Área Total (m²)"
                required
                type="number"
                value={data.areaTotal}
                onChange={e => onChange({ areaTotal: e.target.value })}
              />
              <Input
                label="Área Privativa (m²)"
                required
                type="number"
                value={data.areaPrivativa}
                onChange={e => onChange({ areaPrivativa: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* ── Toggles ── */}
        <div className={styles.vsect}>
          <div className={styles.field__toggles}>
            <div className={styles.field__toggle}>
              <div className={styles.field__toggle__info}>
                <span className={styles.field__toggle__label}>Imóvel Ocupado por Terceiros</span>
                <span className={styles.field__toggle__desc}>Marque se o imóvel está ocupado por inquilinos ou outros</span>
              </div>
              <label className={styles.field__toggle__ctrl}>
                <input
                  type="checkbox"
                  className={styles.pjtoggle__input}
                  checked={data.ocupadoTerceiros}
                  onChange={e => onChange({ ocupadoTerceiros: e.target.checked })}
                />
                <span className={styles.pjtoggle__track} />
              </label>
            </div>
            <div className={styles.field__toggle}>
              <div className={styles.field__toggle__info}>
                <span className={styles.field__toggle__label}>Possui Saldo Devedor</span>
                <span className={styles.field__toggle__desc}>Financiamento ou dívidas vinculadas</span>
              </div>
              <label className={styles.field__toggle__ctrl}>
                <input
                  type="checkbox"
                  className={styles.pjtoggle__input}
                  checked={data.saldoDevedor}
                  onChange={e => onChange({ saldoDevedor: e.target.checked })}
                />
                <span className={styles.pjtoggle__track} />
              </label>
            </div>
          </div>
        </div>

        {/* ── Bens móveis ── */}
        <div className={styles.vsect}>
          <p className={styles.vsect__label}>Bens Móveis Incluídos na Venda</p>
          <textarea
            className={styles.textarea}
            rows={3}
            value={data.bensMoveisTexto}
            onChange={e => onChange({ bensMoveisTexto: e.target.value })}
            placeholder="Liste os bens móveis que serão incluídos na venda (ex: ar condicionado, móveis planejados, eletrodomésticos...)"
          />
        </div>

        {/* ── Boxes de garagem ── */}
        <div className={styles.vsect}>
          <div className={styles.garage__head}>
            <div className={styles.anuente__head__left}>
              <span className={styles.anuente__icon}><IconGarage /></span>
              <span className={styles.garage__head__label}>Boxes de Garagem</span>
            </div>
            <Button variant="secondary" size="sm" onClick={addBox}>+ Adicionar Box</Button>
          </div>
          <p className={styles.garage__desc}>
            Adicione boxes de garagem com matrícula separada (opcional)
          </p>
          {data.boxes.length === 0 ? (
            <div className={styles.garage__empty}>
              <span className={styles.garage__empty__icon}><IconGarage /></span>
              <p className={styles.garage__empty__text}>Nenhum box de garagem adicionado</p>
              <p className={styles.garage__empty__hint}>
                Clique em &lsquo;Adicionar Box&rsquo; se o imóvel possui boxes com matrícula separada
              </p>
            </div>
          ) : (
            <div className={styles.garage__list}>
              {data.boxes.map((box, i) => (
                <div key={box._id} className={styles.garage__item}>
                  <span className={styles.garage__item__num}>{i + 1}</span>
                  <div className={styles.garage__item__fields}>
                    <Input
                      label="Matrícula do Box"
                      required
                      value={box.matricula}
                      onChange={e => updateBox(box._id, { matricula: e.target.value })}
                      placeholder="000000"
                    />
                    <Input
                      label="Identificação"
                      value={box.descricao}
                      onChange={e => updateBox(box._id, { descricao: e.target.value })}
                      placeholder="Ex: Box 01 — Subsolo"
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.vendor__remove}
                    onClick={() => removeBox(box._id)}
                    aria-label="Remover box"
                  >
                    <IconClose />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Certidões do imóvel ── */}
        <div className={styles.vsect}>
          <p className={styles.vsect__label}>Certidões: Imóvel Principal</p>
          <div className={styles.certs}>
            <ul className={styles.certs__list}>
              {CERT_IMOVEL.map(cert => (
                <li key={cert.id} className={styles.cert__prop__row}>
                  <div className={styles.cert__info}>
                    <span className={styles.cert__name}>{cert.nome}</span>
                    <span className={styles.cert__org}>{cert.orgao}</span>
                  </div>
                  <div className={styles.cert__prop__right}>
                    <span className={styles.cert__prop__badge}>Pendente</span>
                    <button type="button" className={styles.cert__prop__btn} aria-label="Anexar certidão">
                      <IconUpload />
                    </button>
                    <button type="button" className={styles.cert__prop__btn} aria-label="Abrir site">
                      <IconExternalLink />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p className={styles.certs__footer}>
              Anexe as certidões do imóvel principal. Elas são essenciais para a due diligence.
            </p>
          </div>
        </div>

      </div>

      {/* ── Confirmação ── */}
      <div className={styles.imovel__confirm}>
        <label className={styles.imovel__confirm__check}>
          <input
            type="checkbox"
            checked={data.confirmado}
            onChange={e => onChange({ confirmado: e.target.checked })}
          />
          <span className={styles.imovel__confirm__label}>
            Confirmo que todos os dados do imóvel estão corretos e atualizados
          </span>
        </label>
        <p className={styles.imovel__confirm__warn}>
          Esta confirmação é obrigatória para prosseguir com a geração do contrato.
        </p>
      </div>
    </div>
  )
}

/* ─── Step 6 — CurrencyInput ─────────────────────────────── */

function CurrencyInput({
  label,
  required,
  value,
  onChange,
}: {
  label:     string
  required?: boolean
  value:     string
  onChange:  (val: string) => void
}) {
  return (
    <div className={styles.currency__field}>
      <label className={styles.currency__label}>
        {label}
        {required && <span className={styles.currency__required}> *</span>}
      </label>
      <div className={styles.currency__wrap}>
        <span className={styles.currency__prefix}>R$</span>
        <input
          type="number"
          className={styles.currency__input}
          value={value}
          onChange={e => onChange(e.target.value)}
          step="0.01"
          min="0"
          placeholder="0.00"
        />
      </div>
    </div>
  )
}

/* ─── Step 6 — PagamentoBlock ────────────────────────────── */

function PagamentoBlock({
  pag,
  index,
  onChange,
  onRemove,
}: {
  pag:      PagamentoData
  index:    number
  onChange: (patch: Partial<PagamentoData>) => void
  onRemove: () => void
}) {
  return (
    <div className={styles.pag__block}>
      <div className={styles.pag__head}>
        <span className={styles.pag__title}>Pagamento {index + 1}</span>
        <button type="button" className={styles.vendor__remove} onClick={onRemove} aria-label="Remover pagamento">
          <IconClose />
        </button>
      </div>
      <div className={styles.pag__body}>
        <div className={styles.form__row__3}>
          <Select
            label="Tipo"
            required
            value={pag.tipo}
            onChange={e => onChange({ tipo: e.target.value })}
          >
            <option value="">Selecionar tipo...</option>
            {TIPOS_PAGAMENTO.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <CurrencyInput
            label="Valor"
            required
            value={pag.valor}
            onChange={val => onChange({ valor: val })}
          />
          <Select
            label="Data de Pagamento"
            value={pag.dataPag}
            onChange={e => onChange({ dataPag: e.target.value })}
          >
            <option value="">Selecionar data...</option>
            {DATAS_PAGAMENTO.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
        </div>
        <div className={styles.pag__toggle}>
          <label className={styles.pag__toggle__label}>
            <span className={cn(styles.pag__toggle__icon, pag.viaDeposito && styles['pag__toggle__icon--on'])}>
              <IconCheckCircle />
            </span>
            Pagamento via depósito na conta do vendedor
          </label>
          <label className={styles.field__toggle__ctrl}>
            <input
              type="checkbox"
              className={styles.pjtoggle__input}
              checked={pag.viaDeposito}
              onChange={e => onChange({ viaDeposito: e.target.checked })}
            />
            <span className={styles.pjtoggle__track} />
          </label>
        </div>
        <textarea
          className={styles.textarea}
          rows={2}
          value={pag.descricao}
          onChange={e => onChange({ descricao: e.target.value })}
          placeholder="Detalhes adicionais (condições especiais, observações...)"
        />
      </div>
    </div>
  )
}

/* ─── Step 6 ─────────────────────────────────────────────── */

function Step6({
  data,
  onChange,
}: {
  data:     PrecoPagamentoData
  onChange: (patch: Partial<PrecoPagamentoData>) => void
}) {
  function addPagamento() {
    onChange({ pagamentos: [...data.pagamentos, createPagamento()] })
  }

  function updatePagamento(id: string, patch: Partial<PagamentoData>) {
    onChange({
      pagamentos: data.pagamentos.map(p => p._id === id ? { ...p, ...patch } : p),
    })
  }

  function removePagamento(id: string) {
    onChange({ pagamentos: data.pagamentos.filter(p => p._id !== id) })
  }

  return (
    <div className={styles.s2}>
      <div className={styles.vendor}>

        {/* ── Valor total ── */}
        <div className={styles.vsect}>
          <CurrencyInput
            label="Valor Total da Venda"
            required
            value={data.valorTotal}
            onChange={val => onChange({ valorTotal: val })}
          />
        </div>

        {/* ── Formas de pagamento ── */}
        <div className={styles.vsect}>
          <div className={styles.pag__section__head}>
            <p className={styles.vsect__label} style={{ margin: 0 }}>Formas de Pagamento</p>
            <Button variant="secondary" size="sm" onClick={addPagamento}>+ Adicionar Forma</Button>
          </div>
          {data.pagamentos.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.empty__icon}><IconDollarSign size={32} /></span>
              <p className={styles.empty__text}>Nenhuma forma de pagamento adicionada.</p>
              <Button onClick={addPagamento}>+ Adicionar Primeira Forma de Pagamento</Button>
            </div>
          ) : (
            <div className={styles.pag__list}>
              {data.pagamentos.map((pag, i) => (
                <PagamentoBlock
                  key={pag._id}
                  pag={pag}
                  index={i}
                  onChange={patch => updatePagamento(pag._id, patch)}
                  onRemove={() => removePagamento(pag._id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Entrega das chaves ── */}
        <div className={styles.vsect}>
          <Select
            label="Momento da Entrega das Chaves"
            required
            value={data.entregaChaves}
            onChange={e => onChange({ entregaChaves: e.target.value })}
          >
            {MOMENTOS_ENTREGA.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>

      </div>
    </div>
  )
}

/* ─── Step 7 ─────────────────────────────────────────────── */

function Step7({
  data,
  valorTotal,
  onChange,
}: {
  data:       CorretagemData
  valorTotal: string
  onChange:   (patch: Partial<CorretagemData>) => void
}) {
  const valorBase       = parseFloat(valorTotal) || 0
  const pctNum          = parseFloat(data.percentualComissao) || 0
  const commissionValue = data.modoManual
    ? (parseFloat(data.valorManual) || 0)
    : (pctNum / 100) * valorBase

  const remaxVal     = commissionValue * REMAX_PCT / 100
  const corretorVal  = commissionValue * COR_PCT / 100
  const totalMomentos = data.momentos.reduce((s, m) => s + (parseFloat(m.valor) || 0), 0)
  const semValorVenda = valorBase === 0

  function addMomento() {
    onChange({ momentos: [...data.momentos, createMomentoComissao()] })
  }
  function updateMomento(id: string, patch: Partial<MomentoComData>) {
    onChange({ momentos: data.momentos.map(m => m._id === id ? { ...m, ...patch } : m) })
  }
  function removeMomento(id: string) {
    if (data.momentos.length === 1) return
    onChange({ momentos: data.momentos.filter(m => m._id !== id) })
  }

  return (
    <div className={styles.s2}>

      {/* ── Modelo de comissão ── */}
      <div className={styles.cor__model__banner}>
        <span className={styles.cor__badge}>Corretor (45/55)</span>
        <span className={styles.cor__model__text}>Corretor 45% / RE/MAX 55%</span>
      </div>

      {/* ── Alerta: sem valor de venda ── */}
      {semValorVenda && (
        <div className={styles.cor__warn}>
          <span className={styles.cor__warn__icon}><IconWarning /></span>
          <p className={styles.cor__warn__text}>
            Defina o valor da venda na <strong>Etapa 6 (Preço e Pagamento)</strong> para calcular a comissão automaticamente.
          </p>
        </div>
      )}

      {/* ── Cálculo da Comissão ── */}
      <div className={styles.vendor}>
        <div className={styles.vendor__head}>
          <div className={styles.cor__section__head}>
            <span className={styles.cor__section__icon}><IconCalc /></span>
            <p className={styles.vendor__title}>Cálculo da Comissão</p>
          </div>
        </div>
        <div className={styles.vsect}>
          <p className={styles.s2__instruction}>
            A comissão é calculada automaticamente com base no valor da venda (<strong>{fmtBRL(valorTotal || '0')}</strong>)
          </p>
          <div className={styles.form__row}>

            <Select
              label="Percentual de Comissão"
              required
              value={data.percentualComissao}
              onChange={e => onChange({ percentualComissao: e.target.value })}
            >
              {PCT_OPCOES.map(p => (
                <option key={p} value={p}>{p === 'Outro' ? 'Outro' : `${p}%`}</option>
              ))}
            </Select>

            {data.modoManual ? (
              <div className={styles.currency__field}>
                <label className={styles.currency__label}>Valor Total da Comissão</label>
                <div className={styles.currency__wrap}>
                  <span className={styles.currency__prefix}>R$</span>
                  <input
                    type="number"
                    className={styles.currency__input}
                    value={data.valorManual}
                    onChange={e => onChange({ valorManual: e.target.value })}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ) : (
              <div className={styles.currency__field}>
                <div className={styles.cor__val__label}>
                  <label className={styles.currency__label}>Valor Total da Comissão</label>
                  <span className={styles.cor__lock} aria-hidden="true"><IconLock /></span>
                </div>
                <div className={styles.commission__display}>
                  <span className={styles.commission__val}>{fmtBRL(commissionValue.toFixed(2))}</span>
                </div>
              </div>
            )}
          </div>

          <label className={styles.cor__radio__row}>
            <input
              type="checkbox"
              className={styles.pjtoggle__input}
              checked={data.modoManual}
              onChange={e => {
                const on = e.target.checked
                onChange({ modoManual: on, valorManual: commissionValue.toFixed(2) })
              }}
            />
            <span className={styles.cor__radio__box} aria-hidden="true" />
            <span className={styles.cor__radio__label}>
              Editar valor manualmente (sobrescrever cálculo automático)
            </span>
          </label>
        </div>
      </div>

      {/* ── Tipo de Venda ── */}
      <div className={styles.vendor}>
        <div className={styles.vendor__head}>
          <p className={styles.vendor__title}>Tipo de Venda</p>
        </div>
        <div className={styles.vsect}>
          <Select
            label="Tipo de Venda"
            required
            value={data.tipoVenda}
            onChange={e => onChange({ tipoVenda: e.target.value })}
          >
            {TIPOS_VENDA.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* ── Distribuição da Comissão ── */}
      <div className={styles.vendor}>
        <div className={styles.vendor__head}>
          <div className={styles.cor__section__head}>
            <span className={styles.cor__section__icon}><IconPerson size={16} /></span>
            <p className={styles.vendor__title}>Distribuição da Comissão</p>
          </div>
        </div>
        <div className={styles.vsect}>
          <div className={styles.cor__split}>
            <div className={styles.cor__split__card}>
              <span className={styles.cor__split__label}>RE/MAX</span>
              <span className={styles.cor__split__pct}>{REMAX_PCT}.0%</span>
              <span className={styles.cor__split__val}>{fmtBRL(remaxVal.toFixed(2))}</span>
            </div>
            <div className={styles.cor__split__card}>
              <span className={styles.cor__split__label}>Corretor</span>
              <span className={styles.cor__split__pct}>{COR_PCT}.0%</span>
              <span className={styles.cor__split__val}>{fmtBRL(corretorVal.toFixed(2))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pagamento da Comissão ── */}
      <div className={styles.vendor}>
        <div className={styles.vendor__head}>
          <div className={styles.cor__section__head}>
            <span className={styles.cor__section__icon}><IconDollarSign size={16} /></span>
            <p className={styles.vendor__title}>Pagamento da Comissão</p>
          </div>
        </div>
        <div className={styles.vsect}>
          <p className={styles.s2__instruction}>
            Configure um ou mais momentos de pagamento da comissão. A soma dos valores deve ser igual à comissão total.
          </p>

          <div className={styles.pag__list}>
            {data.momentos.map((m, i) => (
              <div key={m._id} className={styles.pag__block}>
                <div className={styles.pag__head}>
                  <span className={styles.pag__title}>Momento {i + 1}</span>
                  {data.momentos.length > 1 && (
                    <button
                      type="button"
                      className={styles.vendor__remove}
                      onClick={() => removeMomento(m._id)}
                      aria-label="Remover momento"
                    >
                      <IconClose />
                    </button>
                  )}
                </div>
                <div className={styles.pag__body}>
                  <Select
                    label="Quando"
                    required
                    value={m.quando}
                    onChange={e => updateMomento(m._id, { quando: e.target.value })}
                  >
                    {MOMENTOS_COM.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </Select>
                  <CurrencyInput
                    label="Valor"
                    required
                    value={m.valor}
                    onChange={val => updateMomento(m._id, { valor: val })}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button variant="secondary" size="sm" onClick={addMomento}>
            + Adicionar Momento de Pagamento
          </Button>

          <div className={styles.cor__total__ok}>
            <span className={styles.cor__total__icon}><IconCheckCircle /></span>
            <span className={styles.cor__total__text}>
              Total configurado:{' '}
              <strong>{fmtBRL(totalMomentos.toFixed(2))}</strong>
              {' / '}
              <strong>{fmtBRL(commissionValue.toFixed(2))}</strong>
            </span>
          </div>

          <label className={styles.cor__radio__row}>
            <input
              type="checkbox"
              className={styles.pjtoggle__input}
              checked={data.incluirQuitacao}
              onChange={e => onChange({ incluirQuitacao: e.target.checked })}
            />
            <span className={styles.cor__radio__box} aria-hidden="true" />
            <span className={styles.cor__radio__label}>
              Incluir cláusula de recibo de quitação da comissão no contrato
            </span>
          </label>
        </div>
      </div>

      {/* ── Corretor Responsável ── */}
      <div className={styles.vendor}>
        <div className={styles.vendor__head}>
          <p className={styles.vendor__title}>Corretor Responsável</p>
        </div>
        <div className={styles.vsect}>
          <p className={styles.s2__instruction}>
            Dados puxados automaticamente do perfil. Edite se necessário.
          </p>
          <div className={styles.form__row}>
            <Input
              label="Nome"
              required
              value={data.nomeCorretor}
              onChange={e => onChange({ nomeCorretor: e.target.value })}
            />
            <Input
              label="CRECI"
              required
              placeholder="CRECI/RS 00000"
              value={data.creci}
              onChange={e => onChange({ creci: e.target.value })}
            />
          </div>
          <div className={styles.form__row}>
            <Input
              label="Banco"
              required
              placeholder="Nome do banco"
              value={data.banco}
              onChange={e => onChange({ banco: e.target.value })}
            />
            <Input
              label="Chave PIX"
              required
              placeholder="CPF, e-mail, telefone ou chave aleatória"
              value={data.chavePix}
              onChange={e => onChange({ chavePix: e.target.value })}
            />
          </div>
          <div className={styles.form__row}>
            <Input
              label="Agência"
              required
              placeholder="0000"
              value={data.agencia}
              onChange={e => onChange({ agencia: e.target.value })}
            />
            <Input
              label="Conta"
              required
              placeholder="00000-0"
              value={data.conta}
              onChange={e => onChange({ conta: e.target.value })}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

/* ─── Step 8 constants ───────────────────────────────────── */

const TIPOS_ASSINATURA = [
  'Digital (via Autentique)',
  'Física (impressa)',
  'Híbrida (parte digital, parte física)',
]

const INDICES_CORRECAO = [
  'IGP-M (FGV)',
  'IPCA (IBGE)',
  'INPC (IBGE)',
  'Selic',
  'Sem correção',
]

const PRAZOS_CONTAGEM = [
  'Quitação total do preço',
  'Assinatura do contrato',
  'Liberação do financiamento',
  'Outro',
]

/* ─── Step 8 types ────────────────────────────────────────── */

interface Step8Data {
  tipoAssinatura:      string
  observacoes:         string
  multaContratual:     string
  jurosMora:           string
  indiceCorrecao:      string
  prazoLavratura:      string
  aContarDe:           string
  escrituraComprador:  boolean
  itbiComprador:       boolean
  certidoesComprador:  boolean
  incluirVistoria:     boolean
}

function createStep8Data(): Step8Data {
  return {
    tipoAssinatura:      'Digital (via Autentique)',
    observacoes:         '',
    multaContratual:     '10',
    jurosMora:           '1',
    indiceCorrecao:      'IGP-M (FGV)',
    prazoLavratura:      '30',
    aContarDe:           'Quitação total do preço',
    escrituraComprador:  true,
    itbiComprador:       true,
    certidoesComprador:  false,
    incluirVistoria:     true,
  }
}

/* ─── Step 8 — PctInput / DayInput ──────────────────────── */

function PctInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className={styles.currency__field}>
      <label className={styles.currency__label}>{label}</label>
      <div className={styles.pct8__wrap}>
        <input
          type="number"
          className={styles.pct8__input}
          value={value}
          onChange={e => onChange(e.target.value)}
          step="0.01"
          min="0"
          placeholder="0"
        />
        <span className={styles.pct8__suffix}>%</span>
      </div>
    </div>
  )
}

function DayInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className={styles.currency__field}>
      <label className={styles.currency__label}>{label}</label>
      <div className={styles.pct8__wrap}>
        <input
          type="number"
          className={styles.pct8__input}
          value={value}
          onChange={e => onChange(e.target.value)}
          step="1"
          min="1"
          placeholder="30"
        />
        <span className={styles.pct8__suffix}>dias</span>
      </div>
    </div>
  )
}

/* ─── Step 8 — validation ────────────────────────────────── */

function getStep8Errors(
  step1:          Step1Data,
  vendors:        VendedorData[],
  compradores:    CompradorData[],
  imovel:         ImovelData,
  precoPagamento: PrecoPagamentoData,
  step8:          Step8Data,
): string[] {
  const err: string[] = []
  if (!step1.unidade)                           err.push('Unidade não selecionada (Etapa 1)')
  if (!step1.tipoContrato)                      err.push('Tipo de contrato não selecionado (Etapa 1)')
  if (!vendors.some(v => v.nome.trim()))         err.push('Nome do vendedor obrigatório (Etapa 2)')
  if (!compradores.some(c => c.nome.trim()))     err.push('Nome do comprador obrigatório (Etapa 3)')
  if (!imovel.confirmado)                        err.push('Dados do imóvel não confirmados (Etapa 5)')
  if (!(parseFloat(precoPagamento.valorTotal) > 0)) err.push('Valor da venda não preenchido (Etapa 6)')
  if (!step8.tipoAssinatura)                    err.push('Tipo de assinatura não selecionado')
  return err
}

/* ─── Step 8 ─────────────────────────────────────────────── */

function Step8({
  data,
  onChange,
  step1,
  vendors,
  compradores,
  imovel,
  precoPagamento,
}: {
  data:           Step8Data
  onChange:       (patch: Partial<Step8Data>) => void
  step1:          Step1Data
  vendors:        VendedorData[]
  compradores:    CompradorData[]
  imovel:         ImovelData
  precoPagamento: PrecoPagamentoData
}) {
  const [penOpen, setPenOpen] = React.useState(true)
  const [docOpen, setDocOpen] = React.useState(true)

  const errors = getStep8Errors(step1, vendors, compradores, imovel, precoPagamento, data)
  const allOk  = errors.length === 0

  const parties = [
    ...vendors.map((v, i)     => ({ key: v._id, role: 'VENDEDOR',  name: v.nome  || `Vendedor ${i + 1}`  })),
    ...compradores.map((c, i) => ({ key: c._id, role: 'COMPRADOR', name: c.nome || `Comprador ${i + 1}` })),
  ]

  return (
    <div className={styles.s2}>

      {/* ── Tipo de Assinatura ── */}
      <div className={styles.vendor}>
        <div className={styles.vendor__head}>
          <p className={styles.vendor__title}>Tipo de Assinatura</p>
        </div>
        <div className={styles.vsect}>
          <Select
            label="Tipo de Assinatura"
            required
            value={data.tipoAssinatura}
            onChange={e => onChange({ tipoAssinatura: e.target.value })}
          >
            {TIPOS_ASSINATURA.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
      </div>

      {/* ── Observações Gerais ── */}
      <div className={styles.vendor}>
        <div className={styles.vendor__head}>
          <p className={styles.vendor__title}>Observações Gerais</p>
        </div>
        <div className={styles.vsect}>
          <textarea
            className={styles.textarea}
            rows={3}
            value={data.observacoes}
            onChange={e => onChange({ observacoes: e.target.value })}
            placeholder="Observações adicionais que devem constar no contrato..."
          />
        </div>
      </div>

      {/* ── Penalidades e Escritura (collapsible) ── */}
      <div className={styles.vendor}>
        <button
          type="button"
          className={styles.s8__coll__head}
          onClick={() => setPenOpen(o => !o)}
          aria-expanded={penOpen}
        >
          <div className={styles.cor__section__head}>
            <span className={styles.cor__section__icon}><IconGavel /></span>
            <span className={styles.vendor__title}>Penalidades e Escritura</span>
          </div>
          <span className={cn(styles.s8__chevron, penOpen && styles['s8__chevron--open'])}>
            <IconChevron open={false} />
          </span>
        </button>

        {penOpen && (
          <div className={styles.s8__coll__body}>

            {/* Penalidades por Descumprimento */}
            <div className={styles.s8__subsect}>
              <p className={styles.s8__subsect__label}>Penalidades por Descumprimento</p>
              <div className={styles.form__row__3}>
                <PctInput
                  label="Multa Contratual (%)"
                  value={data.multaContratual}
                  onChange={v => onChange({ multaContratual: v })}
                />
                <PctInput
                  label="Juros de Mora (% a.m.)"
                  value={data.jurosMora}
                  onChange={v => onChange({ jurosMora: v })}
                />
                <Select
                  label="Índice de Correção"
                  value={data.indiceCorrecao}
                  onChange={e => onChange({ indiceCorrecao: e.target.value })}
                >
                  {INDICES_CORRECAO.map(i => <option key={i} value={i}>{i}</option>)}
                </Select>
              </div>
            </div>

            {/* Escritura Definitiva */}
            <div className={styles.s8__subsect}>
              <p className={styles.s8__subsect__label}>Escritura Definitiva</p>
              <div className={styles.form__row}>
                <DayInput
                  label="Prazo para Lavratura (dias)"
                  value={data.prazoLavratura}
                  onChange={v => onChange({ prazoLavratura: v })}
                />
                <Select
                  label="A contar de"
                  value={data.aContarDe}
                  onChange={e => onChange({ aContarDe: e.target.value })}
                >
                  {PRAZOS_CONTAGEM.map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
              </div>
            </div>

            {/* Responsabilidade pelas Despesas */}
            <div className={styles.s8__subsect}>
              <p className={styles.s8__subsect__label}>Responsabilidade pelas Despesas</p>
              <div className={styles.resp__grid}>
                {([
                  { key: 'escrituraComprador',  label: 'Escritura',  val: data.escrituraComprador  },
                  { key: 'itbiComprador',        label: 'ITBI',       val: data.itbiComprador       },
                  { key: 'certidoesComprador',   label: 'Certidões',  val: data.certidoesComprador  },
                ] as const).map(({ key, label, val }) => (
                  <div key={key} className={styles.resp__cell}>
                    <span className={styles.resp__cell__label}>{label}</span>
                    <label className={styles.pjtoggle}>
                      <input
                        type="checkbox"
                        className={styles.pjtoggle__input}
                        checked={val}
                        onChange={e => onChange({ [key]: e.target.checked })}
                      />
                      <span className={styles.pjtoggle__track} />
                    </label>
                    <span className={cn(styles.resp__status, val ? styles['resp__status--on'] : styles['resp__status--off'])}>
                      {val ? 'Comprador' : 'Vendedor'}
                    </span>
                  </div>
                ))}
              </div>
              <p className={styles.s8__helper}>
                Switch ligado = Comprador paga &nbsp;|&nbsp; Switch desligado = Vendedor paga
              </p>
            </div>

            {/* Entrega do Imóvel */}
            <div className={styles.s8__subsect}>
              <p className={styles.s8__subsect__label}>Entrega do Imóvel</p>
              <div className={styles.field__toggles}>
                <div className={styles.field__toggle}>
                  <div className={styles.field__toggle__info}>
                    <span className={styles.field__toggle__label}>Incluir Termo de Vistoria</span>
                    <span className={styles.field__toggle__desc}>Adiciona cláusula obrigatória de vistoria conjunta</span>
                  </div>
                  <label className={styles.field__toggle__ctrl}>
                    <input
                      type="checkbox"
                      className={styles.pjtoggle__input}
                      checked={data.incluirVistoria}
                      onChange={e => onChange({ incluirVistoria: e.target.checked })}
                    />
                    <span className={styles.pjtoggle__track} />
                  </label>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── Documentação do Contrato (collapsible) ── */}
      <div className={styles.vendor}>
        <button
          type="button"
          className={styles.s8__coll__head}
          onClick={() => setDocOpen(o => !o)}
          aria-expanded={docOpen}
        >
          <div className={styles.cor__section__head}>
            <span className={styles.cor__section__icon}><IconFolder /></span>
            <span className={styles.vendor__title}>Documentação do Contrato</span>
          </div>
          <span className={cn(styles.s8__chevron, docOpen && styles['s8__chevron--open'])}>
            <IconChevron open={false} />
          </span>
        </button>

        {docOpen && (
          <div className={styles.s8__coll__body}>
            <div className={styles.s8__doc__list}>
              {parties.map(p => (
                <div key={p.key} className={styles.s8__doc__party}>
                  <div className={styles.s8__doc__party__head}>
                    <span className={styles.s8__doc__role}>{p.role}</span>
                    <span className={styles.s8__doc__name}>{p.name}</span>
                  </div>
                  <p className={styles.s8__doc__empty}>Nenhum documento disponível</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Histórico de Revisões ── */}
      <div className={styles.vendor}>
        <div className={styles.vendor__head}>
          <div className={styles.cor__section__head}>
            <span className={styles.cor__section__icon}><IconClockSm /></span>
            <p className={styles.vendor__title}>Histórico de Revisões</p>
          </div>
        </div>
        <div className={styles.s8__hist__empty}>
          <span className={styles.s8__hist__icon}><IconClockLg /></span>
          <p className={styles.s8__hist__text}>Nenhum histórico de revisão ainda</p>
        </div>
      </div>

      {/* ── Banner de validação ── */}
      {allOk ? (
        <div className={styles.s8__success}>
          <span className={styles.s8__success__icon}><IconCheckCircle /></span>
          <p className={styles.s8__success__text}>
            Todos os campos obrigatórios estão preenchidos! Pronto para enviar para revisão.
          </p>
        </div>
      ) : (
        <div className={styles.s8__warn__banner}>
          <span className={styles.s8__warn__icon}><IconWarning /></span>
          <div>
            <p className={styles.s8__warn__title}>Campos obrigatórios incompletos:</p>
            <ul className={styles.s8__warn__list}>
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        </div>
      )}

    </div>
  )
}

/* ─── Placeholder (steps 7–8) ────────────────────────────── */

function StepPlaceholder({ stepNum }: { stepNum: number }) {
  const step = STEPS[stepNum - 1]
  return (
    <div className={styles.placeholder}>
      <span className={styles.placeholder__icon}><IconWrench /></span>
      <p className={styles.placeholder__title}>{step.label}</p>
      <p className={styles.placeholder__text}>
        Esta etapa está em construção e será implementada em breve.
      </p>
    </div>
  )
}

/* ─── Toast ──────────────────────────────────────────────── */

function Toast({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <div className={styles.toast__head}>
        <span className={styles.toast__icon}><IconWarning /></span>
        <p className={styles.toast__title}>Rascunho salvo com avisos</p>
        <button type="button" className={styles.toast__close} onClick={onClose} aria-label="Fechar">
          <IconClose />
        </button>
      </div>
      <p className={styles.toast__text}>
        Compradores sem nome preenchido; Dados do imóvel não preenchidos
      </p>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */

export default function NovoContratoPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showToast,   setShowToast]   = useState(true)

  const [step1Data, setStep1Data] = useState<Step1Data>({
    unidade:      '',
    tipoContrato: '',
    negociacao:   '',
    corretor:     'Gabriel Avila',
  })

  const [vendors, setVendors] = useState<VendedorData[]>([createVendor()])

  function addVendor() {
    setVendors(prev => [...prev, createVendor()])
  }

  function updateVendor(id: string, patch: Partial<VendedorData>) {
    setVendors(prev => prev.map(v => v._id === id ? { ...v, ...patch } : v))
  }

  function removeVendor(id: string) {
    setVendors(prev => prev.length > 1 ? prev.filter(v => v._id !== id) : prev)
  }

  const [compradores, setCompradores] = useState<CompradorData[]>([createComprador()])

  function addComprador() {
    setCompradores(prev => [...prev, createComprador()])
  }

  function updateComprador(id: string, patch: Partial<CompradorData>) {
    setCompradores(prev => prev.map(c => c._id === id ? { ...c, ...patch } : c))
  }

  function removeComprador(id: string) {
    setCompradores(prev => prev.length > 1 ? prev.filter(c => c._id !== id) : prev)
  }

  const [anuentes, setAnuentes] = useState<AnuenteData[]>([])

  function addAnuente() {
    setAnuentes(prev => [...prev, createAnuente()])
  }

  function updateAnuente(id: string, patch: Partial<AnuenteData>) {
    setAnuentes(prev => prev.map(a => a._id === id ? { ...a, ...patch } : a))
  }

  function removeAnuente(id: string) {
    setAnuentes(prev => prev.filter(a => a._id !== id))
  }

  const [imovel, setImovel] = useState<ImovelData>(createImovel())

  const [precoPagamento, setPrecoPagamento] = useState<PrecoPagamentoData>(createPrecoPagamento())

  const [corretagem, setCorretagem] = useState<CorretagemData>(createCorretagem())

  const [step8Data, setStep8Data] = useState<Step8Data>(createStep8Data())

  function goNext() {
    setCurrentStep(s => Math.min(STEPS.length, s + 1))
  }

  function goPrev() {
    setCurrentStep(s => Math.max(1, s - 1))
  }

  function handleSalvarRascunho() {
    router.push('/contracts')
  }

  const currentStepMeta = STEPS[currentStep - 1]
  const isFirst = currentStep === 1
  const isLast  = currentStep === STEPS.length

  return (
    <>
      <Topbar
        title="Novo Contrato"
        actions={
          <Button variant="secondary" size="sm" onClick={handleSalvarRascunho}>
            Salvar Rascunho
          </Button>
        }
      />

      <div className={styles.page}>

        {/* ── In-page header: Voltar + Salvar Rascunho ── */}
        <div className={styles.page__header}>
          <Link href="/contracts" className={styles.page__back}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 11.5L4 7L9 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Voltar para Jurídico
          </Link>
          <Button variant="secondary" size="sm" onClick={handleSalvarRascunho}>
            Salvar Rascunho
          </Button>
        </div>

        {/* ── Progress bar ── */}
        <Card>
          <CardBody>
            <ProgressBar current={currentStep} />
          </CardBody>
        </Card>

        {/* ── Step card ── */}
        <Card>
          <CardHeader>
            <div className={styles.step__header}>
              <span className={styles.step__num}>Etapa {currentStep} de {STEPS.length}</span>
              <h2 className={styles.step__title}>{currentStepMeta.label}</h2>
              <p className={styles.step__subtitle}>{currentStepMeta.subtitle}</p>
            </div>
          </CardHeader>
          <CardBody>
            {currentStep === 1 ? (
              <Step1
                data={step1Data}
                onChange={patch => setStep1Data(prev => ({ ...prev, ...patch }))}
              />
            ) : currentStep === 2 ? (
              <Step2
                vendors={vendors}
                onAdd={addVendor}
                onChange={updateVendor}
                onRemove={removeVendor}
              />
            ) : currentStep === 3 ? (
              <Step3
                compradores={compradores}
                onAdd={addComprador}
                onChange={updateComprador}
                onRemove={removeComprador}
              />
            ) : currentStep === 4 ? (
              <Step4
                anuentes={anuentes}
                onAdd={addAnuente}
                onChange={updateAnuente}
                onRemove={removeAnuente}
              />
            ) : currentStep === 5 ? (
              <Step5
                data={imovel}
                onChange={patch => setImovel(prev => ({ ...prev, ...patch }))}
              />
            ) : currentStep === 6 ? (
              <Step6
                data={precoPagamento}
                onChange={patch => setPrecoPagamento(prev => ({ ...prev, ...patch }))}
              />
            ) : currentStep === 7 ? (
              <Step7
                data={corretagem}
                valorTotal={precoPagamento.valorTotal}
                onChange={patch => setCorretagem(prev => ({ ...prev, ...patch }))}
              />
            ) : (
              <Step8
                data={step8Data}
                onChange={patch => setStep8Data(prev => ({ ...prev, ...patch }))}
                step1={step1Data}
                vendors={vendors}
                compradores={compradores}
                imovel={imovel}
                precoPagamento={precoPagamento}
              />
            )}
          </CardBody>
        </Card>

        {/* ── Bottom navigation ── */}
        {isLast ? (
          <div className={styles.nav__s8}>
            <Button variant="secondary" size="sm" onClick={goPrev}>
              ← Anterior
            </Button>
            <div className={styles.nav__s8__actions}>
              <Button variant="secondary" size="sm" onClick={handleSalvarRascunho}>
                <span className={styles.btn__content}>
                  <IconSave />
                  Salvar Rascunho
                </span>
              </Button>
              <Button variant="secondary" size="sm" onClick={() => {}}>
                <span className={styles.btn__content}>
                  <IconDoc />
                  Visualizar Minuta
                </span>
              </Button>
              <Button variant="primary" size="sm" onClick={() => {}}>
                <span className={styles.btn__content}>
                  <IconSend />
                  Enviar para Revisão Jurídica
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.nav}>
            <Button
              variant="secondary"
              size="sm"
              onClick={goPrev}
              disabled={isFirst}
            >
              ← Anterior
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={goNext}
              disabled={currentStep === 5 && !imovel.confirmado}
            >
              Próximo →
            </Button>
          </div>
        )}

      </div>

      {/* ── Toast notification ── */}
      {currentStep >= 2 && showToast && (
        <Toast onClose={() => setShowToast(false)} />
      )}
    </>
  )
}
