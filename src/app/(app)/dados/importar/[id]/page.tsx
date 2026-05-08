import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CopyTextButton } from '@/components/copy-text-button'
import { requireAdmin } from '@/lib/auth/permissions'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { formatCareStatus } from '@/lib/format'
import type { VolunteerCareStatus } from '@/lib/types'

export const dynamic = 'force-dynamic'

type ImportLogDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

type ImportLogDetail = {
  id: string
  created_at: string
  created_by_email: string | null
  created_volunteer_ids: string[] | null
  imported_count: number
  privacy_confirmed: boolean
  skipped_count: number
  total_rows: number
}

type ImportedVolunteerRow = {
  id: string
  active: boolean
  care_status: VolunteerCareStatus
  name: string
  next_step: string | null
  whatsapp: string | null
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function escapeCsvValue(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

async function getImportLogDetail(importLogId: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('volunteer_import_logs')
    .select(
      'id, created_at, created_by_email, created_volunteer_ids, imported_count, privacy_confirmed, skipped_count, total_rows',
    )
    .eq('id', importLogId)
    .maybeSingle()

  if (error) {
    return {
      error: error.message,
      log: null,
      volunteers: [],
    }
  }

  if (!data) {
    return {
      error: null,
      log: null,
      volunteers: [],
    }
  }

  const log = data as ImportLogDetail
  const createdVolunteerIds = log.created_volunteer_ids ?? []

  if (createdVolunteerIds.length === 0) {
    return {
      error: null,
      log,
      volunteers: [],
    }
  }

  const { data: volunteers, error: volunteersError } = await supabase
    .from('volunteers')
    .select('id, active, care_status, name, next_step, whatsapp')
    .in('id', createdVolunteerIds)
    .order('name')

  return {
    error: volunteersError?.message ?? null,
    log,
    volunteers: (volunteers ?? []) as ImportedVolunteerRow[],
  }
}

export default async function ImportLogDetailPage({ params }: ImportLogDetailPageProps) {
  await requireAdmin()
  const { id } = await params
  const { error, log, volunteers } = await getImportLogDetail(id)

  if (!log && !error) {
    notFound()
  }

  const summary =
    log && !error
      ? [
          'Revisao de importacao CSV - Dados/Escalas',
          '',
          `Data: ${formatDateTime(log.created_at)}`,
          `Usuario: ${log.created_by_email ?? 'Usuario nao registrado'}`,
          `Total de linhas: ${log.total_rows}`,
          `Registros criados: ${log.imported_count}`,
          `Registros ignorados: ${log.skipped_count}`,
          `Privacidade confirmada: ${log.privacy_confirmed ? 'sim' : 'nao'}`,
          `IDs registrados: ${log.created_volunteer_ids?.length ?? 0}`,
          '',
          'Proximos passos:',
          '1. Revisar os cadastros criados.',
          '2. Conferir pessoas sem area ou com precisa contato.',
          '3. Abrir /dados e copiar o resumo semanal.',
        ].join('\n')
      : null
  const volunteersCsv =
    volunteers.length > 0
      ? [
          ['id', 'name', 'whatsapp', 'active', 'care_status', 'next_step'].join(','),
          ...volunteers.map((volunteer) =>
            [
              volunteer.id,
              volunteer.name,
              volunteer.whatsapp ?? '',
              volunteer.active ? 'true' : 'false',
              volunteer.care_status,
              volunteer.next_step ?? '',
            ]
              .map(escapeCsvValue)
              .join(','),
          ),
        ].join('\n')
      : null

  return (
    <div className="section-grid">
      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Auditoria</span>
            <h1 className="panel-title">Detalhe da importacao</h1>
            <p className="muted">
              Revisao dos voluntarios criados por uma importacao CSV. Esta tela e apenas
              de leitura.
            </p>
          </div>
          <div className="nav-links">
            {summary ? <CopyTextButton text={summary} /> : null}
            <Link className="button-secondary" href="/dados/importar">
              Voltar ao importador
            </Link>
          </div>
        </div>
      </section>

      {error ? (
        <p className="error-message">
          Nao foi possivel carregar a auditoria avancada desta importacao. Verifique se a migration
          `20260508_0006_volunteer_import_log_created_ids.sql` ja foi aplicada.
        </p>
      ) : null}

      {log && !error ? (
        <>
          <section className="stats-grid">
            <article className="stat-card">
              <span className="muted">Data</span>
              <div className="stat-value">{formatDateTime(log.created_at)}</div>
            </article>
            <article className="stat-card">
              <span className="muted">Criados</span>
              <div className="stat-value">{log.imported_count}</div>
            </article>
            <article className="stat-card">
              <span className="muted">Ignorados</span>
              <div className="stat-value">{log.skipped_count}</div>
            </article>
            <article className="stat-card">
              <span className="muted">IDs registrados</span>
              <div className="stat-value">{log.created_volunteer_ids?.length ?? 0}</div>
            </article>
          </section>

          <section className="panel table-wrapper">
            {volunteers.length === 0 ? (
              <div className="empty-state">
                Nenhum voluntario criado foi encontrado para este log. Isso pode indicar que a importacao
                nao criou registros, que a auditoria avancada ainda nao registrava IDs, ou que os cadastros
                foram removidos depois.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Voluntario</th>
                    <th>Status</th>
                    <th>Ativo</th>
                    <th>WhatsApp</th>
                    <th>Proximo passo</th>
                    <th>Revisao</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((volunteer) => (
                    <tr key={volunteer.id}>
                      <td>
                        <strong>{volunteer.name}</strong>
                      </td>
                      <td>{formatCareStatus(volunteer.care_status)}</td>
                      <td>{volunteer.active ? 'Sim' : 'Nao'}</td>
                      <td>{volunteer.whatsapp ?? 'Nao informado'}</td>
                      <td>{volunteer.next_step ?? 'Sem proximo passo'}</td>
                      <td>
                        <Link className="inline-link" href={`/voluntarios/${volunteer.id}`}>
                          Abrir cadastro
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {volunteersCsv ? (
            <section className="panel">
              <div className="toolbar">
                <div className="stack">
                  <span className="eyebrow">Conferencia</span>
                  <h2 className="panel-title">CSV dos cadastros criados</h2>
                  <p className="muted">
                    Use este bloco para revisar, prestar contas ou comparar manualmente os
                    registros criados por esta importacao.
                  </p>
                </div>
                <CopyTextButton text={volunteersCsv} />
              </div>
              <pre className="copy-block">{volunteersCsv}</pre>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
