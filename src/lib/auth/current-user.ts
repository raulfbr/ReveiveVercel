import { redirect } from 'next/navigation'

import { hasPublicSupabaseConfig } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { AppUser } from '@/lib/types'

function mapAppUser(row: {
  id: string
  auth_user_id: string | null
  email: string
  full_name: string | null
  role: AppUser['role']
  active: boolean
}): AppUser {
  return {
    id: row.id,
    authUserId: row.auth_user_id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    active: row.active,
  }
}

export async function getCurrentSessionUser() {
  if (!hasPublicSupabaseConfig()) {
    return null
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getCurrentAppUser() {
  const user = await getCurrentSessionUser()

  if (!user) {
    return null
  }

  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('app_users')
    .select('id, auth_user_id, email, full_name, role, active')
    .eq('auth_user_id', user.id)
    .eq('active', true)
    .maybeSingle()

  if (!data) {
    return null
  }

  return mapAppUser(data)
}

export async function requireAppUser() {
  const sessionUser = await getCurrentSessionUser()

  if (!sessionUser) {
    redirect('/login')
  }

  const appUser = await getCurrentAppUser()

  if (!appUser) {
    redirect('/auth/blocked')
  }

  return appUser
}
