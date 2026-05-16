'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Input, { Textarea } from '@/components/ui/Input'
import CustomSelect from './CustomSelect'
import { analyses, addAnalise, fmtBRL, IMOVEIS_VENDIDOS, type AnaliseMercado } from '../_data'
import styles from './page.module.css'

/* ── Option lists ───────────────────────────────────────── */

const OPT_AGENDADO   = [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]
const OPT_TIPO       = [
  { value: 'Apartamento',    label: 'Apartamento' },
  { value: 'Casa',           label: 'Casa' },
  { value: 'Terreno/Lote',   label: 'Terreno / Lote' },
  { value: 'Sala Comercial', label: 'Sala Comercial' },
  { value: 'Rural',          label: 'Rural' },
]
const OPT_PADRAO     = [
  { value: 'Econômico', label: 'Econômico' },
  { value: 'Médio',     label: 'Médio' },
  { value: 'Alto',      label: 'Alto' },
  { value: 'Luxo',      label: 'Luxo' },
]
const OPT_DEMANDA    = [
  { value: 'Pouca demanda', label: 'Pouca demanda' },
  { value: 'Tem demanda',   label: 'Tem demanda' },
  { value: 'Muita demanda', label: 'Muita demanda' },
]
const OPT_INFRA      = [
  { value: 'Completa', label: 'Completa' },
  { value: 'Parcial',  label: 'Parcial' },
  { value: 'Básica',   label: 'Básica' },
]
const OPT_ANDAR      = [
  { value: 'Térreo/1º andar', label: 'Térreo/1º andar' },
  { value: '2º andar',        label: '2º andar' },
  { value: 'Intermediário',   label: 'Intermediário' },
  { value: 'Último andar',    label: 'Último andar' },
]
const OPT_ELEVADOR   = [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]
const OPT_SOLAR      = [
  { value: 'Norte',    label: 'Norte' },
  { value: 'Sul',      label: 'Sul' },
  { value: 'Leste',    label: 'Leste' },
  { value: 'Oeste',    label: 'Oeste' },
  { value: 'Nordeste', label: 'Nordeste' },
  { value: 'Noroeste', label: 'Noroeste' },
  { value: 'Sudeste',  label: 'Sudeste' },
  { value: 'Sudoeste', label: 'Sudoeste' },
]
const OPT_PORTARIA   = [
  { value: '24h',          label: '24h' },
  { value: 'Parcial',      label: 'Parcial' },
  { value: 'Eletrônica',   label: 'Eletrônica' },
  { value: 'Sem portaria', label: 'Sem portaria' },
]
const OPT_VISTA      = [
  { value: 'sim',     label: 'Sim' },
  { value: 'parcial', label: 'Parcial' },
  { value: 'nao',     label: 'Não' },
]
const OPT_CONSERV    = [
  { value: 'Nova',               label: 'Nova' },
  { value: 'Ótima',              label: 'Ótima' },
  { value: 'Boa',                label: 'Boa' },
  { value: 'Regular',            label: 'Regular' },
  { value: 'Precisa de reforma', label: 'Precisa de reforma' },
]
const OPT_MOBILIADO  = [
  { value: 'sim',               label: 'Sim' },
  { value: 'nao',               label: 'Não' },
  { value: 'mobiliado-completo', label: 'Mobiliado completo' },
]

/* ── Types ──────────────────────────────────────────────── */

interface SampleRow { id: string; url: string; descricao: string; areaM2: string; valorAnunciado: string }

const FORM_DEFAULTS = {
  proprietario: '', telefone: '', dataVisita: '', tempoVenda: '', motivacao: '',
  apresentacaoAgendada: '', linkAnuncio: '',
  cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: 'Santa Maria', estado: 'RS',
  tipo: '', padrao: '', areaPrivativa: '',
  dormitorios: '', suites: '', banheiros: '', vagas: '', anoConstrucao: '',
  localizacaoDemanda: '', infraestrutura: '', andar: '', elevador: '',
  orientacaoSolar: '', portaria: '', vistaPanoramica: '', conservacao: '',
  semiMobiliado: '', valorAnunciadoProp: '', observacoes: '',
  bairroVendidos: '',
}

/* ── Helpers ────────────────────────────────────────────── */

function getPrecos(samples: SampleRow[], areaPrivativa: string) {
  const area  = parseFloat(areaPrivativa) || 0
  const valid = samples.filter(s => parseFloat(s.areaM2) > 0 && parseFloat(s.valorAnunciado) > 0)
  if (!valid.length || !area) return { improvavel: 0, mercado: 0, competitivo: 0 }
  const mediaM2    = valid.reduce((s, r) => s + parseFloat(r.valorAnunciado) / parseFloat(r.areaM2), 0) / valid.length
  const improvavel = Math.round(mediaM2 * area)
  return { improvavel, mercado: Math.round(improvavel * 0.93), competitivo: Math.round(improvavel * 0.85) }
}

function newSample(): SampleRow {
  return { id: `s-${Date.now()}-${Math.random()}`, url: '', descricao: '', areaM2: '', valorAnunciado: '' }
}

/* ── Sold properties sub-component ─────────────────────── */

function VendidosTable({ bairro }: { bairro: string }) {
  const rows = bairro ? IMOVEIS_VENDIDOS.filter(v => v.bairro.toLowerCase().includes(bairro.toLowerCase())) : []
  if (!bairro)       return <p className={styles.vendidos__hint}>Informe o bairro acima para ver imóveis vendidos na região.</p>
  if (!rows.length)  return <p className={styles.vendidos__hint}>Nenhum imóvel vendido registrado em "{bairro}".</p>
  return (
    <div className={styles.table__wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Endereço</th>
            <th className={styles.th}>Tipo</th>
            <th className={styles.th}>Área m²</th>
            <th className={styles.th}>Dorms</th>
            <th className={styles.th}>Valor Venda</th>
            <th className={styles.th}>R$/m²</th>
            <th className={styles.th}>Data</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(v => (
            <tr key={v.id} className={styles.tr}>
              <td className={styles.td}>{v.endereco}</td>
              <td className={styles.td}>{v.tipo}</td>
              <td className={cn(styles.td, styles['td--num'])}>{v.areaM2} m²</td>
              <td className={cn(styles.td, styles['td--num'])}>{v.dormitorios}</td>
              <td className={cn(styles.td, styles['td--value'])}>{fmtBRL(v.valorVenda)}</td>
              <td className={cn(styles.td, styles['td--value'])}>{fmtBRL(v.valorM2)}</td>
              <td className={styles.td}>{v.dataVenda}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */

export default function NovaAnalisePage() {
  const router = useRouter()

  const [form,    setForm]    = useState({ ...FORM_DEFAULTS })
  const [samples, setSamples] = useState<SampleRow[]>([])
  const [showImprovavel,  setShowImprovavel]  = useState(true)
  const [showMercado,     setShowMercado]     = useState(true)
  const [showCompetitivo, setShowCompetitivo] = useState(true)
  const [cepLoading, setCepLoading] = useState(false)

  /* Handlers for native inputs */
  const set = (field: keyof typeof FORM_DEFAULTS) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }))

  /* Handler for CustomSelect (receives value string directly) */
  const setField = (field: keyof typeof FORM_DEFAULTS) => (value: string) =>
    setForm(p => ({ ...p, [field]: value }))

  const isApto = form.tipo === 'Apartamento'
  const precos = getPrecos(samples, form.areaPrivativa)

  /* ── CEP auto-fill ── */
  async function buscarCep() {
    const digits = form.cep.replace(/\D/g, '')
    if (digits.length !== 8) return
    setCepLoading(true)
    try {
      const res  = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm(p => ({
          ...p,
          rua:    data.logradouro || p.rua,
          bairro: data.bairro     || p.bairro,
          cidade: data.localidade || p.cidade,
          estado: data.uf         || p.estado,
        }))
      }
    } catch {
      /* silently fail — user can fill fields manually */
    } finally {
      setCepLoading(false)
    }
  }

  function updateSample(id: string, field: keyof SampleRow, value: string) {
    setSamples(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  function handleSave(navigateToPdf = false) {
    const newId     = `AM${String(analyses.length + 100).padStart(3, '0')}`
    const newAnalise: AnaliseMercado = {
      id:         newId,
      status:     'Criado',
      criadoEm:   new Date().toLocaleDateString('pt-BR'),
      corretor:   'Ana Lima',
      proprietario:         form.proprietario   || 'Proprietário',
      telefone:             form.telefone,
      dataVisita:           form.dataVisita,
      tempoVenda:           form.tempoVenda,
      motivacao:            form.motivacao,
      apresentacaoAgendada: form.apresentacaoAgendada === 'sim',
      linkAnuncio:          form.linkAnuncio,
      cep:         form.cep,
      rua:         form.rua         || 'Endereço não informado',
      numero:      form.numero,
      complemento: form.complemento,
      bairro:      form.bairro      || 'Bairro',
      cidade:      form.cidade      || 'Santa Maria',
      estado:      form.estado      || 'RS',
      tipo:        (form.tipo       || 'Apartamento') as AnaliseMercado['tipo'],
      padrao:      (form.padrao     || 'Médio') as AnaliseMercado['padrao'],
      areaPrivativa: parseFloat(form.areaPrivativa) || 0,
      dormitorios:   form.dormitorios   ? parseInt(form.dormitorios)   : undefined,
      suites:        form.suites        ? parseInt(form.suites)        : undefined,
      banheiros:     form.banheiros     ? parseInt(form.banheiros)     : undefined,
      vagas:         form.vagas         ? parseInt(form.vagas)         : undefined,
      anoConstrucao: form.anoConstrucao ? parseInt(form.anoConstrucao) : undefined,
      localizacaoDemanda: form.localizacaoDemanda || undefined,
      infraestrutura:     form.infraestrutura     || undefined,
      andar:              form.andar              || undefined,
      elevador:           form.elevador === 'sim' ? true : form.elevador === 'nao' ? false : undefined,
      orientacaoSolar:    form.orientacaoSolar    || undefined,
      portaria:           form.portaria           || undefined,
      vistaPanoramica:    form.vistaPanoramica === 'nao' ? false
                          : form.vistaPanoramica ? true : undefined,
      conservacao:        form.conservacao        || undefined,
      semiMobiliado:      form.semiMobiliado === 'nao' ? false
                          : form.semiMobiliado ? true : undefined,
      valorAnunciadoProp: form.valorAnunciadoProp
        ? parseFloat(form.valorAnunciadoProp.replace(/\D/g, '')) : undefined,
      observacoes: form.observacoes || undefined,
      amostras: samples
        .filter(s => s.areaM2 && s.valorAnunciado)
        .map(s => ({
          id:             s.id,
          url:            s.url,
          descricao:      s.descricao,
          areaM2:         parseFloat(s.areaM2),
          valorAnunciado: parseFloat(s.valorAnunciado),
          valorM2:        Math.round(parseFloat(s.valorAnunciado) / parseFloat(s.areaM2)),
        })),
      precoImprovavel:  precos.improvavel,
      precoMercado:     precos.mercado,
      precoCompetitivo: precos.competitivo,
      showImprovavel, showMercado, showCompetitivo,
    }
    addAnalise(newAnalise)
    router.push(navigateToPdf ? `/analise-pdf/${newId}` : `/analise-mercado/${newId}`)
  }

  return (
    <>
      <Topbar
        title="Nova Análise de Mercado"
        actions={
          <Button variant="secondary" size="sm" onClick={() => router.push('/analise-mercado')}>
            Cancelar
          </Button>
        }
      />

      <div className={styles.page}>

        {/* ── Section 1: Dados do Proprietário ── */}
        <Card>
          <CardHeader><span className={styles.section__title}>Dados do Proprietário</span></CardHeader>
          <CardBody>
            <div className={styles.form}>
              <div className={styles.row__2}>
                <Input label="Nome do Proprietário" required value={form.proprietario} onChange={set('proprietario')} placeholder="Nome completo" />
                <Input label="Telefone" required type="tel" value={form.telefone} onChange={set('telefone')} placeholder="(55) 9 9999-9999" />
              </div>
              <div className={styles.row__2}>
                <Input label="Data da Visita" required type="date" value={form.dataVisita} onChange={set('dataVisita')} />
                <Input label="Tempo à venda" value={form.tempoVenda} onChange={set('tempoVenda')} placeholder="Ex: 6 meses" />
              </div>
              <div className={styles.row__2}>
                <Input label="Motivação de venda" value={form.motivacao} onChange={set('motivacao')} placeholder="Ex: Mudança de cidade" />
                <CustomSelect
                  label="Apresentação agendada?"
                  value={form.apresentacaoAgendada}
                  onChange={setField('apresentacaoAgendada')}
                  options={OPT_AGENDADO}
                />
              </div>
              <div>
                <Input label="Link do anúncio" value={form.linkAnuncio} onChange={set('linkAnuncio')} placeholder="https://www.zapimoveis.com.br/..." />
                <p className={styles.note__red}>
                  Se não inserir o link do anúncio, as fotos devem ser enviadas pelo sistema com a identificação de qual estudo se refere.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* ── Section 2: Localização ── */}
        <Card>
          <CardHeader><span className={styles.section__title}>Localização do Imóvel</span></CardHeader>
          <CardBody>
            <div className={styles.form}>
              <div className={styles.row__cep}>
                <div className={styles.cep__field}>
                  <Input label="CEP" value={form.cep} onChange={set('cep')} placeholder="97000-000" />
                </div>
                <div className={styles.cep__btn_wrap}>
                  <button
                    type="button"
                    className={styles.cep__btn}
                    onClick={buscarCep}
                    disabled={cepLoading || form.cep.replace(/\D/g, '').length !== 8}
                    aria-label="Buscar CEP"
                  >
                    {cepLoading ? (
                      <span className={styles.cep__spinner} />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className={styles.row__addr}>
                <Input label="Rua" required value={form.rua} onChange={set('rua')} placeholder="Nome da rua" />
                <Input label="Número" required value={form.numero} onChange={set('numero')} placeholder="123" />
                <Input label="Complemento" value={form.complemento} onChange={set('complemento')} placeholder="Apto 101" />
              </div>
              <div className={styles.row__3}>
                <Input label="Bairro" required value={form.bairro} onChange={set('bairro')} placeholder="Camobi" />
                <Input label="Cidade" required value={form.cidade} onChange={set('cidade')} />
                <Input label="Estado" required value={form.estado} onChange={set('estado')} placeholder="RS" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* ── Section 3: Dados do Imóvel ── */}
        <Card>
          <CardHeader><span className={styles.section__title}>Dados do Imóvel</span></CardHeader>
          <CardBody>
            <div className={styles.form}>
              <div className={styles.row__3}>
                <CustomSelect
                  label="Tipo do Imóvel"
                  required
                  value={form.tipo}
                  onChange={setField('tipo')}
                  options={OPT_TIPO}
                />
                <CustomSelect
                  label="Padrão"
                  required
                  value={form.padrao}
                  onChange={setField('padrao')}
                  options={OPT_PADRAO}
                />
                <Input label="Área Privativa m²" required type="number" placeholder="98" value={form.areaPrivativa} onChange={set('areaPrivativa')} />
              </div>

              {isApto && (
                <>
                  {/* Row 1 — numeric characteristics */}
                  <div className={styles.row__5}>
                    <Input label="Dormitórios"    type="number" placeholder="3"    value={form.dormitorios}   onChange={set('dormitorios')} />
                    <Input label="Suítes"         type="number" placeholder="1"    value={form.suites}        onChange={set('suites')} />
                    <Input label="Banheiros"      type="number" placeholder="2"    value={form.banheiros}     onChange={set('banheiros')} />
                    <Input label="Vagas"          type="number" placeholder="1"    value={form.vagas}         onChange={set('vagas')} />
                    <Input label="Ano Construção" type="number" placeholder="2015" value={form.anoConstrucao} onChange={set('anoConstrucao')} />
                  </div>

                  {/* Row 2 — location / infrastructure */}
                  <div className={styles.row__3}>
                    <CustomSelect
                      label="Localização (Demanda)"
                      value={form.localizacaoDemanda}
                      onChange={setField('localizacaoDemanda')}
                      options={OPT_DEMANDA}
                    />
                    <CustomSelect
                      label="Infraestrutura"
                      value={form.infraestrutura}
                      onChange={setField('infraestrutura')}
                      options={OPT_INFRA}
                    />
                    <CustomSelect
                      label="Portaria"
                      value={form.portaria}
                      onChange={setField('portaria')}
                      options={OPT_PORTARIA}
                    />
                  </div>

                  {/* Row 3 — building details */}
                  <div className={styles.row__4}>
                    <CustomSelect
                      label="Andar"
                      value={form.andar}
                      onChange={setField('andar')}
                      options={OPT_ANDAR}
                    />
                    <CustomSelect
                      label="Elevador"
                      value={form.elevador}
                      onChange={setField('elevador')}
                      options={OPT_ELEVADOR}
                    />
                    <CustomSelect
                      label="Orientação Solar"
                      value={form.orientacaoSolar}
                      onChange={setField('orientacaoSolar')}
                      options={OPT_SOLAR}
                    />
                    <CustomSelect
                      label="Vista Panorâmica"
                      value={form.vistaPanoramica}
                      onChange={setField('vistaPanoramica')}
                      options={OPT_VISTA}
                    />
                  </div>

                  {/* Row 4 — condition / furnishing / asking price */}
                  <div className={styles.row__3}>
                    <CustomSelect
                      label="Conservação"
                      value={form.conservacao}
                      onChange={setField('conservacao')}
                      options={OPT_CONSERV}
                    />
                    <CustomSelect
                      label="Semi Mobiliado"
                      value={form.semiMobiliado}
                      onChange={setField('semiMobiliado')}
                      options={OPT_MOBILIADO}
                    />
                    <Input label="Valor Anunciado (R$)" type="number" placeholder="450000" value={form.valorAnunciadoProp} onChange={set('valorAnunciadoProp')} />
                  </div>

                  {/* Full-width observations */}
                  <Textarea label="Observações" value={form.observacoes} onChange={set('observacoes')} rows={3} placeholder="Informações adicionais sobre o imóvel..." />
                </>
              )}
            </div>
          </CardBody>
        </Card>

        {/* ── Section 4: Amostras de Mercado ── */}
        <Card>
          <CardHeader>
            <span className={styles.section__title}>Amostras de Mercado</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSamples(p => p.length < 15 ? [...p, newSample()] : p)}
              style={{ marginLeft: 'auto' }}
            >
              + Adicionar Amostra
            </Button>
          </CardHeader>
          <CardBody>
            {samples.length === 0 ? (
              <p className={styles.samples__empty}>
                Nenhuma amostra adicionada. Clique em "+ Adicionar Amostra" para começar.
              </p>
            ) : (
              <div className={styles.samples__list}>
                {samples.map((s, idx) => {
                  const m2 = parseFloat(s.areaM2) > 0 && parseFloat(s.valorAnunciado) > 0
                    ? Math.round(parseFloat(s.valorAnunciado) / parseFloat(s.areaM2))
                    : null
                  return (
                    <div key={s.id} className={styles.sample__card}>
                      <div className={styles.sample__header}>
                        <span className={styles.sample__num}>Amostra {idx + 1}</span>
                        {m2 !== null && <span className={styles.sample__m2}>{fmtBRL(m2)}/m²</span>}
                        <button
                          type="button"
                          className={styles.sample__remove}
                          onClick={() => setSamples(p => p.filter(x => x.id !== s.id))}
                          aria-label="Remover amostra"
                        >×</button>
                      </div>
                      <Input label="URL / Link do anúncio" value={s.url} onChange={e => updateSample(s.id, 'url', e.target.value)} placeholder="https://www.zapimoveis.com.br/..." />
                      <div className={styles.row__3}>
                        <Input label="Descrição" value={s.descricao} onChange={e => updateSample(s.id, 'descricao', e.target.value)} placeholder="Apt 3D/2B, 95m², Camobi" />
                        <Input label="Área m²" type="number" value={s.areaM2} onChange={e => updateSample(s.id, 'areaM2', e.target.value)} placeholder="95" />
                        <Input label="Valor Anunciado (R$)" type="number" value={s.valorAnunciado} onChange={e => updateSample(s.id, 'valorAnunciado', e.target.value)} placeholder="390000" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>

        {/* ── Section 5: Valores Encontrados ── */}
        <div className={styles.precos__grid}>
          <div className={styles.preco__card}>
            <span className={styles['preco__badge--improvavel']}>Preço Improvável</span>
            <p className={cn(styles.preco__value, styles['preco__value--improvavel'])}>
              {precos.improvavel > 0 ? fmtBRL(precos.improvavel) : '—'}
            </p>
            <p className={styles.preco__formula}>
              Média do m² pesquisado × área priv. do imóvel avaliado, sem ajuste de variáveis.
            </p>
            <label className={styles.preco__toggle}>
              <input type="checkbox" checked={showImprovavel} onChange={e => setShowImprovavel(e.target.checked)} />
              <span>Mostrar na apresentação</span>
            </label>
          </div>

          <div className={cn(styles.preco__card, styles['preco__card--mercado'])}>
            <span className={styles['preco__badge--mercado']}>Preço de Mercado</span>
            <p className={cn(styles.preco__value, styles['preco__value--mercado'])}>
              {precos.mercado > 0 ? fmtBRL(precos.mercado) : '—'}
            </p>
            <p className={styles['preco__formula--mercado']}>
              Valor Improvável decrescido de 7%.
            </p>
            <label className={cn(styles.preco__toggle, styles['preco__toggle--mercado'])}>
              <input type="checkbox" checked={showMercado} onChange={e => setShowMercado(e.target.checked)} />
              <span>Mostrar na apresentação</span>
            </label>
          </div>

          <div className={styles.preco__card}>
            <span className={styles['preco__badge--competitivo']}>Preço Competitivo</span>
            <p className={cn(styles.preco__value, styles['preco__value--competitivo'])}>
              {precos.competitivo > 0 ? fmtBRL(precos.competitivo) : '—'}
            </p>
            <p className={styles.preco__formula}>
              Valor Improvável decrescido de 15%.
            </p>
            <label className={styles.preco__toggle}>
              <input type="checkbox" checked={showCompetitivo} onChange={e => setShowCompetitivo(e.target.checked)} />
              <span>Mostrar na apresentação</span>
            </label>
          </div>
        </div>

        {/* ── Section 6: Imóveis Vendidos ── */}
        <Card>
          <CardHeader><span className={styles.section__title}>Imóveis Vendidos na Região</span></CardHeader>
          <CardBody>
            <div className={styles.form}>
              <div style={{ maxWidth: '20rem' }}>
                <Input
                  label="Bairro para pesquisa"
                  value={form.bairroVendidos}
                  onChange={set('bairroVendidos')}
                  placeholder="Ex: Camobi"
                />
              </div>
              <VendidosTable bairro={form.bairroVendidos} />
            </div>
          </CardBody>
        </Card>

        {/* ── Actions ── */}
        <div className={styles.form__actions}>
          <Button variant="secondary" onClick={() => handleSave(false)}>
            Salvar Rascunho
          </Button>
          <Button variant="primary" onClick={() => handleSave(true)}>
            Gerar Apresentação PDF
          </Button>
        </div>

      </div>
    </>
  )
}
