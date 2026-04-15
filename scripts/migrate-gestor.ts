/**
 * migrate-gestor.ts
 *
 * Adds 'gestor' to the role enum and creates the new tables:
 *   sectors, sector_brokers, company_goals
 *
 * Run: npx tsx scripts/migrate-gestor.ts
 */

import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'

config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)

async function run() {
  console.log('▶ Adicionando gestor ao enum role...')
  await sql.query(`ALTER TYPE role ADD VALUE IF NOT EXISTS 'gestor'`)
  console.log('  ✓ role enum atualizado')

  console.log('▶ Criando tabela sectors...')
  await sql.query(`
    CREATE TABLE IF NOT EXISTS sectors (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      manager_id  TEXT NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
      company     TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  console.log('  ✓ sectors')

  console.log('▶ Criando tabela sector_brokers...')
  await sql.query(`
    CREATE TABLE IF NOT EXISTS sector_brokers (
      sector_id  TEXT NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
      broker_id  TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      PRIMARY KEY (sector_id, broker_id)
    )
  `)
  console.log('  ✓ sector_brokers')

  console.log('▶ Criando tabela company_goals...')
  await sql.query(`
    CREATE TABLE IF NOT EXISTS company_goals (
      id            TEXT PRIMARY KEY,
      sector_id     TEXT NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
      year          INTEGER NOT NULL,
      month         INTEGER NOT NULL,
      min_captures  INTEGER DEFAULT 0,
      min_vgv       NUMERIC(14,2) DEFAULT 0,
      min_vgc       INTEGER DEFAULT 0,
      min_sales     INTEGER DEFAULT 0,
      min_ticket    NUMERIC(14,2) DEFAULT 0,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  console.log('  ✓ company_goals')

  console.log('\n✅ Migração concluída com sucesso.')
}

run().catch((err) => {
  console.error('Erro na migração:', err)
  process.exit(1)
})
