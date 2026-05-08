'use client'

import { useState } from 'react'

type CopyTextButtonProps = {
  text: string
}

export function CopyTextButton({ text }: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setFailed(false)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
      setFailed(true)
      window.setTimeout(() => setFailed(false), 2400)
    }
  }

  return (
    <button className="button-secondary" onClick={handleCopy} type="button">
      {copied ? 'Resumo copiado' : failed ? 'Copie manualmente' : 'Copiar resumo'}
    </button>
  )
}
