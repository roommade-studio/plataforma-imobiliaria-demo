'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { STUDIES, fmtBRL } from '@/app/(dashboard)/market-study/_data'
import styles from './page.module.css'

export default function ApresentacaoPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const study = STUDIES.find(s => s.id === id)

  useEffect(() => {
    if (study) document.title = `ACM — ${study.imovel}`
  }, [study])

  if (!study) {
    return (
      <div className={styles.not_found}>
        <p>Estudo de mercado não encontrado.</p>
        <button onClick={() => window.close()} className={styles.close_btn}>Fechar</button>
      </div>
    )
  }

  const mediaComparaveis = study.comparaveis.length > 0
    ? Math.round(study.comparaveis.reduce((s, c) => s + c.precoM2, 0) / study.comparaveis.length)
    : study.mediaM2Bairro

  return (
    <div className={styles.wrapper}>
      {/* Print action bar — hidden in print */}
      <div className={styles.action_bar}>
        <span className={styles.action_bar__hint}>Use Ctrl+P / ⌘+P para salvar como PDF</span>
        <div className={styles.action_bar__buttons}>
          <button className={styles.btn_secondary} onClick={() => window.close()}>Fechar</button>
          <button className={styles.btn_primary} onClick={() => window.print()}>
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      {/* A4 page */}
      <div className={styles.page}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.header__brand}>
            <span className={styles.header__logo}>Norte</span>
            <span className={styles.header__logo__accent}>Imóveis</span>
          </div>
          <div className={styles.header__title}>
            <p className={styles.header__label}>Análise Comparativa de Mercado</p>
            <p className={styles.header__sub}>Relatório de Precificação</p>
          </div>
        </div>

        {/* ── Property info ── */}
        <div className={styles.property}>
          <h1 className={styles.property__address}>{study.imovel}</h1>
          <div className={styles.property__tags}>
            <span className={styles.tag}>{study.bairro}</span>
            <span className={styles.tag}>{study.tipo}</span>
            <span className={styles.tag}>{study.areaM2} m²</span>
            {study.dormitorios > 0 && <span className={styles.tag}>{study.dormitorios} dormitório{study.dormitorios !== 1 ? 's' : ''}</span>}
            {study.vagas > 0 && <span className={styles.tag}>{study.vagas} vaga{study.vagas !== 1 ? 's' : ''}</span>}
            <span className={styles.tag}>{study.andar}</span>
          </div>
          <p className={styles.property__owner}>Proprietário: <strong>{study.proprietario}</strong></p>
        </div>

        <div className={styles.divider} />

        {/* ── 3 Price recommendation boxes ── */}
        <div className={styles.section}>
          <h2 className={styles.section__title}>Recomendação de Precificação</h2>
          <div className={styles.prices}>
            <div className={styles.price}>
              <span className={styles.price__badge}>Improvável</span>
              <span className={styles.price__value}>{fmtBRL(study.precoImprovavel)}</span>
              <span className={styles.price__m2}>{fmtBRL(Math.round(study.precoImprovavel / study.areaM2))}/m²</span>
              <p className={styles.price__desc}>
                Acima da média de mercado. Dificulta vendas e prolonga o tempo de absorção.
              </p>
            </div>

            <div className={styles['price--featured']}>
              <span className={styles['price--featured__rec']}>Recomendado</span>
              <span className={styles['price--featured__badge']}>De Mercado</span>
              <span className={styles['price--featured__value']}>{fmtBRL(study.precoMercado)}</span>
              <span className={styles['price--featured__m2']}>{fmtBRL(Math.round(study.precoMercado / study.areaM2))}/m²</span>
              <p className={styles['price--featured__desc']}>
                Alinhado aos comparáveis da região. Maximiza o valor com tempo de venda adequado.
              </p>
            </div>

            <div className={styles.price}>
              <span className={styles.price__badge}>Competitivo</span>
              <span className={styles.price__value}>{fmtBRL(study.precoCompetitivo)}</span>
              <span className={styles.price__m2}>{fmtBRL(Math.round(study.precoCompetitivo / study.areaM2))}/m²</span>
              <p className={styles.price__desc}>
                Abaixo da média. Atrai múltiplos interessados e acelera a negociação.
              </p>
            </div>
          </div>
        </div>

        {/* ── Market context ── */}
        <div className={styles.market_context}>
          <div className={styles.market_context__item}>
            <span className={styles.market_context__label}>Média m² do bairro</span>
            <span className={styles.market_context__value}>{fmtBRL(study.mediaM2Bairro)}</span>
          </div>
          <div className={styles.market_context__item}>
            <span className={styles.market_context__label}>Média m² dos comparáveis</span>
            <span className={styles.market_context__value}>{fmtBRL(mediaComparaveis)}</span>
          </div>
          <div className={styles.market_context__item}>
            <span className={styles.market_context__label}>Comparáveis analisados</span>
            <span className={styles.market_context__value}>{study.comparaveis.length} imóveis</span>
          </div>
          <div className={styles.market_context__item}>
            <span className={styles.market_context__label}>Data da análise</span>
            <span className={styles.market_context__value}>{study.data}</span>
          </div>
        </div>

        {/* ── Comparables ── */}
        {study.comparaveis.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.section__title}>Imóveis Comparáveis Analisados</h2>
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
                {study.comparaveis.map(c => (
                  <tr key={c.id}>
                    <td className={styles.table__td}>{c.endereco}</td>
                    <td className={styles.table__td}>{c.areaM2} m²</td>
                    <td className={styles.table__td}>{c.dormitorios > 0 ? c.dormitorios : '—'}</td>
                    <td className={styles.table__td}>
                      <span className={c.transacao === 'Venda' ? styles['tag--venda'] : styles['tag--oferta']}>
                        {c.transacao}
                      </span>
                    </td>
                    <td className={styles['table__td--value']}>{fmtBRL(c.valor)}</td>
                    <td className={styles['table__td--value']}>{fmtBRL(c.precoM2)}</td>
                    <td className={styles.table__td}>{c.conservacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Observations ── */}
        {study.observacoes && (
          <div className={styles.section}>
            <h2 className={styles.section__title}>Observações do Corretor</h2>
            <p className={styles.obs}>{study.observacoes}</p>
          </div>
        )}

        {/* ── Disclaimer ── */}
        <div className={styles.disclaimer}>
          <p>
            Esta análise comparativa de mercado foi elaborada com base em imóveis similares
            comercializados ou ofertados na região. Os valores apresentados são estimativas
            e podem variar de acordo com as condições do mercado e características específicas
            do imóvel. Não constitui avaliação formal de imóveis (ABNT NBR 14.653).
          </p>
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <div className={styles.footer__brand}>
            <span className={styles.footer__logo}>Norte Imóveis</span>
            <span className={styles.footer__creci}>CRECI-SP 12345-F</span>
          </div>
          <div className={styles.footer__info}>
            <span>Elaborado em {study.data}</span>
            <span>Confidencial — uso exclusivo do proprietário</span>
          </div>
        </div>

      </div>
    </div>
  )
}
