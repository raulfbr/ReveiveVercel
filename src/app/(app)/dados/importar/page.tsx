import Link from 'next/link'

import { CopyTextButton } from '@/components/copy-text-button'
import { CsvVolunteerImportPreview } from '@/components/csv-volunteer-import-preview'
import { requireAdmin } from '@/lib/auth/permissions'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getServiceAreas, getVolunteers } from '@/lib/volunteers/data'

import { importVolunteersCsvAction } from './actions'

export const dynamic = 'force-dynamic'

type ImportarDadosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

type ImportLogRow = {
  created_volunteer_ids?: string[] | null
  id: string
  created_by_email: string | null
  created_at: string
  imported_count: number
  privacy_confirmed: boolean
  skipped_count: number
  total_rows: number
}

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function getRecentImportLogs(): Promise<{
  advancedAudit: boolean
  error: string | null
  logs: ImportLogRow[]
}> {
  const supabase = await createSupabaseServerClient()
  const advancedResult = await supabase
    .from('volunteer_import_logs')
    .select(
      'id, created_by_email, created_at, created_volunteer_ids, imported_count, privacy_confirmed, skipped_count, total_rows',
    )
    .order('created_at', { ascending: false })
    .limit(5)

  if (!advancedResult.error) {
    return {
      advancedAudit: true,
      error: null,
      logs: (advancedResult.data ?? []) as ImportLogRow[],
    }
  }

  const legacyResult = await supabase
    .from('volunteer_import_logs')
    .select('id, created_by_email, created_at, imported_count, privacy_confirmed, skipped_count, total_rows')
    .order('created_at', { ascending: false })
    .limit(5)

  if (legacyResult.error) {
    return {
      advancedAudit: false,
      error: legacyResult.error.message,
      logs: [],
    }
  }

  return {
    advancedAudit: false,
    error: null,
    logs: (legacyResult.data ?? []) as ImportLogRow[],
  }
}

export default async function ImportarDadosPage({ searchParams }: ImportarDadosPageProps) {
  await requireAdmin()
  const params = await searchParams
  const [serviceAreas, volunteers, importLogsResult] = await Promise.all([
    getServiceAreas(),
    getVolunteers({ status: 'all' }),
    getRecentImportLogs(),
  ])
  const existingPhones = volunteers
    .map((volunteer) => volunteer.normalizedWhatsapp)
    .filter((phone): phone is string => Boolean(phone))
  const errorMessage = getSingleSearchParam(params.error)
  const importedCount = getSingleSearchParam(params.imported)
  const skippedCount = getSingleSearchParam(params.skipped)
  const logStatus = getSingleSearchParam(params.log)
  const postImportSummary = importedCount
    ? [
        'Resumo da importacao CSV - Dados/Escalas',
        '',
        `Registros criados: ${importedCount}`,
        `Registros ignorados: ${skippedCount ?? '0'}`,
        '',
        'Proximos passos:',
        '1. Abrir o Painel de Cuidado em /dados.',
        '2. Conferir pessoas sem area ou com precisa contato.',
        '3. Revisar proximos passos e responsaveis.',
        '4. Usar o resumo semanal como pauta de lideranca.',
      ].join('\n')
    : null

  return (
    <div className="section-grid">
      {errorMessage ? <p className="error-message">{decodeURIComponent(errorMessage)}</p> : null}
      {importedCount ? (
        <p className="success-message">
          Importacao concluida: {importedCount} registro(s) criado(s), {skippedCount ?? '0'} ignorado(s).
        </p>
      ) : null}
      {logStatus === 'failed' ? (
        <p className="error-message">
          A importacao foi concluida, mas o registro de auditoria nao foi salvo. Verifique se a migration
          `20260508_0005_volunteer_import_logs.sql` ja foi aplicada.
        </p>
      ) : null}
      {logStatus === 'legacy' ? (
        <p className="error-message">
          A importacao foi concluida e o log basico foi salvo, mas a auditoria avancada de IDs criados ainda
          depende da migration `20260508_0006_volunteer_import_log_created_ids.sql`.
        </p>
      ) : null}

      {importedCount ? (
        <section className="panel">
          <div className="toolbar">
            <div className="stack">
              <span className="eyebrow">Pos-importacao</span>
              <h2 className="panel-title">Proximos passos recomendados</h2>
              <p className="muted">
                Antes de usar a base na reuniao, confira o painel, revise voluntarios importados
                e defina proximos passos para quem precisa de cuidado.
              </p>
            </div>
            <div className="nav-links">
              {postImportSummary ? <CopyTextButton text={postImportSummary} /> : null}
              <Link className="button" href="/dados">
                Abrir painel
              </Link>
              <Link className="button-secondary" href="/voluntarios">
                Revisar cadastro
              </Link>
            </div>
          </div>
          <div className="copy-block">
            1. Abra o Painel de Cuidado e veja se os cards mudaram como esperado.
            {'\n'}2. Confira pessoas sem area ou com precisa contato.
            {'\n'}3. Revise se os proximos passos tem responsavel.
            {'\n'}4. Use o resumo semanal para levar a pauta para lideranca.
          </div>
        </section>
      ) : null}

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Dados/Escalas</span>
            <h1 className="panel-title">Importar voluntarios por CSV</h1>
            <p className="muted">
              Primeiro passo seguro: validar arquivo, privacidade, campos obrigatorios,
              datas, status e duplicidades antes de qualquer gravacao.
            </p>
          </div>

          <Link className="button-secondary" href="/dados">
            Voltar ao painel
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Regras desta versao</span>
            <h2 className="panel-title">Importacao conservadora</h2>
            <p className="muted">
              Esta versao cria apenas novos voluntarios, nao sobrescreve telefones existentes,
              exige confirmacao de privacidade e limita o envio a 200 registros por vez.
            </p>
            <p className="muted">
              Areas reconhecidas:{' '}
              {serviceAreas.length > 0 ? serviceAreas.map((area) => area.name).join(', ') : 'nenhuma area ativa encontrada'}.
            </p>
          </div>
        </div>
        <div className="copy-block">
          O importador nao cria areas automaticamente e nao grava email na versao atual.
          Se uma linha tiver area inexistente, telefone duplicado ou telefone ja cadastrado, ela sera ignorada.
          Cada importacao confirmada gera um registro de auditoria quando a migration de logs estiver aplicada.
          Com a auditoria avancada, o log tambem guarda os IDs dos voluntarios criados.
        </div>
      </section>

      <section className="panel table-wrapper">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Auditoria</span>
            <h2 className="panel-title">Importacoes recentes</h2>
            <p className="muted">
              Ultimos registros salvos em `volunteer_import_logs` para acompanhar quem importou
              e o resultado de cada envio.
            </p>
            {!importLogsResult.error && !importLogsResult.advancedAudit ? (
              <p className="muted">
                Auditoria basica ativa. Aplique `20260508_0006_volunteer_import_log_created_ids.sql`
                para registrar os IDs criados em cada importacao.
              </p>
            ) : null}
          </div>
        </div>

        {importLogsResult.error ? (
          <div className="empty-state">
            Historico indisponivel. Aplique a migration `20260508_0005_volunteer_import_logs.sql`
            para ativar a auditoria de importacoes.
          </div>
        ) : importLogsResult.logs.length === 0 ? (
          <div className="empty-state">Nenhuma importacao registrada ainda.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Criados</th>
                <th>Ignorados</th>
                <th>Privacidade</th>
                <th>IDs criados</th>
                <th>Revisao</th>
              </tr>
            </thead>
            <tbody>
              {importLogsResult.logs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDateTime(log.created_at)}</td>
                  <td>{log.created_by_email ?? 'Usuario nao registrado'}</td>
                  <td>{log.total_rows}</td>
                  <td>{log.imported_count}</td>
                  <td>{log.skipped_count}</td>
                  <td>
                    <span className={log.privacy_confirmed ? 'badge' : 'badge-warning'}>
                      {log.privacy_confirmed ? 'Confirmada' : 'Pendente'}
                    </span>
                  </td>
                  <td>
                    {importLogsResult.advancedAudit ? (
                      <span className="muted">{log.created_volunteer_ids?.length ?? 0} registrado(s)</span>
                    ) : (
                      <span className="muted">Migration 0006 pendente</span>
                    )}
                  </td>
                  <td>
                    {importLogsResult.advancedAudit && (log.created_volunteer_ids?.length ?? 0) > 0 ? (
                      <Link className="inline-link" href={`/dados/importar/${log.id}`}>
                        Ver criados
                      </Link>
                    ) : (
                      <span className="muted">Indisponivel</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <CsvVolunteerImportPreview
        existingPhones={existingPhones}
        importAction={importVolunteersCsvAction}
        serviceAreas={serviceAreas.map((area) => ({
          name: area.name,
          slug: area.slug,
        }))}
      />
    </div>
  )
}
