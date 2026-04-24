const VOLUNTEER_PHOTO_BUCKET = 'volunteer-photos'
const ACCEPTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_PHOTO_SIZE = 5 * 1024 * 1024

function sanitizeFileName(fileName: string) {
  return fileName.toLowerCase().replace(/[^a-z0-9.-]+/g, '-')
}

export function validateVolunteerPhoto(file: File) {
  if (!ACCEPTED_MIME_TYPES.has(file.type)) {
    throw new Error('A foto precisa estar em JPG, PNG ou WEBP.')
  }

  if (file.size > MAX_PHOTO_SIZE) {
    throw new Error('A foto precisa ter no maximo 5 MB.')
  }
}

export async function deleteVolunteerPhoto(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createSupabaseServerClient>>,
  photoPath: string | null,
) {
  if (!photoPath) {
    return
  }

  await supabase.storage.from(VOLUNTEER_PHOTO_BUCKET).remove([photoPath])
}

export async function uploadVolunteerPhoto(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createSupabaseServerClient>>,
  volunteerId: string,
  file: File,
  currentPhotoPath: string | null,
) {
  validateVolunteerPhoto(file)

  const photoPath = `volunteers/${volunteerId}/${Date.now()}-${sanitizeFileName(file.name || 'photo')}`
  const { error } = await supabase.storage.from(VOLUNTEER_PHOTO_BUCKET).upload(photoPath, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw new Error(`Falha ao enviar a foto: ${error.message}`)
  }

  if (currentPhotoPath && currentPhotoPath !== photoPath) {
    await deleteVolunteerPhoto(supabase, currentPhotoPath)
  }

  return photoPath
}

export async function getVolunteerPhotoUrl(
  supabase: Awaited<ReturnType<typeof import('@/lib/supabase/server').createSupabaseServerClient>>,
  photoPath: string | null,
) {
  if (!photoPath) {
    return null
  }

  const { data, error } = await supabase.storage.from(VOLUNTEER_PHOTO_BUCKET).createSignedUrl(photoPath, 60 * 10)

  if (error) {
    return null
  }

  return data.signedUrl
}

