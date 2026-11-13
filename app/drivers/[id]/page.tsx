import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DRIVERS, JOBS, driverById, vehicleById, docStatus, fmtDate } from '../../../lib/data'
import { initials } from '../../../lib/brand'

export function generateStaticParams() {
  return DRIVERS.map(d => ({ id: d.id }))
}

const STATUS_COLORS: Record<string, string> = { Available: 'var(--ok)', 'On Job': 'var(--info)', 'Off Duty': 'var(--slate-dim)' }
const docBadge: Record<string, string> = { ok: 'badge-ok', soon: 'badge-soon', expired: 'badge-expired' }

export default function DriverDetail({ params }: { params: { id: string } }) {
  const d = driverById(params.id)
  if (!d) return notFound()
  const home = d.homeVehicleId ? vehicleById(d.homeVehicleId) : null
  const jobs = JOBS.filter(j => j.driverIds.includes(d.id))

  return (
    <div>
      <div style={{ marginBottom: 14 }}><Link href="/drivers" className="dim" style={{ fontSize: 12 }}>← Chauffeurs</Link></div>

      <div className="card card-pad" style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ width: 66, height: 66, borderRadius: 14, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontWeight: 600, color: 'var(--gold)', fontSize: 22, flex: 'none' }}>{initials(d.name)}</div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div className="eyebrow">{d.licenceClass}</div>
          <h1 className="page-title" style={{ marginTop: 3 }}>{d.name}</h1>
          <div className="mono dim" style={{ fontSize: 12, marginTop: 4 }}>{d.phone} · {d.languages.join(' · ')}</div>
        </div>
        <span className="chip" style={{ color: STATUS_COLORS[d.status] }}><span className="dot" style={{ background: STATUS_COLORS[d.status] }} />{d.status}</span>
      </div>

      <div className="grid cols-3" style={{ marginBottom: 14 }}>
        {[['Rating', '★ ' + d.rating.toFixed(1)], ['Experience', d.experienceYears + ' yrs'], ['Jobs completed', String(d.jobsDone)]].map(([l, v]) => (
          <div key={l} className="card card-pad"><div className="dimmer" style={{ fontSize: 10 }}>{l.toUpperCase()}</div><div className="num" style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{v}</div></div>
        ))}
      </div>

      <div className="grid cols-2" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' }}>
        <div className="card">
          <div className="card-pad"><h3 style={{ fontSize: 14 }}>Licensing &amp; vetting</h3></div>
          <hr className="hairline" />
          <table className="tbl">
            <tbody>
              {d.compliance.map(doc => {
                const s = docStatus(doc.expiry)
                return (
                  <tr key={doc.label} className="row">
                    <td style={{ fontWeight: 500 }}>{doc.label}</td>
                    <td className="num dim" style={{ textAlign: 'right' }}>{fmtDate(doc.expiry)}</td>
                    <td style={{ textAlign: 'right', width: 110 }}><span className={'badge ' + docBadge[s]}>{s === 'ok' ? 'Valid' : s === 'soon' ? 'Due soon' : 'Expired'}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="card-pad dimmer" style={{ fontSize: 11 }}>{home ? 'Dedicated to ' + home.name + ' (' + home.plate + ')' : 'Assigned from the driver pool per job.'}</div>
        </div>

        <div className="card">
          <div className="card-pad"><h3 style={{ fontSize: 14 }}>Assignments</h3></div>
          <hr className="hairline" />
          <table className="tbl">
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} className="row">
                  <td><Link href={'/jobs/' + j.id} style={{ fontWeight: 500 }}>{j.title}</Link><div className="dim" style={{ fontSize: 11 }}>{fmtDate(j.startDate)} · {j.client}</div></td>
                  <td style={{ textAlign: 'right' }}><span className="badge" style={{ background: 'var(--surface)', color: 'var(--slate)' }}>{j.status}</span></td>
                </tr>
              ))}
              {jobs.length === 0 && <tr><td className="dim" style={{ padding: 18 }}>No assignments yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
