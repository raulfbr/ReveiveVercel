import { NextResponse, type NextRequest } from 'next/server'

import { hasPublicSupabaseConfig } from '@/lib/env'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  if (!hasPublicSupabaseConfig()) {
    return NextResponse.redirect(new URL('/login?error=supabase-not-configured', request.url))
  }

  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing-code', request.url))
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url))
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/auth/blocked', request.url))
  }

  const { data: claimedUser } = await supabase.rpc('claim_app_user', {
    p_email: user.email.toLowerCase(),
  })

  if (!claimedUser) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/auth/blocked', request.url))
  }

  return NextResponse.redirect(new URL('/dados', request.url))
}
