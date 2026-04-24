import { redirect } from 'next/navigation'

import { requireAppUser } from '@/lib/auth/current-user'

export async function requireAdmin() {
  const appUser = await requireAppUser()

  if (appUser.role !== 'admin') {
    redirect('/voluntarios?error=forbidden')
  }

  return appUser
}

export function canWrite(appUser: { role: 'admin' | 'viewer' }) {
  return appUser.role === 'admin'
}

