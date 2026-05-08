import Link from 'next/link'

import { CopyTextButton } from '@/components/copy-text-button'
import { formatCareStatus, formatDate } from '@/lib/format'
import type { VolunteerRecord } from '@/lib/types'
import { getVolunteers } from '@/lib/volunteers/data'
import { getWhatsappHref } from '@/lib/volunteers/insights'

export const dynamic = 'force-dynamic'

type JourneyStage = {
  description: string
  key: string
  priority: 'Alta' | 'Media' | 'Baixa'
  title: string
  volunteers: VolunteerRecord[]
}

function buildJourneyStages(volunteers: VolunteerRecord[]): JourneyStage[] {
  const activeVolunteers = volunteers.filter((volunteer) => volunteer.active)

  return [
    {
      description: 'Pessoas novas que ainda nao foram conectadas a uma area.',
      key: 'new-unassigned',
      priority: 'Alta',
      title: 'Novo sem area',
      volunteers: activeVolunteers.filter(
        (volunteer) => volunteer.careStatus === 'new' && volunteer.areas.length === 0,
      ),
    },
    {
      description: 'Pessoas novas ja vinculadas a uma area, mas ainda em acompanhamento inicial.',
      key: 'new-assigned',
      priority: 'Media',
      title: 'Novo com area',
      volunteers: activeVolunteers.filter(
        (volunteer) => volunteer.careStatus === 'new' && volunteer.areas.length > 0,
      ),
    },
    {
      description: 'Pessoas que precisam de conversa, decisao ou cuidado antes do proximo passo.',
      key: 'needs-contact',
      priority: 'Alta',
      title: 'Precisa contato',
      volunteers: volunteers.filter((volunteer) => volunteer.careStatus === 'needs_contact'),
    },
    {
      description: 'Pessoas ativas, vinculadas a area e sem alerta principal de cuidado.',
      key: 'integrated',
      priority: 'Baixa',
      title: 'Ativo integrado',
      volunteers: activeVolunteers.filter(
        (volunteer) => volunteer.careStatus === 'active' && volunteer.areas.length > 0,
      ),
    },
    {
      description: 'Pessoas em pausa combinada ou aguardando retorno.',
      key: 'paused',
      priority: 'Media',
      title: 'Em pausa',
      volunteers: volunteers.filter((volunteer) => volunteer.careStatus === 'paused'),
    },
    {
      description: 'Pessoas que nao estao servindo atualmente.',
      key: 'inactive',
      priority: 'Baixa',
      title: 'Inativo',
      volunteers: volunteers.filter((volunteer) => !volunteer.active || volunteer.careStatus === 'inactive'),
    },
  ]
}

function getPriorityClassName(priority: JourneyStage['priority']) {
  if (priority === 'Alta') {
    return 'badge-danger'
  }

  if (priority === 'Media') {
    return 'badge-warning'
  }

  return 'badge'
}

function getJourneySummary(stages: JourneyStage[]) {
  const lines = stages.map((stage) => `- ${stage.title}: ${stage.volunteers.length}`)

  return [
    'Jornada do Voluntario - Revive',
    '',
    ...lines,
    '',
    'Prioridade sugerida:',
    '1. Conectar novos sem area.',
    '2. Definir proximo passo para quem precisa contato.',
    '3. Revisar pessoas em pausa e retornos pendentes.',
  ].join('\n')
}

function getStageAction(stage: JourneyStage) {
  if (stage.key === 'new-unassigned') {
    return 'Definir area, lider responsavel e primeiro contato.'
  }

  if (stage.key === 'new-assigned') {
    return 'Confirmar acolhimento, treinamento inicial e proximo passo.'
  }

  if (stage.key === 'needs-contact') {
    return 'Conversar, registrar decisao e atualizar status de cuidado.'
  }

  if (stage.key === 'paused') {
    return 'Combinar retorno ou manter pausa com data de acompanhamento.'
  }

  if (stage.key === 'inactive') {
    return 'Manter historico limpo e evitar incluir em escala ativa.'
  }

  return 'Acompanhar saude, carga e continuidade no servico.'
}

export default async function JornadaVoluntarioPage() {
  const volunteers = await getVolunteers({ status: 'all' })
  const stages = buildJourneyStages(volunteers)
  const summary = getJourneySummary(stages)
  const criticalStages = stages.filter((stage) => stage.priority === 'Alta')
  const totalInJourney = stages.reduce((sum, stage) => sum + stage.volunteers.length, 0)
  const blockedCount = criticalStages.reduce((sum, stage) => sum + stage.volunteers.length, 0)

  return (
    <div className="section-grid">
      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Dados/Escalas</span>
            <h1 className="panel-title">Jornada do Voluntario</h1>
            <p className="muted">
              Uma leitura simples do caminho entre chegada, integracao, cuidado, pausa e atividade.
            </p>
          </div>
          <div className="nav-links">
            <CopyTextButton text={summary} />
            <Link className="button-secondary" href="/dados/mapa">
              Mapa Vivo
            </Link>
            <Link className="button-secondary" href="/dados">
              Painel
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="muted">Na jornada</span>
          <div className="stat-value">{totalInJourney}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Gargalos criticos</span>
          <div className="stat-value">{blockedCount}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Novos sem area</span>
          <div className="stat-value">{stages.find((stage) => stage.key === 'new-unassigned')?.volunteers.length ?? 0}</div>
        </article>
        <article className="stat-card">
          <span className="muted">Precisam contato</span>
          <div className="stat-value">{stages.find((stage) => stage.key === 'needs-contact')?.volunteers.length ?? 0}</div>
        </article>
      </section>

      <section className="section-grid">
        {stages.map((stage) => (
          <article className="panel" key={stage.key}>
            <div className="toolbar">
              <div className="stack">
                <span className={getPriorityClassName(stage.priority)}>{stage.priority}</span>
                <h2 className="panel-title">
                  {stage.title} ({stage.volunteers.length})
                </h2>
                <p className="muted">{stage.description}</p>
                <p className="muted">
                  <strong>Acao:</strong> {getStageAction(stage)}
                </p>
              </div>
            </div>

            {stage.volunteers.length === 0 ? (
              <div className="empty-state">Nenhum voluntario neste estagio.</div>
            ) : (
              <div className="stack">
                {stage.volunteers.slice(0, 8).map((volunteer) => {
                  const whatsappHref = getWhatsappHref(volunteer.whatsapp)

                  return (
                    <div className="list-card" key={`${stage.key}-${volunteer.id}`}>
                      <div className="toolbar compact-toolbar">
                        <div className="stack">
                          <Link href={`/voluntarios/${volunteer.id}`}>
                            <strong>{volunteer.name}</strong>
                          </Link>
                          <span className="muted">
                            {formatCareStatus(volunteer.careStatus)} / Entrada: {formatDate(volunteer.joinDate)}
                          </span>
                        </div>
                        {whatsappHref ? (
                          <a className="inline-link" href={whatsappHref} rel="noreferrer" target="_blank">
                            WhatsApp
                          </a>
                        ) : null}
                      </div>
                      <span className="muted">
                        Areas:{' '}
                        {volunteer.areas.length > 0
                          ? volunteer.areas.map((area) => area.areaName).join(', ')
                          : 'sem area'}
                      </span>
                      <span className="muted">
                        Proximo passo: {volunteer.nextStep || 'sem proximo passo'}
                      </span>
                    </div>
                  )
                })}
                {stage.volunteers.length > 8 ? (
                  <span className="muted">Mais {stage.volunteers.length - 8} pessoa(s) neste estagio.</span>
                ) : null}
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  )
}
