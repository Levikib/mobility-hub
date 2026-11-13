'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BRAND } from '../lib/brand'

const NAV = [
  { section: 'Operations' },
  { href: '/', label: 'Dashboard', ico: '◇' },
  { href: '/jobs', label: 'Bookings & Jobs', ico: '▤' },
  { href: '/calendar', label: 'Availability', ico: '▦' },
  { section: 'Directory' },
  { href: '/fleet', label: 'Fleet', ico: '▣' },
  { href: '/drivers', label: 'Chauffeurs', ico: '◉' },
  { section: 'Assurance' },
  { href: '/compliance', label: 'Compliance', ico: '◆' },
  { href: '/portal', label: 'Driver Portal', ico: '◈' },
]

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {NAV.map((n, i) =>
        'section' in n ? (
          <div key={i} className="nav-sec">{n.section}</div>
        ) : (
          <Link key={n.href} href={n.href!} className={'nav-item' + (pathname === n.href ? ' active' : '')}>
            <span className="ico">{n.ico}</span>
            {n.label}
          </Link>
        ),
      )}
    </>
  )
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="app">
      <aside className="sidebar">
        <Link href="/" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mark-dark.png" alt="" width={38} height={38} style={{ borderRadius: 8, flex: 'none', objectFit: 'cover' }} />
          <span>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 14.5, fontWeight: 600, lineHeight: 1.05 }}>The Executive</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '0.22em', color: 'var(--slate)' }}>MOBILITY HUB</div>
          </span>
        </Link>
        <nav className="nav"><NavLinks pathname={pathname} /></nav>
        <div style={{ position: 'absolute', bottom: 16, left: 14, right: 14 }}>
          <div className="card card-pad" style={{ padding: '12px 13px' }}>
            <div className="eyebrow" style={{ marginBottom: 5 }}>{BRAND.tagline}</div>
            <div style={{ fontSize: 11, color: 'var(--slate)', lineHeight: 1.5 }}>Demo environment · indicative data for pitch review.</div>
          </div>
        </div>
      </aside>

      {/* mobile top nav */}
      <div className="topbar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Link href="/" className="brand" style={{ padding: 0 }}><img src="/mark-dark.png" alt="The Executive Mobility Hub" width={30} height={30} style={{ borderRadius: 7, objectFit: 'cover' }} /></Link>
        <NavLinks pathname={pathname} />
      </div>

      <main className="main">{children}</main>
    </div>
  )
}
