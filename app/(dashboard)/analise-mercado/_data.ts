/* ── Types ──────────────────────────────────────────────── */

export type AnaliseStatus  = 'Criado' | 'Apresentado' | 'Assinado' | 'Vendido' | 'Suspenso'
export type TipoImovel     = 'Apartamento' | 'Casa' | 'Terreno/Lote' | 'Sala Comercial' | 'Rural'
export type PadraoImovel   = 'Econômico' | 'Médio' | 'Alto' | 'Luxo'

export interface Amostra {
  id:              string
  url:             string
  descricao:       string
  areaM2:         number
  valorAnunciado: number
  valorM2:        number
}

export interface ImoveisVendido {
  id:          string
  bairro:      string
  endereco:    string
  tipo:        string
  areaM2:     number
  dormitorios: number
  valorVenda: number
  valorM2:    number
  dataVenda:  string
}

export interface AnaliseMercado {
  id:        string
  status:    AnaliseStatus
  criadoEm: string
  corretor:  string
  // Section 1 — Proprietário
  proprietario:         string
  telefone:             string
  dataVisita:           string
  tempoVenda:           string
  motivacao:            string
  apresentacaoAgendada: boolean
  linkAnuncio:          string
  // Section 2 — Localização
  cep:         string
  rua:         string
  numero:      string
  complemento: string
  bairro:      string
  cidade:      string
  estado:      string
  // Section 3 — Imóvel
  tipo:          TipoImovel
  padrao:        PadraoImovel
  areaPrivativa: number
  // Apartamento extras
  dormitorios?:        number
  suites?:             number
  banheiros?:          number
  vagas?:              number
  anoConstrucao?:     number
  localizacaoDemanda?: string
  infraestrutura?:    string
  andar?:             string
  elevador?:          boolean
  orientacaoSolar?:   string
  portaria?:          string
  vistaPanoramica?:   boolean
  conservacao?:       string
  semiMobiliado?:     boolean
  valorAnunciadoProp?: number
  observacoes?:       string
  // Section 4 — Amostras
  amostras: Amostra[]
  // Section 5 — Preços
  precoImprovavel:  number
  precoMercado:     number
  precoCompetitivo: number
  showImprovavel:   boolean
  showMercado:      boolean
  showCompetitivo:  boolean
}

/* ── Helpers ────────────────────────────────────────────── */

export function fmtBRL(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function calcPrecos(amostras: Pick<Amostra, 'valorM2'>[], areaPrivativa: number) {
  if (!amostras.length || !areaPrivativa) return { improvavel: 0, mercado: 0, competitivo: 0 }
  const mediaM2    = amostras.reduce((s, a) => s + a.valorM2, 0) / amostras.length
  const improvavel = Math.round(mediaM2 * areaPrivativa)
  return { improvavel, mercado: Math.round(improvavel * 0.93), competitivo: Math.round(improvavel * 0.85) }
}

/* ── Mutable store (mock persistence within same session) ── */

export const analyses: AnaliseMercado[] = [
  {
    id: 'AM001', status: 'Criado', criadoEm: '15/04/2026', corretor: 'Ana Lima',
    proprietario: 'Marcelo Fontana dos Santos', telefone: '(55) 9 9876-5432',
    dataVisita: '2026-04-18', tempoVenda: '4 meses', motivacao: 'Mudança de cidade',
    apresentacaoAgendada: true, linkAnuncio: 'https://www.zapimoveis.com.br/imovel/ap-3-quartos-camobi',
    cep: '97110-230', rua: 'Av. Hélvio Basso', numero: '1245', complemento: 'Apto 302',
    bairro: 'Camobi', cidade: 'Santa Maria', estado: 'RS',
    tipo: 'Apartamento', padrao: 'Alto', areaPrivativa: 98,
    dormitorios: 3, suites: 2, banheiros: 2, vagas: 2, anoConstrucao: 2018,
    localizacaoDemanda: 'Alta demanda, próximo à UFSM e Hospital Universitário',
    infraestrutura: 'Piscina, churrasqueira, academia, playground',
    andar: '3º', elevador: true, orientacaoSolar: 'Norte', portaria: '24 horas',
    vistaPanoramica: false, conservacao: 'Ótimo', semiMobiliado: true,
    valorAnunciadoProp: 440000,
    observacoes: 'Imóvel em excelente estado. Banheiro social reformado em 2024.',
    amostras: [
      { id: 's1', url: 'https://www.zapimoveis.com.br/...', descricao: 'Apt 3D/2B/2V, 95m², Camobi',          areaM2: 95,  valorAnunciado: 390000, valorM2: 4105 },
      { id: 's2', url: 'https://www.vivareal.com.br/...',  descricao: 'Apt 3D/2S/2B, 100m², próx UFSM',      areaM2: 100, valorAnunciado: 430000, valorM2: 4300 },
      { id: 's3', url: 'https://www.imob.com.br/...',     descricao: 'Apt 3D/1S, 92m², Camobi — andar alto', areaM2: 92,  valorAnunciado: 370000, valorM2: 4022 },
      { id: 's4', url: 'https://www.chavechave.com.br/...', descricao: 'Apt 3D/2B/2V, 105m², cond. fechado', areaM2: 105, valorAnunciado: 450000, valorM2: 4286 },
      { id: 's5', url: 'https://www.olx.com.br/...',      descricao: 'Apt 3D/2B/1V, 90m², próx. comércio',   areaM2: 90,  valorAnunciado: 355000, valorM2: 3944 },
    ],
    precoImprovavel: 404880, precoMercado: 376538, precoCompetitivo: 344148,
    showImprovavel: true, showMercado: true, showCompetitivo: true,
  },
  {
    id: 'AM002', status: 'Apresentado', criadoEm: '03/04/2026', corretor: 'Bruno Reis',
    proprietario: 'Sandra Moura Pereira', telefone: '(55) 9 9765-4321',
    dataVisita: '2026-04-05', tempoVenda: '8 meses', motivacao: 'Dívidas financeiras',
    apresentacaoAgendada: false, linkAnuncio: '',
    cep: '97015-001', rua: 'Rua Venâncio Aires', numero: '456', complemento: 'Apto 51',
    bairro: 'Centro', cidade: 'Santa Maria', estado: 'RS',
    tipo: 'Apartamento', padrao: 'Médio', areaPrivativa: 72,
    dormitorios: 2, suites: 1, banheiros: 2, vagas: 1, anoConstrucao: 2010,
    localizacaoDemanda: 'Boa localização, no coração do Centro histórico',
    infraestrutura: 'Elevador, portaria virtual',
    andar: '5º', elevador: true, orientacaoSolar: 'Leste', portaria: 'Eletrônica',
    vistaPanoramica: false, conservacao: 'Bom', semiMobiliado: false,
    valorAnunciadoProp: 295000,
    observacoes: '',
    amostras: [
      { id: 's6', url: 'https://www.zapimoveis.com.br/...', descricao: 'Apt 2D/2B/1V, 70m², Centro',     areaM2: 70, valorAnunciado: 270000, valorM2: 3857 },
      { id: 's7', url: 'https://www.vivareal.com.br/...',  descricao: 'Apt 2D/1S/1B, 68m², Centro',     areaM2: 68, valorAnunciado: 265000, valorM2: 3897 },
      { id: 's8', url: 'https://www.wimoveis.com.br/...',  descricao: 'Apt 2D/2B, 75m², próx. catedral', areaM2: 75, valorAnunciado: 295000, valorM2: 3933 },
      { id: 's9', url: 'https://www.imob.com.br/...',     descricao: 'Apt 2D/1S/2B/1V, 73m², Centro',   areaM2: 73, valorAnunciado: 285000, valorM2: 3904 },
    ],
    precoImprovavel: 280650, precoMercado: 261005, precoCompetitivo: 238553,
    showImprovavel: true, showMercado: true, showCompetitivo: false,
  },
  {
    id: 'AM003', status: 'Assinado', criadoEm: '20/03/2026', corretor: 'Carla Matos',
    proprietario: 'Roberto Kaefer', telefone: '(55) 9 9654-3210',
    dataVisita: '2026-03-22', tempoVenda: '2 anos', motivacao: 'Família cresceu, precisa de imóvel maior',
    apresentacaoAgendada: true, linkAnuncio: 'https://www.zapimoveis.com.br/imovel/casa-medianeira',
    cep: '97050-350', rua: 'Rua Duque de Caxias', numero: '87', complemento: '',
    bairro: 'Medianeira', cidade: 'Santa Maria', estado: 'RS',
    tipo: 'Casa', padrao: 'Alto', areaPrivativa: 180,
    observacoes: 'Casa com piscina e área gourmet.',
    amostras: [
      { id: 's10', url: 'https://www.zapimoveis.com.br/...', descricao: 'Casa 4D/3B/2V, 170m², Medianeira',  areaM2: 170, valorAnunciado: 550000, valorM2: 3235 },
      { id: 's11', url: 'https://www.vivareal.com.br/...',  descricao: 'Casa 4D/2S/3B, 190m², Medianeira',  areaM2: 190, valorAnunciado: 620000, valorM2: 3263 },
      { id: 's12', url: 'https://www.imob.com.br/...',     descricao: 'Casa 3D/2B/1V, 165m², Medianeira',  areaM2: 165, valorAnunciado: 520000, valorM2: 3152 },
      { id: 's13', url: 'https://www.chavechave.com.br/...', descricao: 'Casa 4D/3B/2V, 185m², Medianeira', areaM2: 185, valorAnunciado: 600000, valorM2: 3243 },
      { id: 's14', url: 'https://www.olx.com.br/...',      descricao: 'Casa 3D/1S/2B, 175m², Medianeira',  areaM2: 175, valorAnunciado: 565000, valorM2: 3229 },
      { id: 's15', url: 'https://www.wimoveis.com.br/...',  descricao: 'Casa 3D/2B, 160m², c/ quintal',    areaM2: 160, valorAnunciado: 510000, valorM2: 3188 },
    ],
    precoImprovavel: 579278, precoMercado: 538729, precoCompetitivo: 492386,
    showImprovavel: true, showMercado: true, showCompetitivo: true,
  },
  {
    id: 'AM004', status: 'Vendido', criadoEm: '10/02/2026', corretor: 'Ana Lima',
    proprietario: 'Luciana Timm', telefone: '(55) 9 9543-2109',
    dataVisita: '2026-02-12', tempoVenda: '3 meses', motivacao: 'Reforma do portfólio pessoal',
    apresentacaoAgendada: false, linkAnuncio: '',
    cep: '97060-180', rua: 'Av. Nossa Senhora das Dores', numero: '672', complemento: 'Apto 404',
    bairro: 'Nossa Senhora de Fátima', cidade: 'Santa Maria', estado: 'RS',
    tipo: 'Apartamento', padrao: 'Luxo', areaPrivativa: 145,
    dormitorios: 4, suites: 3, banheiros: 4, vagas: 3, anoConstrucao: 2020,
    localizacaoDemanda: 'Alta demanda por alto padrão, área nobre de Santa Maria',
    infraestrutura: 'Piscina aquecida, spa, academia completa, salão de festas, portaria 24h',
    andar: '4º', elevador: true, orientacaoSolar: 'Norte', portaria: '24 horas',
    vistaPanoramica: true, conservacao: 'Ótimo', semiMobiliado: true,
    valorAnunciadoProp: 790000,
    observacoes: 'Padrão Luxo com acabamento premium. Cozinha Ornare, piso porcelanato 90×90.',
    amostras: [
      { id: 's16', url: 'https://www.zapimoveis.com.br/...', descricao: 'Apt 4D/3S/4B/3V, 140m², Fátima',  areaM2: 140, valorAnunciado: 720000, valorM2: 5143 },
      { id: 's17', url: 'https://www.vivareal.com.br/...',  descricao: 'Apt 4D/3S/4B/3V, 150m², Fátima',  areaM2: 150, valorAnunciado: 790000, valorM2: 5267 },
      { id: 's18', url: 'https://www.imob.com.br/...',     descricao: 'Apt 4D/2S/3B/2V, 142m², Fátima',  areaM2: 142, valorAnunciado: 740000, valorM2: 5211 },
      { id: 's19', url: 'https://www.chavechave.com.br/...', descricao: 'Apt 4D/3S/4B/3V, 148m², Fátima', areaM2: 148, valorAnunciado: 770000, valorM2: 5203 },
      { id: 's20', url: 'https://www.wimoveis.com.br/...',  descricao: 'Apt 4D/3S/4B, 145m², luxo',       areaM2: 145, valorAnunciado: 760000, valorM2: 5241 },
    ],
    precoImprovavel: 755882, precoMercado: 702970, precoCompetitivo: 642999,
    showImprovavel: true, showMercado: true, showCompetitivo: true,
  },
]

export function addAnalise(a: AnaliseMercado): void { analyses.unshift(a) }
export function getAnalise(id: string): AnaliseMercado | undefined { return analyses.find(a => a.id === id) }
export function updateStatus(id: string, status: AnaliseStatus): void {
  const idx = analyses.findIndex(a => a.id === id)
  if (idx !== -1) analyses[idx] = { ...analyses[idx], status }
}
export function deleteAnalise(id: string): void {
  const idx = analyses.findIndex(a => a.id === id)
  if (idx !== -1) analyses.splice(idx, 1)
}

/* ── Imóveis Vendidos na Região ─────────────────────────── */

export const IMOVEIS_VENDIDOS: ImoveisVendido[] = [
  // Camobi
  { id: 'v1',  bairro: 'Camobi',                  endereco: 'Av. Hélvio Basso, 980 — Apto 201',    tipo: 'Apt 3D',  areaM2: 95,  dormitorios: 3, valorVenda: 385000, valorM2: 4053, dataVenda: '02/2026' },
  { id: 'v2',  bairro: 'Camobi',                  endereco: 'Rua Cassiano do Nascimento, 230',      tipo: 'Apt 2D',  areaM2: 65,  dormitorios: 2, valorVenda: 245000, valorM2: 3769, dataVenda: '01/2026' },
  { id: 'v3',  bairro: 'Camobi',                  endereco: 'Av. Hélvio Basso, 1100 — Apto 405',   tipo: 'Apt 3D',  areaM2: 102, dormitorios: 3, valorVenda: 420000, valorM2: 4118, dataVenda: '03/2026' },
  // Centro
  { id: 'v4',  bairro: 'Centro',                  endereco: 'Rua Venâncio Aires, 320 — Apto 31',   tipo: 'Apt 2D',  areaM2: 70,  dormitorios: 2, valorVenda: 272000, valorM2: 3886, dataVenda: '03/2026' },
  { id: 'v5',  bairro: 'Centro',                  endereco: 'Rua Dr. Bozano, 556 — Apto 62',       tipo: 'Apt 3D',  areaM2: 95,  dormitorios: 3, valorVenda: 370000, valorM2: 3895, dataVenda: '02/2026' },
  { id: 'v6',  bairro: 'Centro',                  endereco: 'Rua Marechal Floriano, 140 — Apto 12', tipo: 'Apt 1D', areaM2: 45,  dormitorios: 1, valorVenda: 165000, valorM2: 3667, dataVenda: '04/2026' },
  // Medianeira
  { id: 'v7',  bairro: 'Medianeira',              endereco: 'Rua Duque de Caxias, 120',             tipo: 'Casa 4D', areaM2: 165, dormitorios: 4, valorVenda: 520000, valorM2: 3152, dataVenda: '01/2026' },
  { id: 'v8',  bairro: 'Medianeira',              endereco: 'Rua Ernesto Alves, 340',               tipo: 'Casa 3D', areaM2: 140, dormitorios: 3, valorVenda: 450000, valorM2: 3214, dataVenda: '03/2026' },
  { id: 'v9',  bairro: 'Medianeira',              endereco: 'Rua Appel, 87',                        tipo: 'Casa 3D', areaM2: 120, dormitorios: 3, valorVenda: 370000, valorM2: 3083, dataVenda: '02/2026' },
  // Nossa Senhora de Fátima
  { id: 'v10', bairro: 'Nossa Senhora de Fátima', endereco: 'Av. N. Sra. das Dores, 540 — Apto 402', tipo: 'Apt 4D', areaM2: 140, dormitorios: 4, valorVenda: 730000, valorM2: 5214, dataVenda: '03/2026' },
  { id: 'v11', bairro: 'Nossa Senhora de Fátima', endereco: 'Rua Silva Jardim, 78 — Apto 305',     tipo: 'Apt 3D',  areaM2: 110, dormitorios: 3, valorVenda: 525000, valorM2: 4773, dataVenda: '01/2026' },
  { id: 'v12', bairro: 'Nossa Senhora de Fátima', endereco: 'Av. N. Sra. das Dores, 710 — Apto 604', tipo: 'Apt 4D', areaM2: 155, dormitorios: 4, valorVenda: 810000, valorM2: 5226, dataVenda: '04/2026' },
  // Rosário
  { id: 'v13', bairro: 'Rosário',                 endereco: 'Rua Barão do Triunfo, 220 — Apto 11', tipo: 'Apt 2D',  areaM2: 68,  dormitorios: 2, valorVenda: 240000, valorM2: 3529, dataVenda: '03/2026' },
  { id: 'v14', bairro: 'Rosário',                 endereco: 'Rua Otávio Binato, 350',               tipo: 'Casa 3D', areaM2: 130, dormitorios: 3, valorVenda: 390000, valorM2: 3000, dataVenda: '02/2026' },
]
