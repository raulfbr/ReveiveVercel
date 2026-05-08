import Link from 'next/link'
import type { Metadata } from 'next'

import { CopyTextButton } from '@/components/copy-text-button'
import type { VolunteerRecord } from '@/lib/types'
import { formatAreaRole, formatAvailabilityStatus, formatCareStatus, formatDate } from '@/lib/format'
import {
  attentionFilterOptions,
  filterVolunteersByAttention,
  getAreaLoadStatus,
  getAreaDistribution,
  getVolunteerAttentionLabels,
  getVolunteerInsights,
  getWhatsappHref,
  getWeeklyActionItems,
  parseAttentionFilter,
} from '@/lib/volunteers/insights'

export const metadata: Metadata = {
  title: 'Demo Dados/Escalas - Revive',
  description: 'Demo publica com dados ficticios do Painel de Cuidado do voluntariado Revive.',
  robots: {
    index: false,
    follow: false,
  },
}

type DemoDadosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const demoVolunteers: VolunteerRecord[] = [
  {
    id: 'demo-ana',
    name: 'Ana Martins',
    normalizedName: 'ana martins',
    photoPath: null,
    gender: 'female',
    birthDate: '1994-05-14',
    joinDate: '2026-04-22',
    address: null,
    whatsapp: '(11) 99999-1001',
    normalizedWhatsapp: '11999991001',
    availabilityStatus: 'available',
    careStatus: 'new',
    lastContactAt: null,
    nextStep: 'Conectar com lider da Recepcao e confirmar primeira escala.',
    careResponsible: 'Raul',
    nextFollowUpAt: '2026-05-10',
    notes: 'Chegou pelo Ponto de Partida.',
    active: true,
    createdAt: '2026-04-22T10:00:00Z',
    updatedAt: '2026-05-08T10:00:00Z',
    areas: [],
  },
  {
    id: 'demo-bruno',
    name: 'Bruno Oliveira',
    normalizedName: 'bruno oliveira',
    photoPath: null,
    gender: 'male',
    birthDate: '1988-09-03',
    joinDate: '2025-11-02',
    address: null,
    whatsapp: '(11) 99999-1002',
    normalizedWhatsapp: '11999991002',
    availabilityStatus: 'limited',
    careStatus: 'needs_contact',
    lastContactAt: '2026-03-29',
    nextStep: 'Conversar sobre ritmo de servico e possibilidade de pausa parcial.',
    careResponsible: 'Lucas',
    nextFollowUpAt: '2026-05-01',
    notes: 'Tem servido com alta frequencia.',
    active: true,
    createdAt: '2025-11-02T10:00:00Z',
    updatedAt: '2026-05-08T10:00:00Z',
    areas: [
      { areaId: 'recepcao', areaName: 'Recepcao', areaSlug: 'recepcao', roleInArea: 'leader' },
      { areaId: 'midia', areaName: 'Midia', areaSlug: 'midia', roleInArea: 'member' },
      { areaId: 'intercessao', areaName: 'Intercessao', areaSlug: 'intercessao', roleInArea: 'member' },
      { areaId: 'kids', areaName: 'Kids', areaSlug: 'kids', roleInArea: 'member' },
    ],
  },
  {
    id: 'demo-carol',
    name: 'Carol Santos',
    normalizedName: 'carol santos',
    photoPath: null,
    gender: 'female',
    birthDate: '1997-05-28',
    joinDate: '2024-08-10',
    address: null,
    whatsapp: '(11) 99999-1003',
    normalizedWhatsapp: '11999991003',
    availabilityStatus: 'available',
    careStatus: 'active',
    lastContactAt: '2026-04-28',
    nextStep: 'Celebrar aniversario e convidar para apoiar integracao de novos.',
    careResponsible: 'Gui',
    nextFollowUpAt: '2026-05-20',
    notes: null,
    active: true,
    createdAt: '2024-08-10T10:00:00Z',
    updatedAt: '2026-05-08T10:00:00Z',
    areas: [
      { areaId: 'louvor', areaName: 'Louvor', areaSlug: 'louvor', roleInArea: 'member' },
      { areaId: 'intercessao', areaName: 'Intercessao', areaSlug: 'intercessao', roleInArea: 'member' },
    ],
  },
  {
    id: 'demo-daniel',
    name: 'Daniel Costa',
    normalizedName: 'daniel costa',
    photoPath: null,
    gender: 'male',
    birthDate: '1992-12-12',
    joinDate: '2023-02-18',
    address: null,
    whatsapp: null,
    normalizedWhatsapp: null,
    availabilityStatus: 'limited',
    careStatus: 'paused',
    lastContactAt: '2026-04-15',
    nextStep: 'Manter pausa e retomar conversa no fim do mes.',
    careResponsible: 'Raul',
    nextFollowUpAt: '2026-05-30',
    notes: 'Em fase de reorganizacao de rotina.',
    active: true,
    createdAt: '2023-02-18T10:00:00Z',
    updatedAt: '2026-05-08T10:00:00Z',
    areas: [
      { areaId: 'midia', areaName: 'Midia', areaSlug: 'midia', roleInArea: 'coordinator' },
      { areaId: 'recepcao', areaName: 'Recepcao', areaSlug: 'recepcao', roleInArea: 'member' },
      { areaId: 'kids', areaName: 'Kids', areaSlug: 'kids', roleInArea: 'member' },
    ],
  },
  {
    id: 'demo-ester',
    name: 'Ester Almeida',
    normalizedName: 'ester almeida',
    photoPath: null,
    gender: 'female',
    birthDate: '2001-01-21',
    joinDate: '2026-05-02',
    address: null,
    whatsapp: '(11) 99999-1005',
    normalizedWhatsapp: '11999991005',
    availabilityStatus: 'available',
    careStatus: 'new',
    lastContactAt: '2026-05-05',
    nextStep: 'Encaminhar para treinamento inicial.',
    careResponsible: 'Gui',
    nextFollowUpAt: '2026-05-12',
    notes: null,
    active: true,
    createdAt: '2026-05-02T10:00:00Z',
    updatedAt: '2026-05-08T10:00:00Z',
    areas: [{ areaId: 'kids', areaName: 'Kids', areaSlug: 'kids', roleInArea: 'member' }],
  },
]

const demoServiceAreas = [
  { id: 'recepcao', name: 'Recepcao', slug: 'recepcao', active: true, sortOrder: 1 },
  { id: 'louvor', name: 'Louvor', slug: 'louvor', active: true, sortOrder: 2 },
  { id: 'midia', name: 'Midia', slug: 'midia', active: true, sortOrder: 3 },
  { id: 'kids', name: 'Kids', slug: 'kids', active: true, sortOrder: 4 },
  { id: 'intercessao', name: 'Intercessao', slug: 'intercessao', active: true, sortOrder: 5 },
]

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function getFilterHref(filter: string) {
  return filter === 'all' ? '/demo/dados' : `/demo/dados?attention=${filter}`
}

export default async function DemoDadosPage({ searchParams }: DemoDadosPageProps) {
  const params = await searchParams
  const attentionFilter = parseAttentionFilter(getSingleSearchParam(params.attention))
  const filteredVolunteers = filterVolunteersByAttention(demoVolunteers, attentionFilter)
  const insights = getVolunteerInsights(demoVolunteers)
  const areaDistribution = getAreaDistribution(demoVolunteers, demoServiceAreas)
  const weeklyActionItems = getWeeklyActionItems(insights, areaDistribution)
  const attentionCount = insights.attention.length + insights.overloaded.length
  const lowCoverageCount = areaDistribution.filter((area) => area.level !== 'healthy').length
  const weeklySummary = [
    `Resumo Dados/Escalas - Semana`,
    ``,
    `1. Novos voluntarios sem proximo passo consolidado: ${insights.newVolunteers.length}`,
    `2. Pessoas sem area: ${insights.unassigned.length}`,
    `3. Pessoas servindo em muitas areas: ${attentionCount}`,
    `4. Pessoas que precisam contato: ${insights.needsContact.length}`,
    `5. Retornos vencidos: ${insights.followUpDue.length}`,
    `6. Areas com baixa cobertura: ${lowCoverageCount}`,
    ``,
    `Prioridades sugeridas:`,
    ...weeklyActionItems.map((item, index) => `${index + 1}. [${item.priority}] ${item.title} - ${item.description}`),
    ``,
    `Decisao sugerida: conversar primeiro com quem esta sem area, com retorno vencido, em possivel sobrecarga ou em area com baixa cobertura.`,
  ].join('\n')

  return (
    <main className="app-layout">
      <div className="page-shell">
        <header className="app-header auth-card">
          <div className="app-brand">
            <span className="eyebrow">Revive Dados</span>
            <strong>Painel de Cuidado - Demo</strong>
            <span className="muted">Base ficticia para apresentacao do MVP</span>
          </div>

          <nav className="nav-links">
            <Link className="nav-link active" href="/demo/dados">
              Demo
            </Link>
            <Link className="nav-link" href="/demo/dados/kit">
              Kit da reuniao
            </Link>
            <Link className="nav-link" href="/dados">
              Painel autenticado
            </Link>
            <Link className="nav-link" href="/voluntarios">
              App real
            </Link>
          </nav>
        </header>

        <div className="main-content section-grid">
          <section className="demo-notice">
            <strong>Ambiente de demonstracao</strong>
            <span>Os dados desta tela sao ficticios e servem apenas para apresentar o conceito do MVP.</span>
          </section>

          <section className="panel">
            <div className="toolbar">
              <div className="stack">
                <span className="eyebrow">Versao real</span>
                <h1 className="panel-title">Quando o Supabase estiver configurado</h1>
                <p className="muted">
                  Use o painel autenticado para ver a mesma logica com dados persistidos, permissoes e cadastro real.
                </p>
              </div>
              <Link className="button-secondary" href="/dados">
                Abrir painel autenticado
              </Link>
            </div>
          </section>

          <section className="stats-grid">
            <article className="stat-card">
              <span className="muted">Voluntarios ativos</span>
              <div className="stat-value">{insights.activeVolunteers.length}</div>
            </article>
            <article className="stat-card">
              <span className="muted">Sem area</span>
              <div className="stat-value">{insights.unassigned.length}</div>
            </article>
            <article className="stat-card">
              <span className="muted">Atencao/sobrecarga</span>
              <div className="stat-value">{attentionCount}</div>
            </article>
            <article className="stat-card">
              <span className="muted">Precisa contato</span>
              <div className="stat-value">{insights.needsContact.length}</div>
            </article>
            <article className="stat-card">
              <span className="muted">Novos 30 dias</span>
              <div className="stat-value">{insights.newVolunteers.length}</div>
            </article>
            <article className="stat-card">
              <span className="muted">Retornos vencidos</span>
              <div className="stat-value">{insights.followUpDue.length}</div>
            </article>
            <article className="stat-card">
              <span className="muted">Areas baixa cobertura</span>
              <div className="stat-value">{lowCoverageCount}</div>
            </article>
          </section>

          <section className="panel">
            <div className="toolbar">
              <div className="stack">
                <span className="eyebrow">Filtros da demo</span>
                <h2 className="panel-title">Ver por leitura de cuidado</h2>
              </div>
            </div>

            <div className="filter-pills">
              {attentionFilterOptions.map((option) => (
                <Link
                  className={option.value === attentionFilter ? 'filter-pill active' : 'filter-pill'}
                  href={getFilterHref(option.value)}
                  key={option.value}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="toolbar">
              <div className="stack">
                <span className="eyebrow">Resumo semanal</span>
                <h1 className="panel-title">Pauta de cuidado para lideranca</h1>
                <p className="muted">
                  Esta demo mostra como os dados deixam a conversa mais objetiva sem transformar cuidado em cobranca.
                </p>
              </div>
            </div>

            <div className="summary-grid">
              <article className="summary-card">
                <strong>Novos sem proximo passo consolidado</strong>
                <span className="muted">{insights.newVolunteers.length} pessoas precisam de acompanhamento inicial</span>
              </article>
              <article className="summary-card">
                <strong>Pessoas sem area</strong>
                <span className="muted">{insights.unassigned.length} precisa de integracao operacional</span>
              </article>
              <article className="summary-card">
                <strong>Possivel excesso de carga</strong>
                <span className="muted">{attentionCount} servem em 3 ou mais areas</span>
              </article>
              <article className="summary-card">
                <strong>Retornos vencidos</strong>
                <span className="muted">{insights.followUpDue.length} conversas precisam ser retomadas</span>
              </article>
              <article className="summary-card">
                <strong>Areas com baixa cobertura</strong>
                <span className="muted">{lowCoverageCount} precisam de captacao ou redistribuicao</span>
              </article>
            </div>
          </section>

          <section className="panel">
            <div className="toolbar">
              <div className="stack">
                <span className="eyebrow">Prioridades da semana</span>
                <h2 className="panel-title">O que a lideranca deveria decidir primeiro?</h2>
                <p className="muted">A demo transforma sinais em uma lista curta de acoes para a proxima conversa.</p>
              </div>
            </div>

            <div className="priority-grid">
              {weeklyActionItems.map((item) => (
                <article className="priority-card" key={item.title}>
                  <span className={item.priority === 'Alta' ? 'badge-danger' : item.priority === 'Media' ? 'badge-warning' : 'badge'}>
                    {item.priority}
                  </span>
                  <strong>{item.title}</strong>
                  <span className="muted">{item.description}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="toolbar">
              <div className="stack">
                <span className="eyebrow">Distribuicao por area</span>
                <h2 className="panel-title">Onde precisamos captar ou redistribuir?</h2>
                <p className="muted">Uma leitura rapida para conectar Dados com Captação e lideres de ministerio.</p>
              </div>
            </div>

            <div className="area-grid">
              {areaDistribution.map((area) => (
                <article className="area-card" key={area.areaId}>
                  <div className="toolbar compact-toolbar">
                    <strong>{area.areaName}</strong>
                    <span className={area.level === 'healthy' ? 'badge' : 'badge-warning'}>{area.label}</span>
                  </div>
                  <div className="stat-value">{area.volunteerCount}</div>
                  <span className="muted">
                    {area.overloadedCount > 0
                      ? `${area.overloadedCount} tambem aparecem em possivel sobrecarga`
                      : 'Sem sinal de sobrecarga nessa area'}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="toolbar">
              <div className="stack">
                <span className="eyebrow">Texto pronto</span>
                <h2 className="panel-title">Resumo semanal para copiar</h2>
                <p className="muted">Um exemplo simples do que Dados pode entregar para os lideres toda semana.</p>
              </div>
              <CopyTextButton text={weeklySummary} />
            </div>
            <pre className="copy-block">{weeklySummary}</pre>
          </section>

          <section className="panel table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Voluntario</th>
                  <th>Cuidado</th>
                  <th>Disponibilidade</th>
                  <th>Areas</th>
                  <th>Proximo passo</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map((volunteer) => {
                  const loadStatus = getAreaLoadStatus(volunteer)
                  const attentionLabels = getVolunteerAttentionLabels(volunteer)
                  const whatsappHref = getWhatsappHref(volunteer.whatsapp)

                  return (
                    <tr key={volunteer.id}>
                      <td>
                        <div className="stack">
                          <strong>{volunteer.name}</strong>
                          {whatsappHref ? (
                            <a className="inline-link" href={whatsappHref} rel="noreferrer" target="_blank">
                              Chamar no WhatsApp
                            </a>
                          ) : (
                            <span className="muted">WhatsApp nao informado</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="stack">
                          <span className={loadStatus.className}>{loadStatus.label}</span>
                          <span className="muted">{formatCareStatus(volunteer.careStatus)}</span>
                          <span className="muted">
                            {attentionLabels.length > 0 ? attentionLabels.join(' / ') : 'Sem alerta adicional'}
                          </span>
                        </div>
                      </td>
                      <td>{formatAvailabilityStatus(volunteer.availabilityStatus)}</td>
                      <td>
                        <div className="stack">
                          {volunteer.areas.length > 0 ? (
                            volunteer.areas.map((area) => (
                              <span className="muted" key={`${volunteer.id}-${area.areaId}`}>
                                {area.areaName} - {formatAreaRole(area.roleInArea)}
                              </span>
                            ))
                          ) : (
                            <span className="muted">Sem area vinculada</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="stack">
                          <span>{volunteer.nextStep || 'Sem proximo passo registrado.'}</span>
                          <span className="muted">Ultimo contato: {formatDate(volunteer.lastContactAt)}</span>
                          <span className="muted">Proximo retorno: {formatDate(volunteer.nextFollowUpAt)}</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </main>
  )
}
