import Link from 'next/link'
import { VEHICLES, DRIVERS, docStatus, daysUntil, fmtDate } from '../../lib/data'

// Company-level procurement documents — what keeps EMH bid-ready and audit-ready.
const COMPANY_DOCS = [
  { label: 'KRA Tax Compliance Certificate', expiry: '2026-12-09', ref: 'TCC' },
  { label: 'AGPO Certificate (Youth/Women/PWD)', expiry: '2027-07-01', ref: 'AGPO' },
  { label: 'Single Business Permit (NCC)', expiry: '2026-12-31', ref: 'Permit' },
  { label: 'TRA Car Hire Operator Licence', expiry: '2027-02-28', ref: 'TRA' },
  { label: 'Company Master Insurance Cover', expiry: '2026-11-27', ref: 'Insurance' },
  { label: 'CR12 (Company Search)', expiry: '2027-04-15', ref: 'BRS' },
]

const badge: Record<string, string> = { ok: 'badge-ok', soon: 'badge-soon', expired: 'badge-expired' }
const word: Record<string, string> = { ok: 'Valid', soon: 'Due soon', expired: 'Expired' }

type Row = { who: string; sub: string; label: string; expiry: string; href?: string }

export default function CompliancePage() {
  const vehicleDocs: Row[] = VEHICLES.flatMap(v => v.compliance.map(d => ({ who: v.name, sub: v.plate, label: d.label, expiry: d.expiry, href: '/fleet/' + v.id })))
  const driverDocs: Row[] = DRIVERS.flatMap(dr => dr.compliance.map(d => ({ who: dr.name, sub: dr.licenceClass, label: d.label, expiry: d.expiry, href: '/drivers/' + dr.id })))
  const allDocs = [...COMPANY_DOCS.map(d => ({ who: 'Executive Mobility Hub', sub: d.ref, label: d.label, expiry: d.expiry })), ...vehicleDocs, ...driverDocs]

  const expired = allDocs.filter(d => docStatus(d.expiry) === 'expired').length
  const soon = allDocs.filter(d => docStatus(d.expiry) === 'soon').length
  const ok = allDocs.length - expired - soon

  function Section({ title, rows, note }: { title: string; rows: Row[]; note?: string }) {
    const sorted = [...rows].sort((a, b) => daysUntil(a.expiry) - daysUntil(b.expiry))
    return (
      <div className="card">
        <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3 style={{ fontSize: 14 }}>{title}</h3>
          {note && <span className="dimmer" style={{ fontSize: 11 }}>{note}</span>}
        </div>
        <hr className="hairline" />
        <table className="tbl">
          <tbody>
            {sorted.map((r, i) => {
              const s = docStatus(r.expiry); const d = daysUntil(r.expiry)
              return (
                <tr key={i} className="row">
                  <td style={{ fontWeight: 500 }}>{r.label}<div className="dim" style={{ fontSize: 11 }}>{r.href ? <Link href={r.href}>{r.who}</Link> : r.who} · {r.sub}</div></td>
                  <td className="num dim" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{fmtDate(r.expiry)}</td>
                  <td style={{ textAlign: 'right', width: 150, whiteSpace: 'nowrap' }}>
                    <span className="num dimmer" style={{ fontSize: 10.5, marginRight: 8 }}>{d < 0 ? Math.abs(d) + 'd ago' : d + 'd'}</span>
                    <span className={'badge ' + badge[s]}>{word[s]}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Assurance</div>
          <h1 className="page-title">Compliance</h1>
          <div className="dim" style={{ fontSize: 12.5, marginTop: 2 }}>One lapse disqualifies a bid or voids a claim. Here is every expiry, in one place.</div>
        </div>
      </div>

      <div className="grid stat-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))', marginBottom: 14 }}>
        <div className="card card-pad"><div className="eyebrow" style={{ color: 'var(--ok)' }}>Valid</div><div className="num" style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>{ok}</div></div>
        <div className="card card-pad"><div className="eyebrow" style={{ color: 'var(--warn)' }}>Due within 30 days</div><div className="num" style={{ fontSize: 26, fontWeight: 700, marginTop: 6, color: 'var(--warn)' }}>{soon}</div></div>
        <div className="card card-pad"><div className="eyebrow" style={{ color: 'var(--danger)' }}>Expired</div><div className="num" style={{ fontSize: 26, fontWeight: 700, marginTop: 6, color: expired ? 'var(--danger)' : undefined }}>{expired}</div></div>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        <Section title="Company & procurement documents" rows={COMPANY_DOCS.map(d => ({ who: 'Executive Mobility Hub', sub: d.ref, label: d.label, expiry: d.expiry }))} note="Bid- & audit-readiness" />
        <Section title="Fleet documents" rows={vehicleDocs} note="NTSA · insurance · PSV/TSV" />
        <Section title="Chauffeur documents" rows={driverDocs} note="Licence · PSV badge · Good Conduct · medical" />
      </div>
    </div>
  )
}
