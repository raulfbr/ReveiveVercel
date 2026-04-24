import { VolunteerForm } from '@/components/volunteers/volunteer-form'
import { requireAdmin } from '@/lib/auth/permissions'
import { getServiceAreas } from '@/lib/volunteers/data'

import { createVolunteerAction } from '../actions'

export const dynamic = 'force-dynamic'

type NewVolunteerPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default async function NewVolunteerPage({ searchParams }: NewVolunteerPageProps) {
  await requireAdmin()
  const serviceAreas = await getServiceAreas()
  const params = await searchParams
  const errorMessage = getSingleSearchParam(params.error)

  return (
    <div className="section-grid">
      {errorMessage ? <p className="error-message">{decodeURIComponent(errorMessage)}</p> : null}
      <VolunteerForm action={createVolunteerAction} mode="create" serviceAreas={serviceAreas} />
    </div>
  )
}

