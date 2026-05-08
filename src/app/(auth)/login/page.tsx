import { redirect } from 'next/navigation'

import { LoginButton } from '@/components/auth/login-button'
import { getPublicSupabaseConfigStatus } from '@/lib/env'
import { getCurrentAppUser, getCurrentSessionUser } from '@/lib/auth/current-user'

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabaseStatus = getPublicSupabaseConfigStatus()
  const sessionUser = await getCurrentSessionUser()
  const appUser = await getCurrentAppUser()
  const params = await searchParams
  const errorMessage = getSingleSearchParam(params.error)

  if (appUser) {
    redirect('/dados')
  }

  if (sessionUser) {
    redirect('/auth/blocked')
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <span className="eyebrow">Revive MVP</span>
        <h1 className="title">Acesso interno de voluntarios</h1>
        <p className="lead">
          Para apresentacao, entre com a conta demo abaixo. O Google continua disponivel para usuarios internos
          cadastrados em <code> app_users </code>.
        </p>
        {errorMessage ? <p className="error-message">{decodeURIComponent(errorMessage)}</p> : null}
        {!supabaseStatus.configured ? (
          <div className="setup-message">
            <strong>Configure o Supabase para habilitar o login.</strong>
            <span>Crie um arquivo .env.local com:</span>
            <code>{supabaseStatus.missing.join(', ')}</code>
          </div>
        ) : null}
        <LoginButton disabledReason={!supabaseStatus.configured ? 'Preencha as variaveis Supabase no .env.local.' : null} />
      </section>
    </main>
  )
}
