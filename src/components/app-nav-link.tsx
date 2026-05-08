'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type AppNavLinkProps = {
  href: string
  children: React.ReactNode
}

export function AppNavLink({ href, children }: AppNavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link className={isActive ? 'nav-link active' : 'nav-link'} href={href}>
      {children}
    </Link>
  )
}
