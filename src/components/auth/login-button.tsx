'use client'

import { useState } from 'react'

import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type LoginButtonProps = {
  disabledReason?: string | null
}

export function LoginButton({ disabledReason = null }: LoginButtonProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    try {
      setLoading(true)
      setError(null)

      const supabase = getSupabaseBrowserClient()
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      })

      if (signInError) {
        setError(signInError.message)
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nao foi possivel iniciar o login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="stack">
      <button className="button" disabled={loading || Boolean(disabledReason)} onClick={handleLogin} type="button">
        {loading ? 'Redirecionando...' : 'Entrar com Google'}
      </button>
      {disabledReason ? <p className="muted">{disabledReason}</p> : null}
      {error ? <p className="error-message">{error}</p> : null}
    </div>
  )
}
