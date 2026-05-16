export interface Comparable {
  id:          string
  endereco:    string
  tipo:        string
  areaM2:      number
  dormitorios: number
  valor:       number
  precoM2:     number
  transacao:   'Venda' | 'Oferta'
  conservacao: string
}

export type StudyStatus = 'Criado' | 'Apresentado' | 'Assinado' | 'Vendido' | 'Suspenso'

export interface MarketStudy {
  id:               string
  imovel:           string
  bairro:           string
  tipo:             string
  areaM2:           number
  dormitorios:      number
  vagas:            number
  andar:            string
  status:           StudyStatus
  data:             string
  proprietario:     string
  precoImprovavel:  number
  precoMercado:     number
  precoCompetitivo: number
  mediaM2Bairro:    number
  comparaveis:      Comparable[]
  observacoes:      string
}

export function fmtBRL(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export const STUDIES: MarketStudy[] = [
  {
    id: 'acm-001',
    imovel: 'Rua dos Pinheiros, 450 — Apto 82',
    bairro: 'Pinheiros',
    tipo: 'Apartamento',
    areaM2: 92,
    dormitorios: 3,
    vagas: 2,
    andar: '8º andar',
    status: 'Apresentado',
    data: '28/04/2026',
    proprietario: 'Carlos Eduardo Mendes',
    precoImprovavel:  1_580_000,
    precoMercado:     1_350_000,
    precoCompetitivo: 1_190_000,
    mediaM2Bairro:    14_650,
    comparaveis: [
      { id: 'c1', endereco: 'Al. Joaquim Eugênio de Lima, 33 – Apto 71', tipo: 'Apartamento', areaM2: 88, dormitorios: 3, valor: 1_290_000, precoM2: 14_659, transacao: 'Venda',  conservacao: 'Bom'     },
      { id: 'c2', endereco: 'Rua Frei Caneca, 600 – Apto 54',            tipo: 'Apartamento', areaM2: 96, dormitorios: 3, valor: 1_380_000, precoM2: 14_375, transacao: 'Oferta', conservacao: 'Ótimo'   },
      { id: 'c3', endereco: 'Rua Lisboa, 120 – Apto 32',                 tipo: 'Apartamento', areaM2: 90, dormitorios: 3, valor: 1_320_000, precoM2: 14_667, transacao: 'Venda',  conservacao: 'Bom'     },
      { id: 'c4', endereco: 'Rua Haddock Lobo, 200 – Apto 12',          tipo: 'Apartamento', areaM2: 94, dormitorios: 3, valor: 1_360_000, precoM2: 14_468, transacao: 'Oferta', conservacao: 'Regular' },
    ],
    observacoes: 'Imóvel em excelente estado de conservação. Área de lazer completa com piscina, academia e salão de festas. Condomínio valorizado na região.',
  },
  {
    id: 'acm-002',
    imovel: 'Av. Paulista, 1578 — Apto 142',
    bairro: 'Bela Vista',
    tipo: 'Apartamento',
    areaM2: 68,
    dormitorios: 2,
    vagas: 1,
    andar: '14º andar',
    status: 'Criado',
    data: '02/05/2026',
    proprietario: 'Mariana Rodrigues Souza',
    precoImprovavel:  1_180_000,
    precoMercado:     960_000,
    precoCompetitivo: 840_000,
    mediaM2Bairro:    14_118,
    comparaveis: [
      { id: 'c5', endereco: 'Av. Paulista, 900 – Apto 81',    tipo: 'Apartamento', areaM2: 70, dormitorios: 2, valor: 980_000,   precoM2: 14_000, transacao: 'Venda',  conservacao: 'Bom'   },
      { id: 'c6', endereco: 'Rua Augusta, 2100 – Apto 33',    tipo: 'Apartamento', areaM2: 65, dormitorios: 2, valor: 910_000,   precoM2: 14_000, transacao: 'Oferta', conservacao: 'Ótimo' },
      { id: 'c7', endereco: 'Rua Bela Cintra, 550 – Apto 9', tipo: 'Apartamento', areaM2: 72, dormitorios: 2, valor: 1_010_000, precoM2: 14_028, transacao: 'Venda',  conservacao: 'Bom'   },
    ],
    observacoes: 'Localização privilegiada na Av. Paulista. Vista parcial para o Parque Trianon. Próximo ao metrô Trianon-Masp e serviços.',
  },
  {
    id: 'acm-003',
    imovel: 'Rua Oscar Freire, 412 — Cobertura Duplex',
    bairro: 'Jardins',
    tipo: 'Cobertura',
    areaM2: 280,
    dormitorios: 4,
    vagas: 4,
    andar: 'Cobertura',
    status: 'Assinado',
    data: '15/03/2026',
    proprietario: 'Ricardo Nunes Pereira',
    precoImprovavel:  6_200_000,
    precoMercado:     5_300_000,
    precoCompetitivo: 4_800_000,
    mediaM2Bairro:    18_400,
    comparaveis: [
      { id: 'c8',  endereco: 'Rua Bela Cintra, 300 – Cobertura',  tipo: 'Cobertura', areaM2: 260, dormitorios: 4, valor: 4_950_000, precoM2: 19_038, transacao: 'Venda',  conservacao: 'Ótimo' },
      { id: 'c9',  endereco: 'Al. França, 1200 – Cobertura',       tipo: 'Cobertura', areaM2: 290, dormitorios: 4, valor: 5_400_000, precoM2: 18_621, transacao: 'Oferta', conservacao: 'Bom'   },
      { id: 'c10', endereco: 'Rua Dr. Melo Alves, 88 – Cobertura', tipo: 'Cobertura', areaM2: 270, dormitorios: 4, valor: 5_100_000, precoM2: 18_889, transacao: 'Venda',  conservacao: 'Bom'   },
    ],
    observacoes: 'Imóvel de alto padrão. Vista panorâmica para os Jardins. Terraço privativo com churrasqueira e piscina. Acabamentos importados.',
  },
  {
    id: 'acm-004',
    imovel: 'Al. Santos, 700 — Sala 32',
    bairro: 'Jardim Paulista',
    tipo: 'Sala Comercial',
    areaM2: 62,
    dormitorios: 0,
    vagas: 1,
    andar: '3º andar',
    status: 'Criado',
    data: '05/05/2026',
    proprietario: 'Alfa Empreendimentos Ltda',
    precoImprovavel:  810_000,
    precoMercado:     680_000,
    precoCompetitivo: 590_000,
    mediaM2Bairro:    10_968,
    comparaveis: [
      { id: 'c11', endereco: 'Al. Santos, 400 – Sala 25',         tipo: 'Sala Comercial', areaM2: 58, dormitorios: 0, valor: 640_000, precoM2: 11_034, transacao: 'Venda',  conservacao: 'Bom'   },
      { id: 'c12', endereco: 'Rua Pamplona, 145 – Conjunto 81',   tipo: 'Sala Comercial', areaM2: 65, dormitorios: 0, valor: 710_000, precoM2: 10_923, transacao: 'Oferta', conservacao: 'Ótimo' },
    ],
    observacoes: 'Sala com acabamento moderno e ampla exposição à luz natural. Próximo a restaurantes, bancos e escritórios de advocacia.',
  },
  {
    id: 'acm-005',
    imovel: 'Rua Funchal, 418 — Apto 54',
    bairro: 'Vila Olímpia',
    tipo: 'Apartamento',
    areaM2: 65,
    dormitorios: 2,
    vagas: 2,
    andar: '5º andar',
    status: 'Vendido',
    data: '10/01/2026',
    proprietario: 'Fernanda Lima Sousa',
    precoImprovavel:  980_000,
    precoMercado:     820_000,
    precoCompetitivo: 720_000,
    mediaM2Bairro:    12_615,
    comparaveis: [
      { id: 'c13', endereco: 'Rua Funchal, 300 – Apto 31',            tipo: 'Apartamento', areaM2: 62, dormitorios: 2, valor: 780_000, precoM2: 12_581, transacao: 'Venda',  conservacao: 'Bom'   },
      { id: 'c14', endereco: 'Av. Pres. Juscelino K., 20 – Apto 11', tipo: 'Apartamento', areaM2: 68, dormitorios: 2, valor: 860_000, precoM2: 12_647, transacao: 'Oferta', conservacao: 'Ótimo' },
    ],
    observacoes: 'Imóvel vendido em 38 dias pelo preço de mercado. ACM arquivada para referência histórica e benchmarking.',
  },
]
