import { AppNavLink } from '@/components/app-nav-link'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { requireAppUser } from '@/lib/auth/current-user'

import { signOutAction } from './actions'

export const dynamic = 'force-dynamic'

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const appUser = await requireAppUser()

  return (
    <div className="app-layout">
      <div className="page-shell">
        <header className="app-header auth-card">
          <div className="app-brand">
            <span className="eyebrow">Revive</span>
            <strong>Central de cuidado do voluntariado</strong>
            <span className="muted">
              {appUser.fullName || appUser.email} · {appUser.role}
            </span>
          </div>

          <nav className="nav-links">
            <AppNavLink href="/dados">Semana</AppNavLink>
            <AppNavLink href="/escalas">Escalas</AppNavLink>
            <AppNavLink href="/voluntarios">Voluntários</AppNavLink>
            <AppNavLink href="/dados/cuidado">Cuidado</AppNavLink>
            <AppNavLink href="/dados/importar">Importar</AppNavLink>
            <form action={signOutAction}>
              <SignOutButton />
            </form>
          </nav>
        </header>

        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
