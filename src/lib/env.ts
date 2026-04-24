type PublicSupabaseConfig = {
  url: string
  publishableKey: string
}

type PublicSupabaseConfigStatus = {
  configured: boolean
  missing: Array<'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY'>
}

const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const publicSupabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function requirePublicEnv(
  name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY',
  value: string | undefined,
) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getPublicSupabaseConfigStatus(): PublicSupabaseConfigStatus {
  const missing: PublicSupabaseConfigStatus['missing'] = []

  if (!publicSupabaseUrl) {
    missing.push('NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!publicSupabasePublishableKey && !publicSupabaseAnonKey) {
    missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return {
    configured: missing.length === 0,
    missing,
  }
}

export function hasPublicSupabaseConfig() {
  return getPublicSupabaseConfigStatus().configured
}

export function getPublicSupabaseConfig(): PublicSupabaseConfig {
  const url = requirePublicEnv('NEXT_PUBLIC_SUPABASE_URL', publicSupabaseUrl)
  const publishableKey = requirePublicEnv(
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    publicSupabasePublishableKey || publicSupabaseAnonKey,
  )

  return {
    url,
    publishableKey,
  }
}

export function getBaseUrl(origin?: string | null) {
  if (origin) {
    return origin.replace(/\/$/, '')
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}
