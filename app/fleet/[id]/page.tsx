import Link from 'next/link'
import { notFound } from 'next/navigation'
import { VEHICLES, JOBS, vehicleById, driverById, docStatus, fmtDate, jobTotal } from '../../../lib/data'
import { kes } from '../../../lib/brand'

export function generateStaticParams() {
  return VEHICLES.map(v => ({ id: v.id }))
}

const STATUS_COLORS: Record<string, string> = { Available: 'var(--ok)', 'On Job': 'var(--info)', Maintenance: 'var(--warn)' }
const docBadge: Record<string, string> = { ok: 'badge-ok', soon: 'badge-soon', expired: 'badge-expired' }

export default function VehicleDetail({ params }: { params: { id: string } }) {
  const v = vehicleById(params.id)
  if (!v) return notFound()
  const drv = v.assignment.kind === 'dedicated' ? driverById(v.assignment.driverId) : null
  const history = JOBS.filter(j => j.vehicleIds.includes(v.id))

  return (
    <div>
      <div style={{ marginBottom: 14 }}><Link href="/fleet" className="dim" style={{ fontSize: 12 }}>← Fleet</Link></div>

      <div className="card" style={{ overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ background: 'linear-gradient(150deg, var(--surface-2), var(--midnight))', padding: '26px 24px', display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 64 }}>{v.emoji}</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="eyebrow">{v.klass}</div>
            <h1 className="page-title" style={{ marginTop: 4 }}>{v.name}</h1>
            <div className="mono dim" style={{ fontSize: 12, marginTop: 4 }}>{v.plate} · {v.make} · {v.year} · {v.seats} seats</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="chip" style={{ color: STATUS_COLORS[v.status] }}><span className="dot" style={{ background: STATUS_COLORS[v.status] }} />{v.status}</span>
            <div className="num" style={{ fontSize: 24, fontWeight: 700, color: 'var(--gold)', marginTop: 10 }}>{kes(v.dailyRate)}</div>
            <div className="dimmer" style={{ fontSize: 10 }}>PER DAY · {v.fuelPolicy}</div>
          </div>
        </div>
      </div>

      <div className="grid cols-3" style={{ marginBottom: 14 }}>
        {[['Jobs completed', String(v.jobsDone)], ['Utilisation (30d)', v.utilisation + '%'], ['Odometer', v.odometer.toLocaleString() + ' km']].map(([l, val]) => (
          <div key={l} className="card card-pad">
            <div className="dimmer" style={{ fontSize: 10 }}>{l.toUpperCase()}</div>
            <div className="num" style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{val}</div>
          </div>
        ))}
      </div>

      <div className="grid cols-2" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' }}>
        <div className="card">
          <div className="card-pad"><h3 style={{ fontSize: 14 }}>Compliance &amp; documents</h3></div>
          <hr className="hairline" />
          <table className="tbl">
            <tbody>
              {v.compliance.map(d => {
                const s = docStatus(d.expiry)
                return (
                  <tr key={d.label} className="row">
                    <td style={{ fontWeight: 500 }}>{d.label}</td>
                    <td className="num dim" style={{ textAlign: 'right' }}>{fmtDate(d.expiry)}</td>
                    <td style={{ textAlign: 'right', width: 110 }}><span className={'badge ' + docBadge[s]}>{s === 'ok' ? 'Valid' : s === 'soon' ? 'Due soon' : 'Expired'}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="card-pad dimmer" style={{ fontSize: 11 }}>Assignment: {drv ? 'Dedicated chauffeur — ' + drv.name : 'Driver pool (assigned per job)'}</div>
        </div>

        <div className="card">
          <div className="card-pad"><h3 style={{ fontSize: 14 }}>Job history</h3></div>
          <hr className="hairline" />
          <table className="tbl">
            <tbody>
              {history.map(j => (
                <tr key={j.id} className="row">
                  <td><Link href={'/jobs/' + j.id} style={{ fontWeight: 500 }}>{j.title}</Link><div className="dim" style={{ fontSize: 11 }}>{fmtDate(j.startDate)} · {j.client}</div></td>
                  <td className="num dim" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{jobTotal(j) ? kes(jobTotal(j), { compact: true }) : '—'}</td>
                </tr>
              ))}
              {history.length === 0 && <tr><td className="dim" style={{ padding: 18 }}>No bookings recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
