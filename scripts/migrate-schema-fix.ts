import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

const steps: Array<{ name: string; sql: string }> = [
  // Dropar enums antigos que tinham valores diferentes
  { name: 'Drop old property_status', sql: `DROP TYPE IF EXISTS property_status CASCADE` },
  { name: 'Drop old negotiation_status', sql: `DROP TYPE IF EXISTS negotiation_status CASCADE` },
  { name: 'Drop old purpose enum', sql: `DROP TYPE IF EXISTS purpose CASCADE` },
  { name: 'Drop old client_status', sql: `DROP TYPE IF EXISTS client_status CASCADE` },
  { name: 'Drop old visit_status', sql: `DROP TYPE IF EXISTS visit_status CASCADE` },

  // Recriar com novos valores
  { name: 'Recreate property_status', sql: `CREATE TYPE property_status AS ENUM ('active','sold','expired','cancelled')` },
  { name: 'Recreate negotiation_status', sql: `CREATE TYPE negotiation_status AS ENUM ('active','in_contract','won','lost')` },
  { name: 'Recreate visit_status', sql: `CREATE TYPE visit_status AS ENUM ('scheduled','realized','cancelled')` },

  // Criar tabelas que falharam
  { name: 'Create properties', sql: `CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type property_type NOT NULL,
    status property_status NOT NULL DEFAULT 'active',
    management_type management_type NOT NULL DEFAULT 'individual',
    co_broker_ids TEXT[],
    street TEXT, number TEXT, complement TEXT,
    neighborhood TEXT, city TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'SP', zip_code TEXT,
    area_m2 NUMERIC(10,2), bedrooms INTEGER, suites INTEGER, bathrooms INTEGER, garages INTEGER,
    value NUMERIC(14,2) NOT NULL,
    market_value NUMERIC(14,2),
    start_date DATE, expiration_date DATE,
    has_professional_photo BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    notes TEXT, cover_image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  { name: 'Create sales', sql: `CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    client_name TEXT NOT NULL, sale_date DATE NOT NULL,
    sale_value NUMERIC(14,2) NOT NULL, commission_value NUMERIC(14,2),
    partnership_type partnership_type NOT NULL DEFAULT 'solo',
    vgv_bruto NUMERIC(14,2), transaction_count NUMERIC(4,1) DEFAULT 1.0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  { name: 'Create property_adjustments', sql: `CREATE TABLE IF NOT EXISTS property_adjustments (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    previous_value NUMERIC(14,2) NOT NULL, new_value NUMERIC(14,2) NOT NULL,
    adjustment_date DATE NOT NULL, notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  { name: 'Create contracts', sql: `CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    status contract_status NOT NULL DEFAULT 'draft',
    type TEXT NOT NULL DEFAULT 'purchase_and_sale',
    client_name TEXT, notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  { name: 'Create client_visits', sql: `CREATE TABLE IF NOT EXISTS client_visits (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    client_lead_id TEXT NOT NULL REFERENCES client_leads(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    scheduled_at TIMESTAMP NOT NULL, realized_at TIMESTAMP,
    status visit_status NOT NULL DEFAULT 'scheduled', notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  { name: 'Create negotiations', sql: `CREATE TABLE IF NOT EXISTS negotiations (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    client_lead_id TEXT NOT NULL REFERENCES client_leads(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    status negotiation_status NOT NULL DEFAULT 'active',
    partnership_type partnership_type NOT NULL DEFAULT 'solo',
    proposal_value NUMERIC(14,2), expected_vgv_bruto NUMERIC(14,2),
    expected_vgv_interno NUMERIC(14,2), pipeline_sale_value NUMERIC(14,2), notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  { name: 'Create seller_leads', sql: `CREATE TABLE IF NOT EXISTS seller_leads (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    status seller_lead_status NOT NULL DEFAULT 'lead',
    client_name TEXT, phone TEXT, notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  { name: 'Create commission_parcels', sql: `CREATE TABLE IF NOT EXISTS commission_parcels (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sale_id TEXT REFERENCES sales(id),
    client_name TEXT NOT NULL,
    parcel_number INTEGER NOT NULL, total_parcels INTEGER NOT NULL,
    due_date DATE NOT NULL, gross_amount NUMERIC(14,2) NOT NULL, net_broker_amount NUMERIC(14,2) NOT NULL,
    status commission_status NOT NULL DEFAULT 'pending', payment_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  { name: 'Create market_studies', sql: `CREATE TABLE IF NOT EXISTS market_studies (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    status market_study_status NOT NULL DEFAULT 'created',
    title TEXT NOT NULL, comparative_data JSONB, notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  { name: 'Create property_matches', sql: `CREATE TABLE IF NOT EXISTS property_matches (
    id TEXT PRIMARY KEY,
    buyer_broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    seller_broker_id TEXT REFERENCES profiles(id),
    property_id TEXT REFERENCES properties(id),
    client_lead_id TEXT REFERENCES client_leads(id),
    match_score INTEGER NOT NULL DEFAULT 0,
    status match_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },
]

async function run() {
  console.log(`Executando ${steps.length} correções...\n`)
  let ok = 0
  for (const step of steps) {
    try {
      await sql.query(step.sql)
      console.log(`  ✓ ${step.name}`)
      ok++
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`  ✗ ${step.name}: ${msg}`)
    }
  }
  console.log(`\n${ok}/${steps.length} concluídas.`)
}

run().catch(console.error)
