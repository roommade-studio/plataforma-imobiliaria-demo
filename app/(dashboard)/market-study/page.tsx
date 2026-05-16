'use client'

import { useState } from 'react'
import Topbar from '@/components/layout/Topbar'
import StatCard from '@/components/ui/StatCard'
import Card, { CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input, { Select, Textarea } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { STUDIES, fmtBRL, type MarketStudy, type StudyStatus } from './_data'
import styles from './page.module.css'

/* ── Status helpers ─────────────────────────────────────── */

function statusClass(s: StudyStatus): string {
  switch (s) {
    case 'Criado':      return cn(styles.badge, styles['badge--blue'])
    case 'Apresentado': return cn(styles.badge, styles['badge--yellow'])
    case 'Assinado':    return cn(styles.badge, styles['badge--green'])
    case 'Vendido':     return cn(styles.badge, styles['badge--purple'])
    case 'Suspenso':    return cn(styles.badge, styles['badge--gray'])
  }
}

/* ── Icons ──────────────────────────────────────────────── */

function IconACM() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  )
}
function IconSigned() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function IconPrint() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}
function IconEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M12 14h.01" />
    </svg>
  )
}

/* ── Initial state ──────────────────────────────────────── */

const TIPO_OPTIONS = ['Apartamento', 'Casa', 'Cobertura', 'Sala Comercial', 'Terreno', 'Rural']
const STATUS_OPTIONS: StudyStatus[] = ['Criado', 'Apresentado', 'Assinado', 'Vendido', 'Suspenso']

interface FormState {
  imovel:       string
  bairro:       string
  tipo:         string
  areaM2:       string
  dormitorios:  string
  vagas:        string
  andar:        string
  proprietario: string
  precoImprovavel:  string
  precoMercado:     string
  precoCompetitivo: string
  observacoes:      string
}

const EMPTY_FORM: FormState = {
  imovel: '', bairro: '', tipo: 'Apartamento', areaM2: '', dormitorios: '',
  vagas: '', andar: '', proprietario: '', precoImprovavel: '',
  precoMercado: '', precoCompetitivo: '', observacoes: '',
}

/* ── Component ──────────────────────────────────────────── */

export default function MarketStudyPage() {
  const [studies,      setStudies]      = useState<MarketStudy[]>(STUDIES)
  const [filterStatus, setFilterStatus] = useState('todos')
  const [detailStudy,  setDetailStudy]  = useState<MarketStudy | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [form,         setForm]         = useState<FormState>(EMPTY_FORM)

  const visible = filterStatus === 'todos'
    ? studies
    : studies.filter(s => s.status === filterStatus)

  const counts = {
    total:      studies.length,
    andamento:  studies.filter(s => ['Criado', 'Apresentado'].includes(s.status)).length,
    assinados:  studies.filter(s => s.status === 'Assinado').length,
    vendidos:   studies.filter(s => s.status === 'Vendido').length,
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const now = new Date()
    const data = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
    const newStudy: MarketStudy = {
      id: `acm-${Date.now()}`,
      imovel:       form.imovel,
      bairro:       form.bairro,
      tipo:         form.tipo,
      areaM2:       Number(form.areaM2) || 0,
      dormitorios:  Number(form.dormitorios) || 0,
      vagas:        Number(form.vagas) || 0,
      andar:        form.andar,
      status:       'Criado',
      data,
      proprietario:     form.proprietario,
      precoImprovavel:  Number(form.precoImprovavel)  || 0,
      precoMercado:     Number(form.precoMercado)     || 0,
      precoCompetitivo: Number(form.precoCompetitivo) || 0,
      mediaM2Bairro:    form.areaM2
        ? Math.round((Number(form.precoMercado) || 0) / (Number(form.areaM2) || 1))
        : 0,
      comparaveis:  [],
      observacoes:  form.observacoes,
    }
    setStudies(prev => [newStudy, ...prev])
    setForm(EMPTY_FORM)
    setAddModalOpen(false)
  }

  function handleStatusChange(id: string, status: StudyStatus) {
    setStudies(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    if (detailStudy?.id === id) setDetailStudy(prev => prev ? { ...prev, status } : prev)
  }

  function handleDelete(id: string) {
    setStudies(prev => prev.filter(s => s.id !== id))
    setDetailStudy(null)
  }

  return (
    <>
      <Topbar
        title="ACM — Análise Comparativa de Mercado"
        actions={<Button size="sm" onClick={() => setAddModalOpen(true)}>+ Nova ACM</Button>}
      />

      <div className={styles.page}>

        {/* KPIs */}
        <div className={styles.page__kpis}>
          <StatCard label="Total de ACMs"    value={counts.total}     trendLabel="na carteira"          icon={<IconACM />} />
          <StatCard label="Em Andamento"     value={counts.andamento} trend={0} trendLabel="criados e apresentados" icon={<IconBuilding />} variant="accent" />
          <StatCard label="Gestões Assinadas" value={counts.assinados} trendLabel="captações exclusivas" icon={<IconSigned />} />
          <StatCard label="Vendidos"          value={counts.vendidos}  trendLabel="com ACM realizada"    icon={<IconBuilding />} />
        </div>

        {/* Filter bar */}
        <div className={styles.filter__bar}>
          {(['todos', ...STATUS_OPTIONS] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={cn(styles.filter__pill, filterStatus === s && styles['filter__pill--active'])}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'todos' ? 'Todos' : s}
            </button>
          ))}
        </div>

        {/* Study cards */}
        <div className={styles.studies}>
          {visible.map((study) => (
            <div key={study.id} className={styles.study}>
              <div className={styles.study__head}>
                <div className={styles.study__head__left}>
                  <p className={styles.study__address}>{study.imovel}</p>
                  <p className={styles.study__meta}>
                    {study.bairro} · {study.tipo} · {study.areaM2} m²
                    {study.dormitorios > 0 ? ` · ${study.dormitorios} dorms` : ''}
                    {study.vagas > 0 ? ` · ${study.vagas} vagas` : ''}
                  </p>
                </div>
                <span className={statusClass(study.status)}>{study.status}</span>
              </div>

              <p className={styles.study__owner}>Proprietário: {study.proprietario}</p>

              {/* 3 price boxes */}
              <div className={styles.study__prices}>
                <div className={cn(styles.price, styles['price--improvavel'])}>
                  <span className={styles.price__label}>Improvável</span>
                  <span className={styles.price__value}>{fmtBRL(study.precoImprovavel)}</span>
                  <span className={styles.price__m2}>
                    {fmtBRL(Math.round(study.precoImprovavel / study.areaM2))}/m²
                  </span>
                </div>
                <div className={cn(styles.price, styles['price--mercado'])}>
                  <span className={styles.price__label}>De Mercado</span>
                  <span className={styles.price__value}>{fmtBRL(study.precoMercado)}</span>
                  <span className={styles.price__m2}>
                    {fmtBRL(Math.round(study.precoMercado / study.areaM2))}/m²
                  </span>
                  <span className={styles.price__rec}>Recomendado</span>
                </div>
                <div className={cn(styles.price, styles['price--competitivo'])}>
                  <span className={styles.price__label}>Competitivo</span>
                  <span className={styles.price__value}>{fmtBRL(study.precoCompetitivo)}</span>
                  <span className={styles.price__m2}>
                    {fmtBRL(Math.round(study.precoCompetitivo / study.areaM2))}/m²
                  </span>
                </div>
              </div>

              <div className={styles.study__footer}>
                <span className={styles.study__date}>ACM em {study.data}</span>
                <div className={styles.study__actions}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setDetailStudy(study)}
                  >
                    <IconEye /> Ver Análise
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.open(`/apresentacao/${study.id}`, '_blank')}
                  >
                    <IconPrint /> Gerar Apresentação
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <div className={styles.empty}>
              <p>Nenhuma ACM encontrada. Clique em &quot;+ Nova ACM&quot; para criar.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Detalhes ── */}
      {detailStudy && (
        <Modal
          isOpen
          onClose={() => setDetailStudy(null)}
          title={detailStudy.imovel}
          maxWidth="52rem"
          footer={
            <div className={styles.modal__footer}>
              <Button variant="tertiary" size="sm" onClick={() => handleDelete(detailStudy.id)}>Excluir ACM</Button>
              <div className={styles.modal__footer__right}>
                <Select
                  label=""
                  value={detailStudy.status}
                  onChange={e => handleStatusChange(detailStudy.id, e.target.value as StudyStatus)}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.open(`/apresentacao/${detailStudy.id}`, '_blank')}
                >
                  <IconPrint /> Gerar Apresentação
                </Button>
              </div>
            </div>
          }
        >
          <div className={styles.detail}>
            {/* Property info */}
            <div className={styles.detail__info}>
              <span>{detailStudy.bairro} · {detailStudy.tipo} · {detailStudy.areaM2} m² · {detailStudy.andar}</span>
              {detailStudy.dormitorios > 0 && <span>{detailStudy.dormitorios} dormitórios · {detailStudy.vagas} vagas</span>}
              <span>Proprietário: <strong>{detailStudy.proprietario}</strong></span>
            </div>

            {/* 3 prices */}
            <div className={styles.detail__prices}>
              <div className={cn(styles.detail__price, styles['detail__price--improvavel'])}>
                <span className={styles.detail__price__label}>Improvável</span>
                <span className={styles.detail__price__value}>{fmtBRL(detailStudy.precoImprovavel)}</span>
                <span className={styles.detail__price__m2}>{fmtBRL(Math.round(detailStudy.precoImprovavel / detailStudy.areaM2))}/m²</span>
              </div>
              <div className={cn(styles.detail__price, styles['detail__price--mercado'])}>
                <span className={styles.detail__price__label}>De Mercado ✦</span>
                <span className={styles.detail__price__value}>{fmtBRL(detailStudy.precoMercado)}</span>
                <span className={styles.detail__price__m2}>{fmtBRL(Math.round(detailStudy.precoMercado / detailStudy.areaM2))}/m²</span>
              </div>
              <div className={cn(styles.detail__price, styles['detail__price--competitivo'])}>
                <span className={styles.detail__price__label}>Competitivo</span>
                <span className={styles.detail__price__value}>{fmtBRL(detailStudy.precoCompetitivo)}</span>
                <span className={styles.detail__price__m2}>{fmtBRL(Math.round(detailStudy.precoCompetitivo / detailStudy.areaM2))}/m²</span>
              </div>
            </div>

            {/* Market context */}
            <div className={styles.detail__market}>
              <span className={styles.detail__market__label}>Média m² do bairro</span>
              <span className={styles.detail__market__value}>{fmtBRL(detailStudy.mediaM2Bairro)}/m²</span>
            </div>

            {/* Comparables table */}
            {detailStudy.comparaveis.length > 0 && (
              <div className={styles.detail__section}>
                <p className={styles.detail__section__title}>Imóveis comparáveis analisados</p>
                <div className={styles.table__wrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.table__th}>Endereço</th>
                        <th className={styles.table__th}>Área</th>
                        <th className={styles.table__th}>Dorms</th>
                        <th className={styles.table__th}>Transação</th>
                        <th className={styles.table__th}>Valor</th>
                        <th className={styles.table__th}>R$/m²</th>
                        <th className={styles.table__th}>Conservação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailStudy.comparaveis.map(c => (
                        <tr key={c.id} className={styles.table__tr}>
                          <td className={styles.table__td}>{c.endereco}</td>
                          <td className={styles.table__td}>{c.areaM2} m²</td>
                          <td className={styles.table__td}>{c.dormitorios > 0 ? c.dormitorios : '—'}</td>
                          <td className={styles.table__td}>
                            <span className={c.transacao === 'Venda' ? styles['badge--purple'] : styles['badge--blue']}>
                              {c.transacao}
                            </span>
                          </td>
                          <td className={styles.table__td}>{fmtBRL(c.valor)}</td>
                          <td className={styles.table__td}>{fmtBRL(c.precoM2)}</td>
                          <td className={styles.table__td}>{c.conservacao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notes */}
            {detailStudy.observacoes && (
              <div className={styles.detail__section}>
                <p className={styles.detail__section__title}>Observações</p>
                <p className={styles.detail__notes}>{detailStudy.observacoes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── Modal: Nova ACM ── */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => { setAddModalOpen(false); setForm(EMPTY_FORM) }}
        title="Nova Análise Comparativa de Mercado"
        maxWidth="40rem"
        footer={
          <div className={styles.modal__footer}>
            <Button variant="secondary" size="sm" onClick={() => { setAddModalOpen(false); setForm(EMPTY_FORM) }}>Cancelar</Button>
            <Button variant="primary"   size="sm" onClick={handleAdd}>Criar ACM</Button>
          </div>
        }
      >
        <form className={styles.form} onSubmit={handleAdd}>
          <Input
            label="Endereço do imóvel"
            placeholder="Ex: Rua dos Pinheiros, 450 — Apto 82"
            value={form.imovel}
            onChange={e => setForm(p => ({ ...p, imovel: e.target.value }))}
            required
          />
          <div className={styles.form__row}>
            <Input
              label="Bairro"
              placeholder="Ex: Pinheiros"
              value={form.bairro}
              onChange={e => setForm(p => ({ ...p, bairro: e.target.value }))}
              required
            />
            <Select
              label="Tipo"
              value={form.tipo}
              onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}
            >
              {TIPO_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          <div className={styles.form__row}>
            <Input label="Área (m²)"     type="number" placeholder="92"  value={form.areaM2}      onChange={e => setForm(p => ({ ...p, areaM2: e.target.value }))} />
            <Input label="Dormitórios"   type="number" placeholder="3"   value={form.dormitorios} onChange={e => setForm(p => ({ ...p, dormitorios: e.target.value }))} />
            <Input label="Vagas"         type="number" placeholder="2"   value={form.vagas}       onChange={e => setForm(p => ({ ...p, vagas: e.target.value }))} />
          </div>
          <div className={styles.form__row}>
            <Input label="Andar"         placeholder="Ex: 8º andar"       value={form.andar}       onChange={e => setForm(p => ({ ...p, andar: e.target.value }))} />
            <Input label="Proprietário"  placeholder="Nome completo"       value={form.proprietario} onChange={e => setForm(p => ({ ...p, proprietario: e.target.value }))} required />
          </div>
          <div className={styles.form__prices}>
            <Input label="Preço Improvável (R$)"  type="number" placeholder="1580000" value={form.precoImprovavel}  onChange={e => setForm(p => ({ ...p, precoImprovavel: e.target.value }))} required />
            <Input label="Preço de Mercado (R$)"  type="number" placeholder="1350000" value={form.precoMercado}     onChange={e => setForm(p => ({ ...p, precoMercado: e.target.value }))} required />
            <Input label="Preço Competitivo (R$)" type="number" placeholder="1190000" value={form.precoCompetitivo} onChange={e => setForm(p => ({ ...p, precoCompetitivo: e.target.value }))} required />
          </div>
          <Textarea
            label="Observações"
            placeholder="Estado de conservação, diferenciais, localização..."
            value={form.observacoes}
            onChange={e => setForm(p => ({ ...p, observacoes: e.target.value }))}
            rows={3}
          />
        </form>
      </Modal>
    </>
  )
}
