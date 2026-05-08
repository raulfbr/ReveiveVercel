export type ScheduleAssignmentStatus = 'confirmed' | 'planned' | 'pending'

export type ScheduleAssignment = {
  careSignal?: string
  name: string
  note?: string
  status: ScheduleAssignmentStatus
}

export type ScheduleRequirement = {
  assignments: ScheduleAssignment[]
  front: string
  id: string
  requiredCount: number
  role: string
}

export type ScheduleMinistry = {
  description: string
  id: string
  name: string
  requirements: ScheduleRequirement[]
}

export type ScheduleEvent = {
  dateLabel: string
  id: string
  notes: string[]
  startsAt: string
  title: string
  typeLabel: string
  ministries: ScheduleMinistry[]
}

export const reviveMinistries = [
  'ADORAÇÃO',
  'BOAS VINDAS',
  'ESPAÇO CONEXÃO',
  'ESTACIONAMENTO',
  'FINANCEIRO',
  'FUTEBOL',
  'GERAÇÃO R',
  'ILUMINAÇÃO',
  'INCLUSÃO',
  'JUNIORES',
  'LANCHES',
  'MIDIA',
  'PROJEÇÃO',
  'RECEPÇÃO',
  'SOM',
  'VOLUNTARIADO',
  'MULHERES',
] as const

export const demoScheduleEvent: ScheduleEvent = {
  dateLabel: 'Domingo, 10/05/2026',
  id: 'culto-domingo-2026-05-10',
  notes: [
    'Protótipo read-only: os dados desta tela ainda são demonstrativos.',
    'Mesa de Ceia não acontece neste domingo; a próxima referência mensal seria no primeiro domingo do mês.',
    'A próxima onda conecta esta experiência ao Supabase para criação e edição real de escalas.',
  ],
  startsAt: '10h',
  title: 'Escala da Semana',
  typeLabel: 'Culto de domingo',
  ministries: [
    {
      description: 'Condução musical e ambiente de adoração.',
      id: 'adoracao',
      name: 'ADORAÇÃO',
      requirements: [
        {
          assignments: [
            { name: 'Mateus Rocha', status: 'confirmed' },
            { name: 'Bianca Alves', status: 'confirmed' },
          ],
          front: 'Vocal',
          id: 'adoracao-vocal',
          requiredCount: 2,
          role: 'Vocalista',
        },
        {
          assignments: [
            { name: 'Rafael Nunes', status: 'confirmed' },
            { name: 'Lia Martins', status: 'planned' },
          ],
          front: 'Instrumental',
          id: 'adoracao-instrumental',
          requiredCount: 3,
          role: 'Instrumentista',
        },
      ],
    },
    {
      description: 'Primeira impressão, acolhimento e orientação de chegada.',
      id: 'boas-vindas',
      name: 'BOAS VINDAS',
      requirements: [
        {
          assignments: [
            { name: 'Carla Ribeiro', status: 'confirmed' },
            { name: 'Pedro Henrique', status: 'confirmed' },
            { name: 'Renata Costa', status: 'planned' },
          ],
          front: 'Entrada principal',
          id: 'boas-vindas-entrada',
          requiredCount: 3,
          role: 'Anfitrião',
        },
      ],
    },
    {
      description: 'Acompanhamento de visitantes e próximos passos.',
      id: 'espaco-conexao',
      name: 'ESPAÇO CONEXÃO',
      requirements: [
        {
          assignments: [{ name: 'Daniela Freitas', status: 'confirmed' }],
          front: 'Novos visitantes',
          id: 'espaco-conexao-visitantes',
          requiredCount: 2,
          role: 'Acolhimento conexão',
        },
      ],
    },
    {
      description: 'Fluxo de chegada, vagas e segurança externa.',
      id: 'estacionamento',
      name: 'ESTACIONAMENTO',
      requirements: [
        {
          assignments: [
            { name: 'Bruno Lima', status: 'confirmed' },
            { name: 'Paulo Sérgio', status: 'confirmed' },
          ],
          front: 'Entrada e saída',
          id: 'estacionamento-entrada-saida',
          requiredCount: 2,
          role: 'Orientador de vagas',
        },
      ],
    },
    {
      description: 'Operação de luz e ambientação do culto.',
      id: 'iluminacao',
      name: 'ILUMINAÇÃO',
      requirements: [
        {
          assignments: [{ name: 'Davi Moreira', status: 'confirmed' }],
          front: 'Culto',
          id: 'iluminacao-culto',
          requiredCount: 1,
          role: 'Operador de luz',
        },
      ],
    },
    {
      description: 'Apoio para pessoas que precisam de suporte específico.',
      id: 'inclusao',
      name: 'INCLUSÃO',
      requirements: [
        {
          assignments: [
            {
              careSignal: 'Confirmar antes do culto se a família que precisa de apoio estará presente.',
              name: 'Marina Lopes',
              status: 'planned',
            },
          ],
          front: 'Apoio individual',
          id: 'inclusao-apoio',
          requiredCount: 1,
          role: 'Acompanhante',
        },
      ],
    },
    {
      description: 'Cuidado e ensino das crianças durante o culto.',
      id: 'juniores',
      name: 'JUNIORES',
      requirements: [
        {
          assignments: [
            { name: 'Patrícia Gomes', status: 'confirmed' },
            { name: 'Camila Torres', status: 'planned' },
          ],
          front: 'Sala infantil',
          id: 'juniores-sala',
          requiredCount: 3,
          role: 'Professor/Apoio',
        },
      ],
    },
    {
      description: 'Organização do lanche e cuidado prático com voluntários.',
      id: 'lanches',
      name: 'LANCHES',
      requirements: [
        {
          assignments: [],
          front: 'Coordenação',
          id: 'lanches-responsavel',
          requiredCount: 1,
          role: 'Responsável principal',
        },
        {
          assignments: [
            { name: 'Fernanda Prado', status: 'planned' },
            { name: 'Aline Batista', status: 'confirmed' },
          ],
          front: 'Apoio',
          id: 'lanches-apoio',
          requiredCount: 2,
          role: 'Equipe de apoio',
        },
      ],
    },
    {
      description: 'Registro, foto e vídeo para comunicação da igreja.',
      id: 'midia',
      name: 'MIDIA',
      requirements: [
        {
          assignments: [
            { name: 'Lucas Martins', status: 'confirmed', note: 'Também aparece em SOM.' },
            { name: 'João Pedro', status: 'planned' },
          ],
          front: 'Foto e vídeo',
          id: 'midia-foto-video',
          requiredCount: 2,
          role: 'Mídia do culto',
        },
      ],
    },
    {
      description: 'Slides, letras e apoio visual durante o culto.',
      id: 'projecao',
      name: 'PROJEÇÃO',
      requirements: [
        {
          assignments: [{ name: 'Nathália Souza', status: 'confirmed' }],
          front: 'Culto',
          id: 'projecao-culto',
          requiredCount: 1,
          role: 'Operador de slides',
        },
      ],
    },
    {
      description: 'Recepção organizada em frente e atrás, conforme regra inicial.',
      id: 'recepcao',
      name: 'RECEPÇÃO',
      requirements: [
        {
          assignments: [
            { name: 'Ana Souza', status: 'confirmed' },
            { name: 'João Lima', status: 'confirmed' },
          ],
          front: 'Frente',
          id: 'recepcao-frente',
          requiredCount: 2,
          role: 'Recepcionista',
        },
        {
          assignments: [{ name: 'Marcos Teixeira', status: 'planned' }],
          front: 'Atrás',
          id: 'recepcao-atras',
          requiredCount: 2,
          role: 'Recepcionista',
        },
      ],
    },
    {
      description: 'Operação de áudio para culto, banda e fala.',
      id: 'som',
      name: 'SOM',
      requirements: [
        {
          assignments: [{ name: 'Lucas Martins', status: 'confirmed', note: 'Também aparece em MIDIA.' }],
          front: 'PA',
          id: 'som-pa',
          requiredCount: 1,
          role: 'Operador de som',
        },
        {
          assignments: [],
          front: 'Monitor',
          id: 'som-monitor',
          requiredCount: 1,
          role: 'Operador de monitor',
        },
      ],
    },
    {
      description: 'Olhar intencional para quem serve antes, durante e depois do culto.',
      id: 'voluntariado',
      name: 'VOLUNTARIADO',
      requirements: [
        {
          assignments: [
            {
              careSignal: 'Observar novos voluntários e registrar quem precisa de retorno.',
              name: 'Priscila Ramos',
              status: 'confirmed',
            },
          ],
          front: 'Cuidado dos voluntários',
          id: 'voluntariado-cuidado',
          requiredCount: 1,
          role: 'Responsável de cuidado',
        },
      ],
    },
  ],
}
