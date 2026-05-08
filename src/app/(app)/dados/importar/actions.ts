'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireAdmin } from '@/lib/auth/permissions'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { normalizeName, normalizeWhatsapp } from '@/lib/volunteers/schema'

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

type AcceptedHeader = (typeof acceptedHeaders)[number]
type CsvValues = Record<AcceptedHeader, string>

function encodeMessage(message: string) {
  return encodeURIComponent(message)
}

function normalizeHeader(value: string) {
  return value.replace(/^\uFEFF/, '').trim().toLowerCase()
}

function normalizeLookup(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function getOptionalString(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
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

function readCsvValues(headers: string[], csvRow: string[]) {
  const values = emptyCsvValues()
  const headerIndexes = new Map(headers.map((header, index) => [header, index]))

  acceptedHeaders.forEach((header) => {
    const headerIndex = headerIndexes.get(header)
    values[header] = headerIndex === undefined ? '' : (csvRow[headerIndex] ?? '').trim()
  })

  return values
}

function getRowErrors(
  values: CsvValues,
  existingPhones: Set<string>,
  seenPhones: Map<string, number>,
  areaLookup: Map<string, string>,
  lineNumber: number,
) {
  const errors: string[] = []
  const normalizedPhone = normalizeWhatsapp(values.phone)
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

    if (existingPhones.has(normalizedPhone)) {
      errors.push('Telefone ja existe na base atual.')
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

  if (values.area && !areaLookup.has(normalizeLookup(values.area))) {
    errors.push(`Area "${values.area}" nao foi encontrada no sistema.`)
  }

  return errors
}

export async function importVolunteersCsvAction(formData: FormData) {
  const appUser = await requireAdmin()

  const csvPayload = formData.get('csv_payload')
  const privacyConfirmed = formData.get('privacy_confirmed')

  if (typeof csvPayload !== 'string' || csvPayload.trim().length === 0) {
    redirect(`/dados/importar?error=${encodeMessage('Nenhum CSV valido foi enviado para importacao.')}`)
  }

  if (privacyConfirmed !== 'yes') {
    redirect(`/dados/importar?error=${encodeMessage('Confirme a revisao de privacidade antes de importar.')}`)
  }

  const parsedRows = parseCsvRows(csvPayload)

  if (parsedRows.length === 0) {
    redirect(`/dados/importar?error=${encodeMessage('O arquivo nao possui linhas para importar.')}`)
  }

  if (parsedRows.length > 201) {
    redirect(`/dados/importar?error=${encodeMessage('Importe no maximo 200 voluntarios por vez neste MVP.')}`)
  }

  const headers = parsedRows[0].map(normalizeHeader)
  const headerSet = new Set(headers)
  const missingRequiredHeaders = requiredHeaders.filter((header) => !headerSet.has(header))

  if (missingRequiredHeaders.length > 0) {
    redirect(
      `/dados/importar?error=${encodeMessage(
        `Cabecalho incompleto. Campos obrigatorios ausentes: ${missingRequiredHeaders.join(', ')}.`,
      )}`,
    )
  }

  const supabase = await createSupabaseServerClient()
  const [{ data: existingVolunteers, error: existingVolunteersError }, { data: serviceAreas, error: serviceAreasError }] =
    await Promise.all([
      supabase.from('volunteers').select('normalized_whatsapp'),
      supabase.from('service_areas').select('id, name, slug').eq('active', true),
    ])

  if (existingVolunteersError) {
    redirect(`/dados/importar?error=${encodeMessage(existingVolunteersError.message)}`)
  }

  if (serviceAreasError) {
    redirect(`/dados/importar?error=${encodeMessage(serviceAreasError.message)}`)
  }

  const existingPhones = new Set(
    (existingVolunteers ?? [])
      .map((volunteer) => volunteer.normalized_whatsapp as string | null)
      .filter((phone): phone is string => Boolean(phone)),
  )
  const areaLookup = new Map<string, string>()

  ;(serviceAreas ?? []).forEach((area) => {
    areaLookup.set(normalizeLookup(area.name), area.id)
    areaLookup.set(normalizeLookup(area.slug), area.id)
  })

  const seenPhones = new Map<string, number>()
  const createdVolunteerIds: string[] = []
  let importedCount = 0
  let skippedCount = 0

  for (const [rowIndex, csvRow] of parsedRows.slice(1).entries()) {
    const lineNumber = rowIndex + 2
    const values = readCsvValues(headers, csvRow)
    const errors = getRowErrors(values, existingPhones, seenPhones, areaLookup, lineNumber)

    if (errors.length > 0) {
      skippedCount += 1
      continue
    }

    const normalizedPhone = normalizeWhatsapp(values.phone)
    const active = parseBoolean(values.active) ?? true
    const areaId = values.area ? areaLookup.get(normalizeLookup(values.area)) ?? null : null

    const { data: volunteer, error: insertError } = await supabase
      .from('volunteers')
      .insert({
        name: values.name,
        normalized_name: normalizeName(values.name),
        whatsapp: values.phone,
        normalized_whatsapp: normalizedPhone,
        join_date: getOptionalString(values.joined_at),
        care_status: values.care_status,
        last_contact_at: getOptionalString(values.last_contact_at),
        next_step: getOptionalString(values.next_step),
        care_responsible: getOptionalString(values.care_responsible),
        next_follow_up_at: getOptionalString(values.next_follow_up_at),
        notes: getOptionalString(values.notes),
        active,
      })
      .select('id')
      .single()

    if (insertError || !volunteer) {
      skippedCount += 1
      continue
    }

    if (areaId) {
      const { error: areaError } = await supabase.from('volunteer_areas').insert({
        area_id: areaId,
        role_in_area: 'member',
        volunteer_id: volunteer.id,
      })

      if (areaError) {
        await supabase.from('volunteers').delete().eq('id', volunteer.id)
        skippedCount += 1
        continue
      }
    }

    if (normalizedPhone) {
      existingPhones.add(normalizedPhone)
    }

    createdVolunteerIds.push(volunteer.id)
    importedCount += 1
  }

  revalidatePath('/dados')
  revalidatePath('/voluntarios')

  const importLogPayload = {
    created_volunteer_ids: createdVolunteerIds,
    created_by_app_user_id: appUser.id,
    created_by_email: appUser.email,
    imported_count: importedCount,
    privacy_confirmed: true,
    skipped_count: skippedCount,
    source: 'csv',
    total_rows: parsedRows.length - 1,
  }
  const { error: importLogError } = await supabase.from('volunteer_import_logs').insert(importLogPayload)
  let logStatus = importLogError ? 'failed' : 'ok'

  if (importLogError) {
    const legacyImportLogPayload = {
      created_by_app_user_id: appUser.id,
      created_by_email: appUser.email,
      imported_count: importedCount,
      privacy_confirmed: true,
      skipped_count: skippedCount,
      source: 'csv',
      total_rows: parsedRows.length - 1,
    }
    const { error: legacyImportLogError } = await supabase.from('volunteer_import_logs').insert(legacyImportLogPayload)
    logStatus = legacyImportLogError ? 'failed' : 'legacy'
  }

  redirect(`/dados/importar?imported=${importedCount}&skipped=${skippedCount}&log=${logStatus}`)
}
