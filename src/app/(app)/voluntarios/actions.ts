'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { requireAdmin } from '@/lib/auth/permissions'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { deleteVolunteerPhoto, uploadVolunteerPhoto } from '@/lib/volunteers/storage'
import { parseVolunteerFormData } from '@/lib/volunteers/schema'

function encodeMessage(message: string) {
  return encodeURIComponent(message)
}

function handleActionError(path: string, error: unknown): never {
  const message =
    error instanceof z.ZodError
      ? error.issues[0]?.message ?? 'Formulario invalido.'
      : error instanceof Error
        ? error.message
        : 'Nao foi possivel concluir a operacao.'

  redirect(`${path}?error=${encodeMessage(message)}`)
}

export async function createVolunteerAction(formData: FormData) {
  await requireAdmin()

  let redirectPath = '/voluntarios'

  try {
    const { input, photoFile } = parseVolunteerFormData(formData)
    const supabase = await createSupabaseServerClient()

    const { data: volunteer, error: insertError } = await supabase
      .from('volunteers')
      .insert({
        name: input.name,
        normalized_name: input.normalizedName,
        gender: input.gender,
        birth_date: input.birthDate,
        join_date: input.joinDate,
        address: input.address,
        whatsapp: input.whatsapp,
        normalized_whatsapp: input.normalizedWhatsapp,
        availability_status: input.availabilityStatus,
        care_status: input.careStatus,
        last_contact_at: input.lastContactAt,
        next_step: input.nextStep,
        care_responsible: input.careResponsible,
        next_follow_up_at: input.nextFollowUpAt,
        notes: input.notes,
        active: input.active,
      })
      .select('id')
      .single()

    if (insertError || !volunteer) {
      throw new Error(insertError?.message ?? 'Nao foi possivel criar o voluntario.')
    }

    if (photoFile) {
      const photoPath = await uploadVolunteerPhoto(supabase, volunteer.id, photoFile, null)
      const { error: photoError } = await supabase
        .from('volunteers')
        .update({
          photo_path: photoPath,
        })
        .eq('id', volunteer.id)

      if (photoError) {
        throw new Error(photoError.message)
      }
    }

    if (input.selectedAreas.length > 0) {
      const { error: areasError } = await supabase.from('volunteer_areas').insert(
        input.selectedAreas.map((areaId) => ({
          volunteer_id: volunteer.id,
          area_id: areaId,
          role_in_area: input.rolesByArea[areaId] ?? 'member',
        })),
      )

      if (areasError) {
        throw new Error(areasError.message)
      }
    }

    revalidatePath('/voluntarios')
    redirectPath = `/voluntarios/${volunteer.id}?saved=created`
  } catch (error) {
    handleActionError('/voluntarios/novo', error)
  }

  redirect(redirectPath)
}

export async function updateVolunteerAction(formData: FormData) {
  await requireAdmin()

  const volunteerIdEntry = formData.get('volunteer_id')

  if (typeof volunteerIdEntry !== 'string' || volunteerIdEntry.length === 0) {
    handleActionError('/voluntarios', new Error('Voluntario invalido.'))
  }

  const volunteerId = volunteerIdEntry
  const detailPath = `/voluntarios/${volunteerId}`
  const intent = typeof formData.get('intent') === 'string' ? formData.get('intent') : 'save'
  let redirectPath = `${detailPath}?saved=updated`

  try {
    const supabase = await createSupabaseServerClient()

    if (intent === 'deactivate' || intent === 'reactivate') {
      const active = intent === 'reactivate'
      const { error: statusError } = await supabase
        .from('volunteers')
        .update({ active, care_status: active ? 'active' : 'inactive' })
        .eq('id', volunteerId)

      if (statusError) {
        throw new Error(statusError.message)
      }

      revalidatePath('/voluntarios')
      revalidatePath(detailPath)
      redirectPath = `${detailPath}?saved=${active ? 'reactivated' : 'deactivated'}`
    } else {
      const { input, photoFile } = parseVolunteerFormData(formData)
      const { data: currentVolunteer, error: currentVolunteerError } = await supabase
        .from('volunteers')
        .select('photo_path')
        .eq('id', volunteerId)
        .single()

      if (currentVolunteerError) {
        throw new Error(currentVolunteerError.message)
      }

      let nextPhotoPath = currentVolunteer.photo_path as string | null

      if (input.removePhoto && currentVolunteer.photo_path && !photoFile) {
        await deleteVolunteerPhoto(supabase, currentVolunteer.photo_path)
        nextPhotoPath = null
      }

      if (photoFile) {
        nextPhotoPath = await uploadVolunteerPhoto(supabase, volunteerId, photoFile, currentVolunteer.photo_path)
      }

      const { error: updateError } = await supabase
        .from('volunteers')
        .update({
          name: input.name,
          normalized_name: input.normalizedName,
          photo_path: nextPhotoPath,
          gender: input.gender,
          birth_date: input.birthDate,
          join_date: input.joinDate,
          address: input.address,
          whatsapp: input.whatsapp,
          normalized_whatsapp: input.normalizedWhatsapp,
          availability_status: input.availabilityStatus,
          care_status: input.careStatus,
          last_contact_at: input.lastContactAt,
          next_step: input.nextStep,
          care_responsible: input.careResponsible,
          next_follow_up_at: input.nextFollowUpAt,
          notes: input.notes,
          active: input.active,
        })
        .eq('id', volunteerId)

      if (updateError) {
        throw new Error(updateError.message)
      }

      const { error: deleteAreasError } = await supabase.from('volunteer_areas').delete().eq('volunteer_id', volunteerId)

      if (deleteAreasError) {
        throw new Error(deleteAreasError.message)
      }

      if (input.selectedAreas.length > 0) {
        const { error: insertAreasError } = await supabase.from('volunteer_areas').insert(
          input.selectedAreas.map((areaId) => ({
            volunteer_id: volunteerId,
            area_id: areaId,
            role_in_area: input.rolesByArea[areaId] ?? 'member',
          })),
        )

        if (insertAreasError) {
          throw new Error(insertAreasError.message)
        }
      }

      revalidatePath('/voluntarios')
      revalidatePath(detailPath)
    }
  } catch (error) {
    handleActionError(detailPath, error)
  }

  redirect(redirectPath)
}
