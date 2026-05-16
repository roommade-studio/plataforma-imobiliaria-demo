'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import { getAnalise, updateStatus, deleteAnalise, fmtBRL, IMOVEIS_VENDIDOS, type AnaliseStatus } from '../_data'
import styles from './page.module.css'

/* ── Status flow ────────────────────────────────────────── */

const NEXT_STATUS: Partial<Record<AnaliseStatus, AnaliseStatus>> = {
  Criado:      'Apresentado',
  Apresentado: 'Assinado',
  Assinado:    'Vendido',
}

const STATUS_COLORS: Record<AnaliseStatus, string> = {
  Criado:      styles['badge--gray'],
  Apresentado: styles['badge--blue'],
  Assinado:    styles['badge--yellow'],
  Vendido:     styles['badge--green'],
  Suspenso:    styles['badge--red'],
}

function Dl({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.dl__row}>
      <dt className={styles.dl__key}>{label}</dt>
      <dd className={styles.dl__val}>{value ?? '—'}</dd>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */

export default function AnaliseDetailPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()
  const [analise, setAnalise]           = useState(() => getAnalise(id))
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function handleDelete() {
    deleteAnalise(id)
    router.push('/analise-mercado')
  }

  if (!analise) {
    return (
      <>
        <Topbar title="Análise não encontrada" actions={
          <Button variant="secondary" size="sm" onClick={() => router.push('/analise-mercado')}>Voltar</Button>
        } />
        <div className={styles.not_found}>
          <p>Esta análise não foi encontrada.</p>
          <Button onClick={() => router.push('/analise-mercado')}>Ver todas as análises</Button>
        </div>
      </>
    )
  }

  function advanceStatus() {
    const next = NEXT_STATUS[analise!.status]
    if (!next) return
    updateStatus(analise!.id, next)
    setAnalise(prev => prev ? { ...prev, status: next } : prev)
  }

  function suspendAnalise() {
    updateStatus(analise!.id, 'Suspenso')
    setAnalise(prev => prev ? { ...prev, status: 'Suspenso' } : prev)
  }

  const next     = NEXT_STATUS[analise.status]
  const isApto   = analise.tipo === 'Apartamento'
  const bairroVendidos = analise.bairro
  const vendidos = IMOVEIS_VENDIDOS.filter(v => v.bairro.toLowerCase() === bairroVendidos.toLowerCase())

  return (
    <>
      <Topbar
        title={`${analise.rua}, ${analise.numero}${analise.complemento ? ` — ${analise.complemento}` : ''}`}
        actions={
          <div className={styles.topbar__actions}>
            <Button variant="secondary" size="sm" onClick={() => router.push('/analise-mercado')}>
              ← Voltar
            </Button>
            {analise.status !== 'Suspenso' && analise.status !== 'Vendido' && (
              <Button variant="secondary" size="sm" onClick={suspendAnalise}>
                Suspender
              </Button>
            )}
            {next && (
              <Button variant="secondary" size="sm" onClick={advanceStatus}>
                Marcar como {next}
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={() => router.push(`/analise-pdf/${analise.id}`)}>
              Gerar PDF
            </Button>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
              Excluir
            </Button>
          </div>
        }
      />

      <div className={styles.page}>
        {/* Status bar */}
        <div className={styles.status__bar}>
          {(['Criado','Apresentado','Assinado','Vendido'] as AnaliseStatus[]).map((s, i) => (
            <div key={s} className={cn(styles.status__step, analise.status === s && styles['status__step--active'], analise.status === 'Suspenso' && styles['status__step--dim'])}>
              <div className={styles.status__dot} />
              {i < 3 && <div className={styles.status__line} />}
              <span className={styles.status__label}>{s}</span>
            </div>
          ))}
          {analise.status === 'Suspenso' && (
            <span className={cn(styles.badge, styles['badge--red'])} style={{ marginLeft: 'auto' }}>Suspenso</span>
          )}
        </div>

        {/* Proprietário + Imóvel */}
        <div className={styles.grid__2}>
          <Card>
            <CardHeader><span className={styles.card__title}>Proprietário</span></CardHeader>
            <CardBody>
              <dl className={styles.dl}>
                <Dl label="Nome"                 value={analise.proprietario} />
                <Dl label="Telefone"             value={analise.telefone} />
                <Dl label="Data da visita"       value={analise.dataVisita} />
                <Dl label="Tempo à venda"        value={analise.tempoVenda} />
                <Dl label="Motivação"            value={analise.motivacao} />
                <Dl label="Apresentação agendada" value={analise.apresentacaoAgendada ? 'Sim' : 'Não'} />
                {analise.linkAnuncio && (
                  <Dl label="Link anúncio" value={
                    <a href={analise.linkAnuncio} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      {analise.linkAnuncio.replace(/^https?:\/\//, '').split('/')[0]}
                    </a>
                  } />
                )}
              </dl>
            </CardBody>
          </Card>
          <Card>
            <CardHeader><span className={styles.card__title}>Imóvel</span></CardHeader>
            <CardBody>
              <dl className={styles.dl}>
                <Dl label="Endereço" value={`${analise.rua}, ${analise.numero}${analise.complemento ? `, ${analise.complemento}` : ''}`} />
                <Dl label="Bairro"   value={`${analise.bairro} — ${analise.cidade}/${analise.estado}`} />
                <Dl label="Tipo"     value={analise.tipo} />
                <Dl label="Padrão"   value={analise.padrao} />
                <Dl label="Área"     value={`${analise.areaPrivativa} m²`} />
                {isApto && <>
                  {analise.dormitorios !== undefined && <Dl label="Dormitórios" value={`${analise.dormitorios}D / ${analise.suites ?? 0}S / ${analise.banheiros ?? 0}B / ${analise.vagas ?? 0}V`} />}
                  {analise.anoConstrucao && <Dl label="Ano construção" value={analise.anoConstrucao} />}
                  {analise.andar         && <Dl label="Andar"          value={analise.andar} />}
                  {analise.elevador !== undefined && <Dl label="Elevador" value={analise.elevador ? 'Sim' : 'Não'} />}
                  {analise.orientacaoSolar && <Dl label="Orientação solar" value={analise.orientacaoSolar} />}
                  {analise.portaria        && <Dl label="Portaria"         value={analise.portaria} />}
                  {analise.conservacao     && <Dl label="Conservação"      value={analise.conservacao} />}
                  {analise.valorAnunciadoProp !== undefined && <Dl label="Valor anunciado" value={fmtBRL(analise.valorAnunciadoProp)} />}
                </>}
                {analise.observacoes && <Dl label="Obs." value={analise.observacoes} />}
              </dl>
            </CardBody>
          </Card>
        </div>

        {/* Preços */}
        <div className={styles.precos__grid}>
          <div className={styles.preco__card}>
            <span className={styles['preco__label--improvavel']}>Preço Improvável</span>
            <p className={cn(styles.preco__value, styles['preco__value--improvavel'])}>{fmtBRL(analise.precoImprovavel)}</p>
            <p className={styles.preco__sub}>{analise.precoImprovavel > 0 && analise.areaPrivativa > 0 ? `${fmtBRL(Math.round(analise.precoImprovavel / analise.areaPrivativa))}/m²` : ''}</p>
          </div>
          <div className={cn(styles.preco__card, styles['preco__card--mercado'])}>
            <span className={styles['preco__label--mercado']}>Preço de Mercado</span>
            <p className={cn(styles.preco__value, styles['preco__value--mercado'])}>{fmtBRL(analise.precoMercado)}</p>
            <p className={styles['preco__sub--mercado']}>{analise.precoMercado > 0 && analise.areaPrivativa > 0 ? `${fmtBRL(Math.round(analise.precoMercado / analise.areaPrivativa))}/m²` : ''}</p>
          </div>
          <div className={styles.preco__card}>
            <span className={styles['preco__label--competitivo']}>Preço Competitivo</span>
            <p className={cn(styles.preco__value, styles['preco__value--competitivo'])}>{fmtBRL(analise.precoCompetitivo)}</p>
            <p className={styles.preco__sub}>{analise.precoCompetitivo > 0 && analise.areaPrivativa > 0 ? `${fmtBRL(Math.round(analise.precoCompetitivo / analise.areaPrivativa))}/m²` : ''}</p>
          </div>
        </div>

        {/* Amostras */}
        {analise.amostras.length > 0 && (
          <Card>
            <CardHeader><span className={styles.card__title}>Amostras de Mercado ({analise.amostras.length})</span></CardHeader>
            <CardBody>
              <div className={styles.table__wrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>#</th>
                      <th className={styles.th}>Descrição</th>
                      <th className={styles.th}>Área m²</th>
                      <th className={styles.th}>Valor Anunciado</th>
                      <th className={styles.th}>R$/m²</th>
                      <th className={styles.th}>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analise.amostras.map((a, i) => (
                      <tr key={a.id} className={styles.tr}>
                        <td className={cn(styles.td, styles['td--num'])}>{i + 1}</td>
                        <td className={styles.td}>{a.descricao || '—'}</td>
                        <td className={cn(styles.td, styles['td--num'])}>{a.areaM2} m²</td>
                        <td className={cn(styles.td, styles['td--value'])}>{fmtBRL(a.valorAnunciado)}</td>
                        <td className={cn(styles.td, styles['td--value'])}>{fmtBRL(a.valorM2)}</td>
                        <td className={styles.td}>
                          {a.url ? (
                            <a href={a.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                              {a.url.replace(/^https?:\/\//, '').split('/')[0]}
                            </a>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Vendidos na região */}
        {vendidos.length > 0 && (
          <Card>
            <CardHeader><span className={styles.card__title}>Vendidos na Região — {analise.bairro}</span></CardHeader>
            <CardBody>
              <div className={styles.table__wrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Endereço</th>
                      <th className={styles.th}>Tipo</th>
                      <th className={styles.th}>Área m²</th>
                      <th className={styles.th}>Valor Venda</th>
                      <th className={styles.th}>R$/m²</th>
                      <th className={styles.th}>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendidos.map(v => (
                      <tr key={v.id} className={styles.tr}>
                        <td className={styles.td}>{v.endereco}</td>
                        <td className={styles.td}>{v.tipo}</td>
                        <td className={cn(styles.td, styles['td--num'])}>{v.areaM2} m²</td>
                        <td className={cn(styles.td, styles['td--value'])}>{fmtBRL(v.valorVenda)}</td>
                        <td className={cn(styles.td, styles['td--value'])}>{fmtBRL(v.valorM2)}</td>
                        <td className={styles.td}>{v.dataVenda}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir análise"
        maxWidth="26rem"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Excluir
            </Button>
          </>
        }
      >
        <p className={styles.delete__msg}>
          Tem certeza que deseja excluir esta análise? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </>
  )
}
