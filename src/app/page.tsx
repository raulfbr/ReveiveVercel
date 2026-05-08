import { redirect } from 'next/navigation'

import { getCurrentAppUser, getCurrentSessionUser } from '@/lib/auth/current-user'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const sessionUser = await getCurrentSessionUser()
  const appUser = await getCurrentAppUser()

  if (appUser) {
    redirect('/dados')
  }

  if (sessionUser) {
    redirect('/auth/blocked')
  }

  redirect('/login')
}
