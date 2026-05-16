'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  getAnalise, fmtBRL, IMOVEIS_VENDIDOS,
  type AnaliseMercado,
} from '@/app/(dashboard)/analise-mercado/_data'
import styles from './page.module.css'

/* ── Helper: definition row ─────────────────────────────── */

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null
  return (
    <div className={styles.row}>
      <span className={styles.row__label}>{label}</span>
      <span className={styles.row__value}>{value}</span>
    </div>
  )
}

/* ── Helper: section heading ─────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={styles.section__title}>{children}</h2>
}

/* ── PDF Content ────────────────────────────────────────── */

function PdfContent({ analise }: { analise: AnaliseMercado }) {
  const isApto     = analise.tipo === 'Apartamento'
  const vendidos   = IMOVEIS_VENDIDOS.filter(v =>
    v.bairro.toLowerCase() === analise.bairro.toLowerCase()
  )
  const todayStr   = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const endereco   = `${analise.rua}, ${analise.numero}${analise.complemento ? `, ${analise.complemento}` : ''}`

  const mediaM2    = analise.amostras.length
    ? Math.round(analise.amostras.reduce((s, a) => s + a.valorM2, 0) / analise.amostras.length)
    : 0

  return (
    <div className={styles.pdf}>

      {/* ── Cover ── */}
      <div className={styles.cover}>
        <div className={styles.cover__brand}>
          <span className={styles.cover__brand__label}>ANÁLISE DE MERCADO</span>
          <span className={styles.cover__brand__doc}>Relatório de Precificação</span>
        </div>

        <div className={styles.cover__body}>
          <p className={styles.cover__type}>{analise.tipo} · {analise.padrao} · {analise.bairro}</p>
          <h1 className={styles.cover__address}>{endereco}</h1>
          <p className={styles.cover__city}>{analise.bairro} — {analise.cidade}/{analise.estado}</p>

          <div className={styles.cover__meta}>
            <div className={styles.cover__meta__item}>
              <span className={styles.cover__meta__label}>Proprietário</span>
              <span className={styles.cover__meta__value}>{analise.proprietario}</span>
            </div>
            <div className={styles.cover__meta__item}>
              <span className={styles.cover__meta__label}>Corretor Responsável</span>
              <span className={styles.cover__meta__value}>{analise.corretor}</span>
            </div>
            <div className={styles.cover__meta__item}>
              <span className={styles.cover__meta__label}>Data</span>
              <span className={styles.cover__meta__value}>{todayStr}</span>
            </div>
            <div className={styles.cover__meta__item}>
              <span className={styles.cover__meta__label}>Referência</span>
              <span className={styles.cover__meta__value}>{analise.id}</span>
            </div>
          </div>
        </div>

        <div className={styles.cover__footer}>
          <span>Sistema Prioridade · Análise de Mercado Imobiliário</span>
        </div>
      </div>

      {/* ── 1. Dados do Proprietário ── */}
      <div className={styles.section}>
        <SectionTitle>1. Dados do Proprietário</SectionTitle>
        <div className={styles.rows}>
          <Row label="Nome"                  value={analise.proprietario} />
          <Row label="Telefone"              value={analise.telefone} />
          <Row label="Data da visita"        value={analise.dataVisita} />
          <Row label="Tempo à venda"         value={analise.tempoVenda} />
          <Row label="Motivação"             value={analise.motivacao} />
          <Row label="Apresentação agendada" value={analise.apresentacaoAgendada ? 'Sim' : 'Não'} />
          {analise.linkAnuncio && (
            <Row label="Link anúncio" value={analise.linkAnuncio.replace(/^https?:\/\//, '').split('/')[0]} />
          )}
        </div>
      </div>

      {/* ── 2. Características do Imóvel ── */}
      <div className={styles.section}>
        <SectionTitle>2. Características do Imóvel</SectionTitle>
        <div className={styles.rows}>
          <Row label="Endereço"  value={endereco} />
          <Row label="Bairro"    value={`${analise.bairro} — ${analise.cidade}/${analise.estado}`} />
          <Row label="Tipo"      value={analise.tipo} />
          <Row label="Padrão"    value={analise.padrao} />
          <Row label="Área"      value={`${analise.areaPrivativa} m²`} />
          {isApto && analise.dormitorios !== undefined && (
            <Row label="Composição" value={`${analise.dormitorios} dorm. / ${analise.suites ?? 0} suítes / ${analise.banheiros ?? 0} ban. / ${analise.vagas ?? 0} vagas`} />
          )}
          {isApto && analise.anoConstrucao && <Row label="Ano construção"   value={analise.anoConstrucao} />}
          {isApto && analise.andar         && <Row label="Andar"            value={analise.andar} />}
          {isApto && analise.elevador !== undefined && <Row label="Elevador" value={analise.elevador ? 'Sim' : 'Não'} />}
          {isApto && analise.orientacaoSolar && <Row label="Orientação solar"  value={analise.orientacaoSolar} />}
          {isApto && analise.portaria        && <Row label="Portaria"          value={analise.portaria} />}
          {isApto && analise.conservacao     && <Row label="Conservação"       value={analise.conservacao} />}
          {isApto && analise.infraestrutura  && <Row label="Infraestrutura"    value={analise.infraestrutura} />}
          {isApto && analise.localizacaoDemanda && <Row label="Demanda"        value={analise.localizacaoDemanda} />}
          {analise.valorAnunciadoProp !== undefined && (
            <Row label="Valor anunciado pelo proprietário" value={fmtBRL(analise.valorAnunciadoProp)} />
          )}
          {analise.observacoes && <Row label="Observações" value={analise.observacoes} />}
        </div>
      </div>

      {/* ── 3. Amostras de Mercado ── */}
      {analise.amostras.length > 0 && (
        <div className={styles.section}>
          <SectionTitle>3. Amostras de Mercado Comparadas ({analise.amostras.length} imóveis)</SectionTitle>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Descrição</th>
                <th className={styles.th}>Área m²</th>
                <th className={styles.th}>Valor Anunciado</th>
                <th className={styles.th}>R$/m²</th>
              </tr>
            </thead>
            <tbody>
              {analise.amostras.map((a, i) => (
                <tr key={a.id} className={styles.tr}>
                  <td className={styles['td--center']}>{i + 1}</td>
                  <td className={styles.td}>{a.descricao || '—'}</td>
                  <td className={styles['td--right']}>{a.areaM2} m²</td>
                  <td className={styles['td--mono']}>{fmtBRL(a.valorAnunciado)}</td>
                  <td className={styles['td--mono']}>{fmtBRL(a.valorM2)}</td>
                </tr>
              ))}
              <tr className={styles['tr--total']}>
                <td colSpan={4} className={styles['td--total-label']}>Média R$/m² das amostras</td>
                <td className={styles['td--total-value']}>{mediaM2 > 0 ? fmtBRL(mediaM2) : '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ── 4. Precificação Recomendada ── */}
      <div className={styles.section}>
        <SectionTitle>4. Precificação Recomendada</SectionTitle>
        <div className={styles.precos}>
          {analise.showImprovavel && (
            <div className={styles['preco--improvavel']}>
              <span className={styles.preco__tag}>Preço Improvável</span>
              <p className={styles.preco__value}>{fmtBRL(analise.precoImprovavel)}</p>
              <p className={styles.preco__m2}>{analise.precoImprovavel > 0 && analise.areaPrivativa > 0
                ? `${fmtBRL(Math.round(analise.precoImprovavel / analise.areaPrivativa))}/m²` : ''}</p>
              <p className={styles.preco__desc}>Baseado na média bruta das amostras coletadas. Tende a ficar acima do real interesse do mercado.</p>
            </div>
          )}
          {analise.showMercado && (
            <div className={styles['preco--mercado']}>
              <span className={styles.preco__tag}>Preço de Mercado</span>
              <p className={styles.preco__value}>{fmtBRL(analise.precoMercado)}</p>
              <p className={styles.preco__m2}>{analise.precoMercado > 0 && analise.areaPrivativa > 0
                ? `${fmtBRL(Math.round(analise.precoMercado / analise.areaPrivativa))}/m²` : ''}</p>
              <p className={styles.preco__desc}>Alinhado com a realidade do mercado atual. Recomendado para captação com expectativa realista de venda.</p>
            </div>
          )}
          {analise.showCompetitivo && (
            <div className={styles['preco--competitivo']}>
              <span className={styles.preco__tag}>Preço Competitivo</span>
              <p className={styles.preco__value}>{fmtBRL(analise.precoCompetitivo)}</p>
              <p className={styles.preco__m2}>{analise.precoCompetitivo > 0 && analise.areaPrivativa > 0
                ? `${fmtBRL(Math.round(analise.precoCompetitivo / analise.areaPrivativa))}/m²` : ''}</p>
              <p className={styles.preco__desc}>Abaixo da média de mercado para gerar maior velocidade de venda. Ideal para quem precisa vender com urgência.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── 5. Imóveis Vendidos na Região ── */}
      {vendidos.length > 0 && (
        <div className={styles.section}>
          <SectionTitle>5. Imóveis Vendidos na Região — {analise.bairro}</SectionTitle>
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
                  <td className={styles['td--right']}>{v.areaM2} m²</td>
                  <td className={styles['td--mono']}>{fmtBRL(v.valorVenda)}</td>
                  <td className={styles['td--mono']}>{fmtBRL(v.valorM2)}</td>
                  <td className={styles.td}>{v.dataVenda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── 6. Conclusão ── */}
      <div className={styles.section}>
        <SectionTitle>6. Conclusão e Recomendação</SectionTitle>
        <div className={styles.conclusion}>
          <p className={styles.conclusion__text}>
            Com base nas <strong>{analise.amostras.length} amostra{analise.amostras.length !== 1 ? 's' : ''}</strong> coletadas no bairro <strong>{analise.bairro}</strong> e nas transações recentes da região, o imóvel localizado em <strong>{endereco}</strong> apresenta uma faixa de valor de mercado entre{' '}
            {analise.showCompetitivo && <strong>{fmtBRL(analise.precoCompetitivo)} (Competitivo)</strong>}
            {analise.showCompetitivo && analise.showMercado && ' e '}
            {analise.showMercado && <strong>{fmtBRL(analise.precoMercado)} (De Mercado)</strong>}.
          </p>
          <p className={styles.conclusion__text}>
            A precificação de mercado a <strong>{fmtBRL(analise.precoMercado)}</strong>{' '}
            ({analise.areaPrivativa > 0 ? `${fmtBRL(Math.round(analise.precoMercado / analise.areaPrivativa))}/m²` : ''}) é a recomendação do corretor responsável como ponto de equilíbrio entre atratividade e rentabilidade para o proprietário.
          </p>
          <p className={styles.conclusion__signature}>
            {analise.corretor} — Corretor Responsável
          </p>
        </div>
      </div>

      {/* ── PDF footer ── */}
      <div className={styles.pdf__footer}>
        <span>Sistema Prioridade · Análise de Mercado #{analise.id} · {todayStr}</span>
        <span>Este documento é de uso interno e confidencial.</span>
      </div>

    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */

export default function AnalisePdfPage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()
  const analise = getAnalise(id)

  if (!analise) {
    return (
      <div className={styles.error}>
        <p>Análise não encontrada.</p>
        <button className={styles.error__btn} onClick={() => router.push('/analise-mercado')}>
          ← Voltar
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Toolbar — hidden on print */}
      <div className={styles.toolbar}>
        <button className={styles.toolbar__back} onClick={() => router.push(`/analise-mercado/${analise.id}`)}>
          ← Voltar para a análise
        </button>
        <span className={styles.toolbar__title}>
          {analise.rua}, {analise.numero}{analise.complemento ? ` — ${analise.complemento}` : ''}
        </span>
        <button className={styles.toolbar__print} onClick={() => window.print()}>
          Imprimir / Salvar PDF
        </button>
      </div>

      <PdfContent analise={analise} />
    </>
  )
}
