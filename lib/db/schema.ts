import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  integer,
  boolean,
  numeric,
  jsonb,
  date,
} from 'drizzle-orm/pg-core'

/* ---------------------------------------------------------
   TABELAS DO BETTER AUTH
   --------------------------------------------------------- */
export const authUsers = pgTable('user', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  email:         text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image:         text('image'),
  createdAt:     timestamp('created_at').notNull().defaultNow(),
  updatedAt:     timestamp('updated_at').notNull().defaultNow(),
})
export const authSessions = pgTable('session', {
  id:        text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token:     text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId:    text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
})
export const authAccounts = pgTable('account', {
  id:                    text('id').primaryKey(),
  accountId:             text('account_id').notNull(),
  providerId:            text('provider_id').notNull(),
  userId:                text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
  accessToken:           text('access_token'),
  refreshToken:          text('refresh_token'),
  idToken:               text('id_token'),
  accessTokenExpiresAt:  timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope:                 text('scope'),
  password:              text('password'),
  createdAt:             timestamp('created_at').notNull().defaultNow(),
  updatedAt:             timestamp('updated_at').notNull().defaultNow(),
})
export const authVerifications = pgTable('verification', {
  id:         text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value:      text('value').notNull(),
  expiresAt:  timestamp('expires_at').notNull(),
  createdAt:  timestamp('created_at').defaultNow(),
  updatedAt:  timestamp('updated_at').defaultNow(),
})

/* ---------------------------------------------------------
   ENUMS
   --------------------------------------------------------- */
export const roleEnum                = pgEnum('role', ['admin', 'gestor', 'corretor'])
export const propertyTypeEnum        = pgEnum('property_type', ['apartment', 'house', 'commercial', 'land', 'rural'])
export const propertyStatusEnum      = pgEnum('property_status', ['active', 'sold', 'expired', 'cancelled'])
export const managementTypeEnum      = pgEnum('management_type', ['individual', 'partnership'])
export const partnershipTypeEnum     = pgEnum('partnership_type', ['solo', 'internal', 'external'])
export const contractStatusEnum      = pgEnum('contract_status', ['draft', 'pending_review', 'adjustments_requested', 'approved', 'signed'])
export const temperatureEnum         = pgEnum('temperature', ['hot', 'warm', 'cold'])
export const sellerLeadStatusEnum    = pgEnum('seller_lead_status', ['lead', 'visit_scheduled', 'visit_done', 'acm_scheduled', 'acm_presented', 'management_signed', 'lost'])
export const commissionStatusEnum    = pgEnum('commission_status', ['pending', 'paid'])
export const cashflowTypeEnum        = pgEnum('cashflow_type', ['fixo', 'variavel', 'pessoa', 'imposto', 'transferencia'])
export const marketStudyStatusEnum   = pgEnum('market_study_status', ['created', 'presented', 'signed', 'sold', 'suspended'])
export const mentorActivityTypeEnum  = pgEnum('mentor_activity_type', ['prontos', 'lancamentos'])
export const planStatusEnum          = pgEnum('plan_status', ['in_progress', 'consolidated'])
export const alertTypeEnum           = pgEnum('alert_type', ['attention', 'critical'])
export const matchStatusEnum         = pgEnum('match_status', ['pending', 'contacted', 'rejected'])
export const negotiationStatusEnum   = pgEnum('negotiation_status', ['active', 'in_contract', 'won', 'lost'])
export const visitStatusEnum         = pgEnum('visit_status', ['scheduled', 'realized', 'cancelled'])

/* ---------------------------------------------------------
   PROFILES — estende o user do Better Auth
   --------------------------------------------------------- */
export const profiles = pgTable('profiles', {
  id:          text('id').primaryKey(),
  name:        text('name').notNull(),
  email:       text('email').notNull().unique(),
  phone:       text('phone'),
  role:        roleEnum('role').notNull().default('corretor'),
  company:     text('company'),
  avatarUrl:   text('avatar_url'),
  cpf:         text('cpf'),
  rg:          text('rg'),
  creci:       text('creci'),
  bank:        text('bank'),
  bankAgency:  text('bank_agency'),
  bankAccount: text('bank_account'),
  pixKey:      text('pix_key'),
  isActive:    boolean('is_active').notNull().default(true),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   METRICS — metas mensais do corretor
   --------------------------------------------------------- */
export const metrics = pgTable('metrics', {
  id:                        text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:                  text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  year:                      integer('year').notNull(),
  month:                     integer('month').notNull(), // 1-12

  exclusiveCapturesGoal:     integer('exclusive_captures_goal').default(0),
  exclusiveCapturesAchieved: integer('exclusive_captures_achieved').default(0),

  portfolioValueGoal:        numeric('portfolio_value_goal', { precision: 14, scale: 2 }).default('0'),
  portfolioValueAchieved:    numeric('portfolio_value_achieved', { precision: 14, scale: 2 }).default('0'),

  salesCountGoal:            integer('sales_count_goal').default(0),
  salesCountAchieved:        integer('sales_count_achieved').default(0),

  vgcCompetenceGoal:         numeric('vgc_competence_goal', { precision: 14, scale: 2 }).default('0'),
  vgcCompetenceAchieved:     numeric('vgc_competence_achieved', { precision: 14, scale: 2 }).default('0'),

  vgvCompetenceGoal:         numeric('vgv_competence_goal', { precision: 14, scale: 2 }).default('0'),
  vgvBrutoAchieved:          numeric('vgv_bruto_achieved', { precision: 14, scale: 2 }).default('0'),

  propertyCountGoal:         integer('property_count_goal').default(0),
  avgTicketGoal:             numeric('avg_ticket_goal', { precision: 14, scale: 2 }).default('0'),
  avgTicketAchieved:         numeric('avg_ticket_achieved', { precision: 14, scale: 2 }).default('0'),

  isConsolidated:            boolean('is_consolidated').notNull().default(false),
  createdAt:                 timestamp('created_at').notNull().defaultNow(),
  updatedAt:                 timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   PROPERTIES — carteira de imóveis
   --------------------------------------------------------- */
export const properties = pgTable('properties', {
  id:                  text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:            text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  type:                propertyTypeEnum('type').notNull(),
  status:              propertyStatusEnum('status').notNull().default('active'),
  managementType:      managementTypeEnum('management_type').notNull().default('individual'),
  coBrokerIds:         text('co_broker_ids').array(),

  street:              text('street'),
  number:              text('number'),
  complement:          text('complement'),
  neighborhood:        text('neighborhood'),
  city:                text('city').notNull(),
  state:               text('state').notNull().default('SP'),
  zipCode:             text('zip_code'),

  areaM2:              numeric('area_m2', { precision: 10, scale: 2 }),
  bedrooms:            integer('bedrooms'),
  suites:              integer('suites'),
  bathrooms:           integer('bathrooms'),
  garages:             integer('garages'),

  value:               numeric('value', { precision: 14, scale: 2 }).notNull(),
  marketValue:         numeric('market_value', { precision: 14, scale: 2 }),

  startDate:           date('start_date'),
  expirationDate:      date('expiration_date'),

  hasProfessionalPhoto: boolean('has_professional_photo').notNull().default(false),
  isFeatured:          boolean('is_featured').notNull().default(false),
  notes:               text('notes'),
  coverImageUrl:       text('cover_image_url'),

  createdAt:           timestamp('created_at').notNull().defaultNow(),
  updatedAt:           timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   SALES — vendas realizadas
   --------------------------------------------------------- */
export const sales = pgTable('sales', {
  id:               text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:         text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  propertyId:       text('property_id').references(() => properties.id),
  clientName:       text('client_name').notNull(),
  saleDate:         date('sale_date').notNull(),
  saleValue:        numeric('sale_value', { precision: 14, scale: 2 }).notNull(),
  commissionValue:  numeric('commission_value', { precision: 14, scale: 2 }),
  partnershipType:  partnershipTypeEnum('partnership_type').notNull().default('solo'),
  vgvBruto:         numeric('vgv_bruto', { precision: 14, scale: 2 }),
  transactionCount: numeric('transaction_count', { precision: 4, scale: 1 }).default('1.0'),
  createdAt:        timestamp('created_at').notNull().defaultNow(),
  updatedAt:        timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   PROPERTY ADJUSTMENTS — histórico de reajustes
   --------------------------------------------------------- */
export const propertyAdjustments = pgTable('property_adjustments', {
  id:             text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:       text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  propertyId:     text('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  previousValue:  numeric('previous_value', { precision: 14, scale: 2 }).notNull(),
  newValue:       numeric('new_value', { precision: 14, scale: 2 }).notNull(),
  adjustmentDate: date('adjustment_date').notNull(),
  notes:          text('notes'),
  createdAt:      timestamp('created_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   CONTRACTS — contratos de compra/venda
   --------------------------------------------------------- */
export const contracts = pgTable('contracts', {
  id:          text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:    text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  propertyId:  text('property_id').references(() => properties.id),
  status:      contractStatusEnum('status').notNull().default('draft'),
  type:        text('type').notNull().default('purchase_and_sale'),
  clientName:  text('client_name'),
  notes:       text('notes'),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   CLIENT LEADS — pipeline de compradores
   --------------------------------------------------------- */
export const clientLeads = pgTable('client_leads', {
  id:                  text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:            text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  clientName:          text('client_name').notNull(),
  phone:               text('phone'),
  email:               text('email'),
  temperature:         temperatureEnum('temperature').notNull().default('warm'),
  budgetMin:           numeric('budget_min', { precision: 14, scale: 2 }),
  budgetMax:           numeric('budget_max', { precision: 14, scale: 2 }),
  preferredNeighborhood: text('preferred_neighborhood'),
  notes:               text('notes'),
  contactRegisteredAt: timestamp('contact_registered_at'),
  lostAt:              timestamp('lost_at'),
  lossReason:          text('loss_reason'),
  createdAt:           timestamp('created_at').notNull().defaultNow(),
  updatedAt:           timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   CLIENT VISITS — visitas de compradores
   --------------------------------------------------------- */
export const clientVisits = pgTable('client_visits', {
  id:           text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:     text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  clientLeadId: text('client_lead_id').notNull().references(() => clientLeads.id, { onDelete: 'cascade' }),
  propertyId:   text('property_id').references(() => properties.id),
  scheduledAt:  timestamp('scheduled_at').notNull(),
  realizedAt:   timestamp('realized_at'),
  status:       visitStatusEnum('status').notNull().default('scheduled'),
  notes:        text('notes'),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
  updatedAt:    timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   NEGOTIATIONS — negociações ativas
   --------------------------------------------------------- */
export const negotiations = pgTable('negotiations', {
  id:                  text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:            text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  clientLeadId:        text('client_lead_id').notNull().references(() => clientLeads.id, { onDelete: 'cascade' }),
  propertyId:          text('property_id').references(() => properties.id),
  status:              negotiationStatusEnum('status').notNull().default('active'),
  partnershipType:     partnershipTypeEnum('partnership_type').notNull().default('solo'),
  proposalValue:       numeric('proposal_value', { precision: 14, scale: 2 }),
  expectedVgvBruto:    numeric('expected_vgv_bruto', { precision: 14, scale: 2 }),
  expectedVgvInterno:  numeric('expected_vgv_interno', { precision: 14, scale: 2 }),
  pipelineSaleValue:   numeric('pipeline_sale_value', { precision: 14, scale: 2 }),
  notes:               text('notes'),
  createdAt:           timestamp('created_at').notNull().defaultNow(),
  updatedAt:           timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   SELLER LEADS — pipeline de vendedores
   --------------------------------------------------------- */
export const sellerLeads = pgTable('seller_leads', {
  id:         text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:   text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  propertyId: text('property_id').references(() => properties.id),
  status:     sellerLeadStatusEnum('status').notNull().default('lead'),
  clientName: text('client_name'),
  phone:      text('phone'),
  notes:      text('notes'),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
  updatedAt:  timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   COMMISSION PARCELS — parcelas de comissão
   --------------------------------------------------------- */
export const commissionParcels = pgTable('commission_parcels', {
  id:              text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:        text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  saleId:          text('sale_id').references(() => sales.id),
  clientName:      text('client_name').notNull(),
  parcelNumber:    integer('parcel_number').notNull(),
  totalParcels:    integer('total_parcels').notNull(),
  dueDate:         date('due_date').notNull(),
  grossAmount:     numeric('gross_amount', { precision: 14, scale: 2 }).notNull(),
  netBrokerAmount: numeric('net_broker_amount', { precision: 14, scale: 2 }).notNull(),
  status:          commissionStatusEnum('status').notNull().default('pending'),
  paymentDate:     date('payment_date'),
  createdAt:       timestamp('created_at').notNull().defaultNow(),
  updatedAt:       timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   CASHFLOW ITEMS — fluxo de caixa pessoal
   --------------------------------------------------------- */
export const cashflowItems = pgTable('cashflow_items', {
  id:          text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:    text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  type:        cashflowTypeEnum('type').notNull(),
  description: text('description').notNull(),
  category:    text('category'),
  dueDate:     date('due_date').notNull(),
  amount:      numeric('amount', { precision: 14, scale: 2 }).notNull(),
  isPaid:      boolean('is_paid').notNull().default(false),
  paidTo:      text('paid_to'),
  paidAt:      date('paid_at'),
  year:        integer('year').notNull(),
  month:       integer('month').notNull(),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   MARKET STUDIES — estudos de mercado (ACM)
   --------------------------------------------------------- */
export const marketStudies = pgTable('market_studies', {
  id:              text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:        text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  propertyId:      text('property_id').references(() => properties.id),
  status:          marketStudyStatusEnum('status').notNull().default('created'),
  title:           text('title').notNull(),
  comparativeData: jsonb('comparative_data'),
  notes:           text('notes'),
  createdAt:       timestamp('created_at').notNull().defaultNow(),
  updatedAt:       timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   ACTION DAILY ROUTINES — rotinas diárias
   --------------------------------------------------------- */
export const actionDailyRoutines = pgTable('action_daily_routines', {
  id:            text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:      text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  routineTitle:  text('routine_title').notNull(),
  dailyTarget:   integer('daily_target').notNull().default(1),
  timeOfDay:     text('time_of_day'),
  activityType:  text('activity_type'),
  routineLevel:  text('routine_level'),
  weekdays:      integer('weekdays').array(),
  isActive:      boolean('is_active').notNull().default(true),
  createdAt:     timestamp('created_at').notNull().defaultNow(),
  updatedAt:     timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   ROUTINE DAILY COMPLETIONS — registro de conclusão de rotinas
   --------------------------------------------------------- */
export const routineDailyCompletions = pgTable('routine_daily_completions', {
  id:               text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  routineId:        text('routine_id').notNull().references(() => actionDailyRoutines.id, { onDelete: 'cascade' }),
  completionDate:   date('completion_date').notNull(),
  completedCount:   integer('completed_count').notNull().default(0),
  createdAt:        timestamp('created_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   MENTORING SESSIONS — sessões de mentoria
   --------------------------------------------------------- */
export const mentoringSessions = pgTable('mentoring_sessions', {
  id:          text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:    text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  mentorId:    text('mentor_id').references(() => profiles.id),
  sessionDate: date('session_date').notNull(),
  status:      text('status').notNull().default('scheduled'),
  notes:       text('notes'),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   MENTORING ACTIVITY RECORDS — atividades diárias de mentoria
   --------------------------------------------------------- */
export const mentoringActivityRecords = pgTable('mentoring_activity_records', {
  id:               text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:         text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  year:             integer('year').notNull(),
  month:            integer('month').notNull(),
  activityType:     mentorActivityTypeEnum('activity_type').notNull(),
  dayOfMonth:       integer('day_of_month').notNull(),
  calls:            integer('calls').notNull().default(0),
  visits:           integer('visits').notNull().default(0),
  acm:              integer('acm').notNull().default(0),
  contractsSigned:  integer('contracts_signed').notNull().default(0),
  sales:            integer('sales').notNull().default(0),
  meetings:         integer('meetings').notNull().default(0),
  proposals:        integer('proposals').notNull().default(0),
  createdAt:        timestamp('created_at').notNull().defaultNow(),
  updatedAt:        timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   BROKER ALERTS — alertas automáticos
   --------------------------------------------------------- */
export const brokerAlerts = pgTable('broker_alerts', {
  id:         text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:   text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  title:      text('title').notNull(),
  type:       alertTypeEnum('type').notNull().default('attention'),
  isResolved: boolean('is_resolved').notNull().default(false),
  createdAt:  timestamp('created_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   PROPERTY MATCHES — norte connect (match comprador/imóvel)
   --------------------------------------------------------- */
export const propertyMatches = pgTable('property_matches', {
  id:             text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  buyerBrokerId:  text('buyer_broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  sellerBrokerId: text('seller_broker_id').references(() => profiles.id),
  propertyId:     text('property_id').references(() => properties.id),
  clientLeadId:   text('client_lead_id').references(() => clientLeads.id),
  matchScore:     integer('match_score').notNull().default(0),
  status:         matchStatusEnum('status').notNull().default('pending'),
  createdAt:      timestamp('created_at').notNull().defaultNow(),
  updatedAt:      timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   PERSONAL DEVELOPMENT PLANS — planos de desenvolvimento
   --------------------------------------------------------- */
export const personalDevelopmentPlans = pgTable('personal_development_plans', {
  id:              text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:        text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  versionNumber:   integer('version_number').notNull().default(1),
  status:          planStatusEnum('status').notNull().default('in_progress'),
  purpose:         text('purpose'),
  mission:         text('mission'),
  vision:          text('vision'),
  values:          text('values'),
  wheelOfLife:     jsonb('wheel_of_life'),
  competencies:    jsonb('competencies'),
  swot:            jsonb('swot'),
  criticalFactors: jsonb('critical_factors'),
  objectives:      jsonb('objectives'),
  createdAt:       timestamp('created_at').notNull().defaultNow(),
  updatedAt:       timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   PLANNING OBJECTIVES — objetivos anuais
   --------------------------------------------------------- */
export const planningObjectives = pgTable('planning_objectives', {
  id:                  text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:            text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  planId:              text('plan_id').references(() => personalDevelopmentPlans.id),
  year:                integer('year').notNull(),
  vgvGoal:             numeric('vgv_goal', { precision: 14, scale: 2 }),
  vgcGoal:             numeric('vgc_goal', { precision: 14, scale: 2 }),
  activePropertiesGoal: integer('active_properties_goal'),
  avgTicketGoal:       numeric('avg_ticket_goal', { precision: 14, scale: 2 }),
  narrativeFinancial:  text('narrative_financial'),
  narrativeImage:      text('narrative_image'),
  narrativeDream:      text('narrative_dream'),
  narrativeSummary:    text('narrative_summary'),
  createdAt:           timestamp('created_at').notNull().defaultNow(),
  updatedAt:           timestamp('updated_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   BENCHMARKING SNAPSHOTS — dados de benchmarking
   --------------------------------------------------------- */
export const benchmarkingSnapshots = pgTable('benchmarking_snapshots', {
  id:                text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brokerId:          text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  company:           text('company'),
  year:              integer('year').notNull(),
  month:             integer('month').notNull(),
  exclusiveCaptures: integer('exclusive_captures').default(0),
  salesCount:        integer('sales_count').default(0),
  vgcCompetence:     numeric('vgc_competence', { precision: 14, scale: 2 }).default('0'),
  portfolioValue:    numeric('portfolio_value', { precision: 14, scale: 2 }).default('0'),
  avgTicket:         numeric('avg_ticket', { precision: 14, scale: 2 }).default('0'),
  createdAt:         timestamp('created_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   SETORES & GESTÃO DE EQUIPE
   --------------------------------------------------------- */
export const sectors = pgTable('sectors', {
  id:          text('id').primaryKey(),
  name:        text('name').notNull(),
  managerId:   text('manager_id').notNull().references(() => profiles.id, { onDelete: 'set null' }),
  company:     text('company'),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
})

export const sectorBrokers = pgTable('sector_brokers', {
  sectorId:  text('sector_id').notNull().references(() => sectors.id, { onDelete: 'cascade' }),
  brokerId:  text('broker_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
})

/* ---------------------------------------------------------
   METAS MÍNIMAS DA EMPRESA (definidas pelo gestor)
   --------------------------------------------------------- */
export const companyGoals = pgTable('company_goals', {
  id:           text('id').primaryKey(),
  sectorId:     text('sector_id').notNull().references(() => sectors.id, { onDelete: 'cascade' }),
  year:         integer('year').notNull(),
  month:        integer('month').notNull(),
  minCaptures:  integer('min_captures').default(0),
  minVgv:       numeric('min_vgv', { precision: 14, scale: 2 }).default('0'),
  minVgc:       integer('min_vgc').default(0),
  minSales:     integer('min_sales').default(0),
  minTicket:    numeric('min_ticket', { precision: 14, scale: 2 }).default('0'),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})

/* ---------------------------------------------------------
   TIPOS TYPESCRIPT INFERIDOS
   --------------------------------------------------------- */
export type Profile                  = typeof profiles.$inferSelect
export type NewProfile               = typeof profiles.$inferInsert
export type Metrics                  = typeof metrics.$inferSelect
export type Property                 = typeof properties.$inferSelect
export type Sale                     = typeof sales.$inferSelect
export type PropertyAdjustment       = typeof propertyAdjustments.$inferSelect
export type Contract                 = typeof contracts.$inferSelect
export type ClientLead               = typeof clientLeads.$inferSelect
export type ClientVisit              = typeof clientVisits.$inferSelect
export type Negotiation              = typeof negotiations.$inferSelect
export type SellerLead               = typeof sellerLeads.$inferSelect
export type CommissionParcel         = typeof commissionParcels.$inferSelect
export type CashflowItem             = typeof cashflowItems.$inferSelect
export type MarketStudy              = typeof marketStudies.$inferSelect
export type ActionDailyRoutine       = typeof actionDailyRoutines.$inferSelect
export type MentoringSession         = typeof mentoringSessions.$inferSelect
export type MentoringActivityRecord  = typeof mentoringActivityRecords.$inferSelect
export type BrokerAlert              = typeof brokerAlerts.$inferSelect
export type PropertyMatch            = typeof propertyMatches.$inferSelect
export type PersonalDevelopmentPlan  = typeof personalDevelopmentPlans.$inferSelect
export type PlanningObjective        = typeof planningObjectives.$inferSelect
export type BenchmarkingSnapshot     = typeof benchmarkingSnapshots.$inferSelect
export type Sector                   = typeof sectors.$inferSelect
export type SectorBroker             = typeof sectorBrokers.$inferSelect
export type CompanyGoal              = typeof companyGoals.$inferSelect
