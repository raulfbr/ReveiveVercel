import Link from 'next/link'

export default function BlockedPage() {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <span className="eyebrow">Acesso bloqueado</span>
        <h1 className="title">Este email ainda nao foi liberado</h1>
        <p className="lead">
          O login com Google funcionou, mas o usuario nao foi encontrado como ativo em
          <code> app_users </code>.
        </p>
        <div className="actions-row">
          <Link className="button-secondary" href="/login">
            Voltar ao login
          </Link>
        </div>
      </section>
    </main>
  )
}

