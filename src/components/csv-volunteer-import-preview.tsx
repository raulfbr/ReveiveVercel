'use client'

import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

const acceptedHeaders = [
  'name',
  'phone',
  'email',
  'area',
  'active',
  'care_status',
  'joined_at',
  'last_contact_at',
  'next_step',
  'care_responsible',
  'next_follow_up_at',
  'notes',
] as const

const requiredHeaders = ['name', 'phone', 'active', 'care_status'] as const
const careStatuses = ['new', 'active', 'needs_contact', 'paused', 'inactive'] as const
const templateCsv = [
  acceptedHeaders.join(','),
  'Ana Souza,11999999999,ana@example.com,Recepcao,true,active,2026-04-12,2026-05-01,Confirmar disponibilidade de junho,Lucas,2026-05-15,Prefere domingo',
  'Bruno Lima,11988888888,,,true,new,2026-05-05,,Fazer primeiro contato e entender area de interesse,Raul,2026-05-10,Veio pelo GC',
  'Carla Mendes,11977777777,carla@example.com,Kids,true,needs_contact,2025-11-20,2026-04-01,Entender se precisa de pausa,Mariana,2026-05-09,',
].join('\r\n')

type AcceptedHeader = (typeof acceptedHeaders)[number]
type CsvValues = Record<AcceptedHeader, string>

type PreviewRow = {
  errors: string[]
  lineNumber: number
  values: CsvValues
  warnings: string[]
}

type PreviewResult = {
  fileError: string | null
  fileWarnings: string[]
  headers: string[]
  rows: PreviewRow[]
}

type CsvVolunteerImportPreviewProps = {
  existingPhones: string[]
  importAction: (formData: FormData) => Promise<void>
  serviceAreas: Array<{
    name: string
    slug: string
  }>
}

function normalizeHeader(value: string) {
  return value.replace(/^\uFEFF/, '').trim().toLowerCase()
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

function normalizeLookup(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function parseBoolean(value: string) {
  const normalized = value.trim().toLowerCase()

  if (normalized === 'true') {
    return true
  }

  if (normalized === 'false') {
    return false
  }

  return null
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  return date.toISOString().slice(0, 10) === value
}

function emptyCsvValues(): CsvValues {
  return Object.fromEntries(acceptedHeaders.map((header) => [header, ''])) as CsvValues
}

function detectDelimiter(text: string) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? ''
  const commaCount = (firstLine.match(/,/g) ?? []).length
  const semicolonCount = (firstLine.match(/;/g) ?? []).length

  return semicolonCount > commaCount ? ';' : ','
}

function parseCsvRows(text: string) {
  const delimiter = detectDelimiter(text)
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const nextChar = text[index + 1]

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        field += '"'
        index += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }

      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === delimiter) {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (char !== '\r') {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((currentRow) => currentRow.some((cell) => cell.trim().length > 0))
}

function buildPreview(
  text: string,
  existingPhones: string[],
  serviceAreas: CsvVolunteerImportPreviewProps['serviceAreas'],
): PreviewResult {
  const parsedRows = parseCsvRows(text)
  const existingPhoneSet = new Set(existingPhones.map(normalizePhone).filter(Boolean))
  const areaLookup = new Set(
    serviceAreas.flatMap((area) => [normalizeLookup(area.name), normalizeLookup(area.slug)]),
  )

  if (parsedRows.length === 0) {
    return {
      fileError: 'O arquivo nao possui linhas para importar.',
      fileWarnings: [],
      headers: [],
      rows: [],
    }
  }

  const headers = parsedRows[0].map(normalizeHeader)
  const headerSet = new Set(headers)
  const missingRequiredHeaders = requiredHeaders.filter((header) => !headerSet.has(header))

  if (missingRequiredHeaders.length > 0) {
    return {
      fileError: `Cabecalho incompleto. Campos obrigatorios ausentes: ${missingRequiredHeaders.join(', ')}.`,
      fileWarnings: [],
      headers,
      rows: [],
    }
  }

  const fileWarnings = headers
    .filter((header) => !acceptedHeaders.includes(header as AcceptedHeader))
    .map((header) => `Coluna "${header}" nao faz parte do template e sera ignorada.`)

  const headerIndexes = new Map(headers.map((header, index) => [header, index]))
  const seenPhones = new Map<string, number>()
  const rows = parsedRows.slice(1).map((csvRow, rowIndex) => {
    const lineNumber = rowIndex + 2
    const values = emptyCsvValues()

    acceptedHeaders.forEach((header) => {
      const headerIndex = headerIndexes.get(header)
      values[header] = headerIndex === undefined ? '' : (csvRow[headerIndex] ?? '').trim()
    })

    const errors: string[] = []
    const warnings: string[] = []
    const normalizedPhone = normalizePhone(values.phone)
    const active = parseBoolean(values.active)
    const careStatus = values.care_status.trim()

    if (!values.name) {
      errors.push('Campo name e obrigatorio.')
    }

    if (!normalizedPhone) {
      errors.push('Campo phone e obrigatorio.')
    } else {
      const duplicateLine = seenPhones.get(normalizedPhone)

      if (duplicateLine) {
        errors.push(`Telefone duplicado no arquivo. Tambem aparece na linha ${duplicateLine}.`)
      } else {
        seenPhones.set(normalizedPhone, lineNumber)
      }

      if (existingPhoneSet.has(normalizedPhone)) {
        errors.push('Telefone ja existe na base atual. Esta V0 nao sobrescreve voluntarios existentes.')
      }
    }

    if (active === null) {
      errors.push('Campo active deve ser true ou false.')
    }

    if (!careStatuses.includes(careStatus as (typeof careStatuses)[number])) {
      errors.push('Campo care_status deve ser new, active, needs_contact, paused ou inactive.')
    }

    if (careStatus === 'inactive' && active === true) {
      errors.push('Quando care_status for inactive, active deve ser false.')
    }

    if (active === false && careStatus !== 'inactive' && careStatus !== 'paused') {
      errors.push('Quando active for false, care_status deve ser inactive ou paused.')
    }

    ;(['joined_at', 'last_contact_at', 'next_follow_up_at'] as const).forEach((fieldName) => {
      if (values[fieldName] && !isIsoDate(values[fieldName])) {
        errors.push(`Campo ${fieldName} deve usar o formato AAAA-MM-DD.`)
      }
    })

    if (careStatus === 'needs_contact' && !values.next_step) {
      warnings.push('needs_contact deveria ter next_step sempre que possivel.')
    }

    if (values.area && !areaLookup.has(normalizeLookup(values.area))) {
      errors.push(`Area "${values.area}" nao foi encontrada no sistema.`)
    }

    if (values.next_step && !values.care_responsible) {
      warnings.push('Existe next_step, mas care_responsible esta vazio.')
    }

    if (values.care_responsible && !values.next_follow_up_at) {
      warnings.push('Existe care_responsible, mas next_follow_up_at esta vazio.')
    }

    if (values.active === 'true' && !values.area) {
      warnings.push('Voluntario ativo sem area. Pode ser prioridade de integracao.')
    }

    if (values.notes.length > 180) {
      warnings.push('Notes esta longo. Revise se nao ha informacao sensivel ou desnecessaria.')
    }

    return {
      errors,
      lineNumber,
      values,
      warnings,
    }
  })

  return {
    fileError: null,
    fileWarnings,
    headers,
    rows,
  }
}

function getRowStatus(row: PreviewRow) {
  if (row.errors.length > 0) {
    return {
      className: 'badge-danger',
      label: 'Erro',
    }
  }

  if (row.warnings.length > 0) {
    return {
      className: 'badge-warning',
      label: 'Aviso',
    }
  }

  return {
    className: 'badge',
    label: 'Valida',
  }
}

function escapeCsvValue(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

function buildCsvText(rows: PreviewRow[]) {
  const header = acceptedHeaders.join(',')
  const body = rows
    .map((row) => acceptedHeaders.map((headerName) => escapeCsvValue(row.values[headerName])).join(','))
    .join('\r\n')

  return body.length > 0 ? `${header}\r\n${body}\r\n` : `${header}\r\n`
}

export function CsvVolunteerImportPreview({
  existingPhones,
  importAction,
  serviceAreas,
}: CsvVolunteerImportPreviewProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [preview, setPreview] = useState<PreviewResult | null>(null)
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false)

  const summary = useMemo(() => {
    if (!preview) {
      return {
        duplicates: 0,
        errorRows: 0,
        totalRows: 0,
        validRows: 0,
        warningRows: 0,
      }
    }

    return {
      duplicates: preview.rows.filter((row) => row.errors.some((error) => error.includes('duplicado') || error.includes('existe na base'))).length,
      errorRows: preview.rows.filter((row) => row.errors.length > 0).length,
      totalRows: preview.rows.length,
      validRows: preview.rows.filter((row) => row.errors.length === 0).length,
      warningRows: preview.rows.filter((row) => row.errors.length === 0 && row.warnings.length > 0).length,
    }
  }, [preview])

  const validRowsCsv = useMemo(() => {
    if (!preview) {
      return ''
    }

    const validRows = preview.rows.filter((row) => row.errors.length === 0)

    return validRows.length > 0 ? buildCsvText(validRows) : ''
  }, [preview])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setPrivacyConfirmed(false)

    if (!file) {
      setFileName(null)
      setPreview(null)
      return
    }

    setFileName(file.name)
    const text = await file.text()
    setPreview(buildPreview(text, existingPhones, serviceAreas))
  }

  function handleDownloadValidRows() {
    if (!validRowsCsv) {
      return
    }

    const blob = new Blob([validRowsCsv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `voluntarios-validos-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function handleDownloadTemplate() {
    const blob = new Blob([`${templateCsv}\r\n`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'template-coleta-voluntarios.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="section-grid">
      <section className="panel">
        <div className="toolbar">
          <div className="stack">
            <span className="eyebrow">Importacao CSV</span>
            <h2 className="panel-title">Validar base antes de gravar</h2>
            <p className="muted">
              Selecione um CSV no formato do template. Esta versao apenas valida e
              mostra a pre-visualizacao; ela ainda nao grava dados no Supabase.
            </p>
          </div>

          <div className="nav-links">
            {summary.validRows > 0 ? (
              <>
                <form action={importAction}>
                  <input name="csv_payload" type="hidden" value={validRowsCsv} />
                  <input name="privacy_confirmed" type="hidden" value={privacyConfirmed ? 'yes' : 'no'} />
                  <button className="button" disabled={!privacyConfirmed} type="submit">
                    Confirmar importacao
                  </button>
                </form>
                <button className="button-secondary" onClick={handleDownloadValidRows} type="button">
                  Baixar linhas validas
                </button>
              </>
            ) : null}
            <button className="button-secondary" onClick={handleDownloadTemplate} type="button">
              Baixar template CSV
            </button>
            <label className="file-input">
              Selecionar CSV
              <input accept=".csv,text/csv" hidden onChange={handleFileChange} type="file" />
            </label>
          </div>
        </div>

        <div className="copy-block">
          Revise se o arquivo nao contem informacoes sensiveis, detalhes pastorais privados,
          diagnosticos, conflitos ou comentarios que possam expor pessoas. Use apenas
          observacoes curtas e neutras.
        </div>

        <label className="checkbox-row">
          <input
            checked={privacyConfirmed}
            onChange={(event) => setPrivacyConfirmed(event.target.checked)}
            type="checkbox"
          />
          <span>
            Confirmo que revisei privacidade, removi informacoes sensiveis e quero importar
            apenas as linhas validas.
          </span>
        </label>

        <p className="muted">
          Use o botao <strong>Baixar template CSV</strong> para comecar com o cabecalho correto.
        </p>
      </section>

      {fileName ? (
        <section className="stats-grid">
          <article className="stat-card">
            <span className="muted">Arquivo</span>
            <div className="stat-value">{fileName}</div>
          </article>
          <article className="stat-card">
            <span className="muted">Linhas lidas</span>
            <div className="stat-value">{summary.totalRows}</div>
          </article>
          <article className="stat-card">
            <span className="muted">Linhas validas</span>
            <div className="stat-value">{summary.validRows}</div>
          </article>
          <article className="stat-card">
            <span className="muted">Com erro</span>
            <div className="stat-value">{summary.errorRows}</div>
          </article>
          <article className="stat-card">
            <span className="muted">Com aviso</span>
            <div className="stat-value">{summary.warningRows}</div>
          </article>
          <article className="stat-card">
            <span className="muted">Duplicidades</span>
            <div className="stat-value">{summary.duplicates}</div>
          </article>
        </section>
      ) : null}

      {preview?.fileError ? <p className="error-message">{preview.fileError}</p> : null}

      {preview && preview.fileWarnings.length > 0 ? (
        <section className="panel">
          <div className="stack">
            <span className="eyebrow">Avisos do arquivo</span>
            {preview.fileWarnings.map((warning) => (
              <span className="muted" key={warning}>
                {warning}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {preview && !preview.fileError ? (
        <section className="panel table-wrapper">
          {preview.rows.length === 0 ? (
            <div className="empty-state">Nenhuma linha de dados encontrada depois do cabecalho.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Linha</th>
                  <th>Status</th>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Area</th>
                  <th>Cuidado</th>
                  <th>Proximo passo</th>
                  <th>Erros e avisos</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row) => {
                  const status = getRowStatus(row)
                  const messages = [...row.errors, ...row.warnings]

                  return (
                    <tr key={row.lineNumber}>
                      <td>{row.lineNumber}</td>
                      <td>
                        <span className={status.className}>{status.label}</span>
                      </td>
                      <td>{row.values.name || 'Sem nome'}</td>
                      <td>{row.values.phone || 'Sem telefone'}</td>
                      <td>{row.values.area || 'Sem area'}</td>
                      <td>{row.values.care_status || 'Sem status'}</td>
                      <td>{row.values.next_step || 'Sem proximo passo'}</td>
                      <td>
                        <div className="stack">
                          {messages.length > 0 ? (
                            messages.map((message) => (
                              <span className="muted" key={`${row.lineNumber}-${message}`}>
                                {message}
                              </span>
                            ))
                          ) : (
                            <span className="muted">Pronta para exportacao e importacao futura.</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </section>
      ) : null}
    </div>
  )
}
