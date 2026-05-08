'use client'

import { type FormEvent, useState } from 'react'

import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type LoginButtonProps = {
  disabledReason?: string | null
}

const demoEmail = process.env.NEXT_PUBLIC_DEMO_AUTH_EMAIL || 'demo@revivevoluntariado.org'
const demoPassword = process.env.NEXT_PUBLIC_DEMO_AUTH_PASSWORD || 'ReviveDemo2026!'

export function LoginButton({ disabledReason = null }: LoginButtonProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<'email' | 'google' | null>(null)
  const [email, setEmail] = useState(demoEmail)
  const [password, setPassword] = useState(demoPassword)

  async function handlePasswordLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading('email')
      setError(null)

      const supabase = getSupabaseBrowserClient()
      const cleanEmail = email.trim().toLowerCase()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      const { data: claimedUserData, error: claimError } = await supabase.rpc('claim_app_user', {
        p_email: data.user?.email?.toLowerCase() ?? cleanEmail,
      })

      const claimedUser = Array.isArray(claimedUserData) ? claimedUserData[0] : claimedUserData

      if (claimError || !claimedUser) {
        await supabase.auth.signOut()
        setError('Login feito, mas este email nao esta liberado em app_users.')
        return
      }

      window.location.assign('/dados')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Nao foi possivel entrar com email e senha.')
    } finally {
      setLoading(null)
    }
  }

  async function handleLogin() {
    try {
      setLoading('google')
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
      setLoading(null)
    }
  }

  return (
    <div className="stack">
      <form className="stack" onSubmit={handlePasswordLogin}>
        <div className="setup-message">
          <strong>Conta demo para apresentacao</strong>
          <span>Use estes dados no ambiente de teste:</span>
          <code>{demoEmail}</code>
          <code>{demoPassword}</code>
        </div>

        <div className="field">
          <label htmlFor="demo-email">Email</label>
          <input
            className="input"
            disabled={Boolean(disabledReason) || loading !== null}
            id="demo-email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </div>

        <div className="field">
          <label htmlFor="demo-password">Senha</label>
          <input
            className="input"
            disabled={Boolean(disabledReason) || loading !== null}
            id="demo-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </div>

        <button className="button" disabled={loading !== null || Boolean(disabledReason)} type="submit">
          {loading === 'email' ? 'Entrando...' : 'Entrar na demo'}
        </button>
      </form>

      <button className="button-secondary" disabled={loading !== null || Boolean(disabledReason)} onClick={handleLogin} type="button">
        {loading === 'google' ? 'Redirecionando...' : 'Entrar com Google'}
      </button>
      {disabledReason ? <p className="muted">{disabledReason}</p> : null}
      {error ? <p className="error-message">{error}</p> : null}
    </div>
  )
}
