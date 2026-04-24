'use client'

import { useFormStatus } from 'react-dom'

export function SignOutButton() {
  const { pending } = useFormStatus()

  return (
    <button className="button-secondary" disabled={pending} type="submit">
      {pending ? 'Saindo...' : 'Sair'}
    </button>
  )
}

