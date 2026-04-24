'use client'

import { createBrowserClient } from '@supabase/ssr'

import { getPublicSupabaseConfig } from '@/lib/env'

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    const { url, publishableKey } = getPublicSupabaseConfig()
    browserClient = createBrowserClient(url, publishableKey)
  }

  return browserClient
}

