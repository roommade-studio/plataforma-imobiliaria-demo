import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

const steps: Array<{ name: string; sql: string }> = [

  // ── 1. Limpar tabelas antigas (substituídas) ─────────────────────────────
  { name: 'Drop visits', sql: `DROP TABLE IF EXISTS visits CASCADE` },
  { name: 'Drop clients', sql: `DROP TABLE IF EXISTS clients CASCADE` },
  { name: 'Drop negotiations (old)', sql: `DROP TABLE IF EXISTS negotiations CASCADE` },
  { name: 'Drop properties (old)', sql: `DROP TABLE IF EXISTS properties CASCADE` },

  // ── 2. Atualizar enum role (employee → corretor) ──────────────────────────
  { name: 'Add corretor to role enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'corretor' AND enumtypid = 'role'::regtype) THEN
      ALTER TYPE role ADD VALUE 'corretor';
    END IF;
  END $$` },
  { name: 'Update employee → corretor', sql: `UPDATE profiles SET role = 'corretor' WHERE role = 'employee'` },

  // ── 3. Atualizar profiles (novos campos) ──────────────────────────────────
  { name: 'Alter profiles add company',      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT` },
  { name: 'Alter profiles add cpf',          sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cpf TEXT` },
  { name: 'Alter profiles add rg',           sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rg TEXT` },
  { name: 'Alter profiles add creci',        sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS creci TEXT` },
  { name: 'Alter profiles add bank',         sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank TEXT` },
  { name: 'Alter profiles add bank_agency',  sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_agency TEXT` },
  { name: 'Alter profiles add bank_account', sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bank_account TEXT` },
  { name: 'Alter profiles add pix_key',      sql: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pix_key TEXT` },

  // ── 4. Criar novos enums ──────────────────────────────────────────────────
  { name: 'Create property_type enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
      CREATE TYPE property_type AS ENUM ('apartment','house','commercial','land','rural');
    END IF;
  END $$` },
  { name: 'Create property_status enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
      CREATE TYPE property_status AS ENUM ('active','sold','expired','cancelled');
    END IF;
  END $$` },
  { name: 'Create management_type enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'management_type') THEN
      CREATE TYPE management_type AS ENUM ('individual','partnership');
    END IF;
  END $$` },
  { name: 'Create partnership_type enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partnership_type') THEN
      CREATE TYPE partnership_type AS ENUM ('solo','internal','external');
    END IF;
  END $$` },
  { name: 'Create contract_status enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_status') THEN
      CREATE TYPE contract_status AS ENUM ('draft','pending_review','adjustments_requested','approved','signed');
    END IF;
  END $$` },
  { name: 'Create temperature enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'temperature') THEN
      CREATE TYPE temperature AS ENUM ('hot','warm','cold');
    END IF;
  END $$` },
  { name: 'Create seller_lead_status enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seller_lead_status') THEN
      CREATE TYPE seller_lead_status AS ENUM ('lead','visit_scheduled','visit_done','acm_scheduled','acm_presented','management_signed','lost');
    END IF;
  END $$` },
  { name: 'Create commission_status enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'commission_status') THEN
      CREATE TYPE commission_status AS ENUM ('pending','paid');
    END IF;
  END $$` },
  { name: 'Create cashflow_type enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cashflow_type') THEN
      CREATE TYPE cashflow_type AS ENUM ('fixo','variavel','pessoa','imposto','transferencia');
    END IF;
  END $$` },
  { name: 'Create market_study_status enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'market_study_status') THEN
      CREATE TYPE market_study_status AS ENUM ('created','presented','signed','sold','suspended');
    END IF;
  END $$` },
  { name: 'Create mentor_activity_type enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mentor_activity_type') THEN
      CREATE TYPE mentor_activity_type AS ENUM ('prontos','lancamentos');
    END IF;
  END $$` },
  { name: 'Create plan_status enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_status') THEN
      CREATE TYPE plan_status AS ENUM ('in_progress','consolidated');
    END IF;
  END $$` },
  { name: 'Create alert_type enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
      CREATE TYPE alert_type AS ENUM ('attention','critical');
    END IF;
  END $$` },
  { name: 'Create match_status enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'match_status') THEN
      CREATE TYPE match_status AS ENUM ('pending','contacted','rejected');
    END IF;
  END $$` },
  { name: 'Create negotiation_status enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'negotiation_status') THEN
      CREATE TYPE negotiation_status AS ENUM ('active','in_contract','won','lost');
    END IF;
  END $$` },
  { name: 'Create visit_status enum', sql: `DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visit_status') THEN
      CREATE TYPE visit_status AS ENUM ('scheduled','realized','cancelled');
    END IF;
  END $$` },

  // ── 5. Criar tabela metrics ───────────────────────────────────────────────
  { name: 'Create metrics', sql: `CREATE TABLE IF NOT EXISTS metrics (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    year INTEGER NOT NULL, month INTEGER NOT NULL,
    exclusive_captures_goal INTEGER DEFAULT 0,
    exclusive_captures_achieved INTEGER DEFAULT 0,
    portfolio_value_goal NUMERIC(14,2) DEFAULT 0,
    portfolio_value_achieved NUMERIC(14,2) DEFAULT 0,
    sales_count_goal INTEGER DEFAULT 0,
    sales_count_achieved INTEGER DEFAULT 0,
    vgc_competence_goal NUMERIC(14,2) DEFAULT 0,
    vgc_competence_achieved NUMERIC(14,2) DEFAULT 0,
    vgv_competence_goal NUMERIC(14,2) DEFAULT 0,
    vgv_bruto_achieved NUMERIC(14,2) DEFAULT 0,
    property_count_goal INTEGER DEFAULT 0,
    avg_ticket_goal NUMERIC(14,2) DEFAULT 0,
    avg_ticket_achieved NUMERIC(14,2) DEFAULT 0,
    is_consolidated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 6. Criar tabela properties ────────────────────────────────────────────
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

  // ── 7. Criar tabela sales ─────────────────────────────────────────────────
  { name: 'Create sales', sql: `CREATE TABLE IF NOT EXISTS sales (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    client_name TEXT NOT NULL,
    sale_date DATE NOT NULL,
    sale_value NUMERIC(14,2) NOT NULL,
    commission_value NUMERIC(14,2),
    partnership_type partnership_type NOT NULL DEFAULT 'solo',
    vgv_bruto NUMERIC(14,2),
    transaction_count NUMERIC(4,1) DEFAULT 1.0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 8. Criar tabela property_adjustments ──────────────────────────────────
  { name: 'Create property_adjustments', sql: `CREATE TABLE IF NOT EXISTS property_adjustments (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    previous_value NUMERIC(14,2) NOT NULL,
    new_value NUMERIC(14,2) NOT NULL,
    adjustment_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 9. Criar tabela contracts ─────────────────────────────────────────────
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

  // ── 10. Criar tabela client_leads ─────────────────────────────────────────
  { name: 'Create client_leads', sql: `CREATE TABLE IF NOT EXISTS client_leads (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    phone TEXT, email TEXT,
    temperature temperature NOT NULL DEFAULT 'warm',
    budget_min NUMERIC(14,2), budget_max NUMERIC(14,2),
    preferred_neighborhood TEXT, notes TEXT,
    contact_registered_at TIMESTAMP,
    lost_at TIMESTAMP, loss_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 11. Criar tabela client_visits ────────────────────────────────────────
  { name: 'Create client_visits', sql: `CREATE TABLE IF NOT EXISTS client_visits (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    client_lead_id TEXT NOT NULL REFERENCES client_leads(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    scheduled_at TIMESTAMP NOT NULL,
    realized_at TIMESTAMP,
    status visit_status NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 12. Criar tabela negotiations ─────────────────────────────────────────
  { name: 'Create negotiations', sql: `CREATE TABLE IF NOT EXISTS negotiations (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    client_lead_id TEXT NOT NULL REFERENCES client_leads(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    status negotiation_status NOT NULL DEFAULT 'active',
    partnership_type partnership_type NOT NULL DEFAULT 'solo',
    proposal_value NUMERIC(14,2),
    expected_vgv_bruto NUMERIC(14,2),
    expected_vgv_interno NUMERIC(14,2),
    pipeline_sale_value NUMERIC(14,2),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 13. Criar tabela seller_leads ─────────────────────────────────────────
  { name: 'Create seller_leads', sql: `CREATE TABLE IF NOT EXISTS seller_leads (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    status seller_lead_status NOT NULL DEFAULT 'lead',
    client_name TEXT, phone TEXT, notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 14. Criar tabela commission_parcels ───────────────────────────────────
  { name: 'Create commission_parcels', sql: `CREATE TABLE IF NOT EXISTS commission_parcels (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sale_id TEXT REFERENCES sales(id),
    client_name TEXT NOT NULL,
    parcel_number INTEGER NOT NULL, total_parcels INTEGER NOT NULL,
    due_date DATE NOT NULL,
    gross_amount NUMERIC(14,2) NOT NULL, net_broker_amount NUMERIC(14,2) NOT NULL,
    status commission_status NOT NULL DEFAULT 'pending',
    payment_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 15. Criar tabela cashflow_items ───────────────────────────────────────
  { name: 'Create cashflow_items', sql: `CREATE TABLE IF NOT EXISTS cashflow_items (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type cashflow_type NOT NULL,
    description TEXT NOT NULL, category TEXT,
    due_date DATE NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    paid_to TEXT, paid_at DATE,
    year INTEGER NOT NULL, month INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 16. Criar tabela market_studies ──────────────────────────────────────
  { name: 'Create market_studies', sql: `CREATE TABLE IF NOT EXISTS market_studies (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id TEXT REFERENCES properties(id),
    status market_study_status NOT NULL DEFAULT 'created',
    title TEXT NOT NULL, comparative_data JSONB, notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 17. Criar tabela action_daily_routines ────────────────────────────────
  { name: 'Create action_daily_routines', sql: `CREATE TABLE IF NOT EXISTS action_daily_routines (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    routine_title TEXT NOT NULL, daily_target INTEGER NOT NULL DEFAULT 1,
    time_of_day TEXT, activity_type TEXT, routine_level TEXT,
    weekdays INTEGER[], is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 18. Criar tabela routine_daily_completions ────────────────────────────
  { name: 'Create routine_daily_completions', sql: `CREATE TABLE IF NOT EXISTS routine_daily_completions (
    id TEXT PRIMARY KEY,
    routine_id TEXT NOT NULL REFERENCES action_daily_routines(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL, completed_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 19. Criar tabela mentoring_sessions ───────────────────────────────────
  { name: 'Create mentoring_sessions', sql: `CREATE TABLE IF NOT EXISTS mentoring_sessions (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    mentor_id TEXT REFERENCES profiles(id),
    session_date DATE NOT NULL, status TEXT NOT NULL DEFAULT 'scheduled', notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 20. Criar tabela mentoring_activity_records ───────────────────────────
  { name: 'Create mentoring_activity_records', sql: `CREATE TABLE IF NOT EXISTS mentoring_activity_records (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    year INTEGER NOT NULL, month INTEGER NOT NULL,
    activity_type mentor_activity_type NOT NULL,
    day_of_month INTEGER NOT NULL,
    calls INTEGER NOT NULL DEFAULT 0, visits INTEGER NOT NULL DEFAULT 0,
    acm INTEGER NOT NULL DEFAULT 0, contracts_signed INTEGER NOT NULL DEFAULT 0,
    sales INTEGER NOT NULL DEFAULT 0, meetings INTEGER NOT NULL DEFAULT 0,
    proposals INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 21. Criar tabela broker_alerts ────────────────────────────────────────
  { name: 'Create broker_alerts', sql: `CREATE TABLE IF NOT EXISTS broker_alerts (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL, type alert_type NOT NULL DEFAULT 'attention',
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 22. Criar tabela property_matches ────────────────────────────────────
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

  // ── 23. Criar tabela personal_development_plans ───────────────────────────
  { name: 'Create personal_development_plans', sql: `CREATE TABLE IF NOT EXISTS personal_development_plans (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    status plan_status NOT NULL DEFAULT 'in_progress',
    purpose TEXT, mission TEXT, vision TEXT, values TEXT,
    wheel_of_life JSONB, competencies JSONB, swot JSONB,
    critical_factors JSONB, objectives JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 24. Criar tabela planning_objectives ─────────────────────────────────
  { name: 'Create planning_objectives', sql: `CREATE TABLE IF NOT EXISTS planning_objectives (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES personal_development_plans(id),
    year INTEGER NOT NULL,
    vgv_goal NUMERIC(14,2), vgc_goal NUMERIC(14,2),
    active_properties_goal INTEGER, avg_ticket_goal NUMERIC(14,2),
    narrative_financial TEXT, narrative_image TEXT,
    narrative_dream TEXT, narrative_summary TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },

  // ── 25. Criar tabela benchmarking_snapshots ───────────────────────────────
  { name: 'Create benchmarking_snapshots', sql: `CREATE TABLE IF NOT EXISTS benchmarking_snapshots (
    id TEXT PRIMARY KEY,
    broker_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company TEXT, year INTEGER NOT NULL, month INTEGER NOT NULL,
    exclusive_captures INTEGER DEFAULT 0, sales_count INTEGER DEFAULT 0,
    vgc_competence NUMERIC(14,2) DEFAULT 0,
    portfolio_value NUMERIC(14,2) DEFAULT 0,
    avg_ticket NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )` },
]

async function run() {
  console.log(`Executando ${steps.length} migrações...\n`)
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
  console.log(`\n${ok}/${steps.length} migrações concluídas.`)
}

run().catch(console.error)
