import Link from 'next/link'
import { VEHICLES, DRIVERS, JOBS, jobTotal, daysUntil, docStatus, fmtDate, vehicleById, driverById, TODAY } from '../lib/data'
import { kes } from '../lib/brand'

const STATUS_COLORS: Record<string, string> = {
  Available: 'var(--ok)', 'On Job': 'var(--info)', Maintenance: 'var(--warn)',
}
const JOB_COLORS: Record<string, string> = {
  Enquiry: 'var(--slate)', Quoted: 'var(--info)', Confirmed: 'var(--gold)', Dispatched: 'var(--ok)', Completed: 'var(--slate)', Invoiced: 'var(--ok)',
}

function StatTile({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="card card-pad">
      <div className="eyebrow" style={{ color: accent || 'var(--gold)' }}>{label}</div>
      <div className="num" style={{ fontSize: 28, fontWeight: 700, marginTop: 8, color: 'var(--white)' }}>{value}</div>
      {sub && <div className="dim" style={{ fontSize: 11.5, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const available = VEHICLES.filter(v => v.status === 'Available').length
  const onJob = VEHICLES.filter(v => v.status === 'On Job').length
  const maint = VEHICLES.filter(v => v.status === 'Maintenance').length
  const avgUtil = Math.round(VEHICLES.reduce((a, v) => a + v.utilisation, 0) / VEHICLES.length)

  const live = JOBS.filter(j => ['Confirmed', 'Dispatched'].includes(j.status))
  const pipeline = JOBS.filter(j => ['Enquiry', 'Quoted'].includes(j.status))
  const pipelineValue = pipeline.reduce((a, j) => a + jobTotal(j), 0)
  const bookedValue = live.reduce((a, j) => a + jobTotal(j), 0)
  const receivables = JOBS.filter(j => j.status === 'Invoiced').reduce((a, j) => a + jobTotal(j), 0)

  const upcoming = [...JOBS]
    .filter(j => daysUntil(j.endDate) >= 0 && j.status !== 'Invoiced')
    .sort((a, b) => daysUntil(a.startDate) - daysUntil(b.startDate))

  // compliance alerts across fleet + drivers
  type Alert = { who: string; sub: string; label: string; expiry: string; d: number; kind: 'vehicle' | 'driver' }
  const alerts: Alert[] = []
  for (const v of VEHICLES) for (const doc of v.compliance) {
    const s = docStatus(doc.expiry)
    if (s !== 'ok') alerts.push({ who: v.name, sub: v.plate, label: doc.label, expiry: doc.expiry, d: daysUntil(doc.expiry), kind: 'vehicle' })
  }
  for (const dr of DRIVERS) for (const doc of dr.compliance) {
    const s = docStatus(doc.expiry)
    if (s !== 'ok') alerts.push({ who: dr.name, sub: dr.licenceClass, label: doc.label, expiry: doc.expiry, d: daysUntil(doc.expiry), kind: 'driver' })
  }
  alerts.sort((a, b) => a.d - b.d)

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Operations</div>
          <h1 className="page-title">Good morning, Operations</h1>
          <div className="dim" style={{ fontSize: 12.5, marginTop: 2 }}>
            {TODAY.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} · Nairobi
          </div>
        </div>
        <Link href="/jobs" className="btn btn-primary">+ New booking</Link>
      </div>

      <div className="grid stat-grid" style={{ marginBottom: 14 }}>
        <StatTile label="Fleet" value={String(VEHICLES.length)} sub={`${available} available · ${onJob} on job · ${maint} in service`} />
        <StatTile label="Avg. utilisation (30d)" value={avgUtil + '%'} sub="Across all vehicles" />
        <StatTile label="Booked value" value={kes(bookedValue, { compact: true })} sub={`${live.length} confirmed / dispatched`} accent="var(--ok)" />
        <StatTile label="Receivables" value={kes(receivables, { compact: true })} sub="Invoiced · awaiting settlement" accent="var(--warn)" />
      </div>

      <div className="grid cols-2" style={{ gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)' }}>
        {/* Upcoming bookings */}
        <div className="card">
          <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14 }}>Upcoming bookings</h3>
            <Link href="/jobs" className="dim" style={{ fontSize: 11.5 }}>View all →</Link>
          </div>
          <hr className="hairline" />
          <table className="tbl">
            <tbody>
              {upcoming.map(j => (
                <tr key={j.id} className="row">
                  <td style={{ width: 54 }}>
                    <div className="num" style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>{new Date(j.startDate).getDate()}</div>
                    <div className="mono dimmer" style={{ fontSize: 9 }}>{new Date(j.startDate).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}</div>
                  </td>
                  <td>
                    <Link href={'/jobs/' + j.id} style={{ fontWeight: 600 }}>{j.title}</Link>
                    <div className="dim" style={{ fontSize: 11.5, marginTop: 2 }}>{j.client} · {j.vehicleIds.length || '—'} vehicle{j.vehicleIds.length === 1 ? '' : 's'}</div>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span className="badge" style={{ color: JOB_COLORS[j.status], background: 'var(--surface)' }}>{j.status}</span>
                    <div className="num dim" style={{ fontSize: 11, marginTop: 4 }}>{jobTotal(j) ? kes(jobTotal(j), { compact: true }) : 'TBQ'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compliance alerts */}
        <div className="card">
          <div className="card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 14 }}>Compliance alerts</h3>
            <Link href="/compliance" className="dim" style={{ fontSize: 11.5 }}>All →</Link>
          </div>
          <hr className="hairline" />
          <div style={{ padding: '6px 0' }}>
            {alerts.slice(0, 7).map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px' }}>
                <span className="dot" style={{ background: a.d < 0 ? 'var(--danger)' : 'var(--warn)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.label}</div>
                  <div className="dim" style={{ fontSize: 11 }}>{a.who} · {a.sub}</div>
                </div>
                <div className="num" style={{ fontSize: 11, color: a.d < 0 ? 'var(--danger)' : 'var(--warn)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {a.d < 0 ? 'EXPIRED' : 'in ' + a.d + 'd'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fleet snapshot */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-pad"><h3 style={{ fontSize: 14 }}>Fleet status</h3></div>
        <hr className="hairline" />
        <table className="tbl">
          <thead><tr><th>Vehicle</th><th>Class</th><th>Day rate</th><th>Utilisation</th><th>Status</th><th>Chauffeur</th></tr></thead>
          <tbody>
            {VEHICLES.map(v => {
              const drv = v.assignment.kind === 'dedicated' ? driverById(v.assignment.driverId) : null
              return (
                <tr key={v.id} className="row">
                  <td><Link href={'/fleet/' + v.id} style={{ fontWeight: 600 }}>{v.emoji} {v.name}</Link><div className="mono dimmer" style={{ fontSize: 10 }}>{v.plate}</div></td>
                  <td className="dim">{v.klass}</td>
                  <td className="num">{kes(v.dailyRate)}</td>
                  <td style={{ width: 130 }}>
                    <div className="meter"><span style={{ width: v.utilisation + '%' }} /></div>
                    <div className="num dimmer" style={{ fontSize: 10, marginTop: 3 }}>{v.utilisation}%</div>
                  </td>
                  <td><span className="chip" style={{ color: STATUS_COLORS[v.status] }}><span className="dot" style={{ background: STATUS_COLORS[v.status] }} />{v.status}</span></td>
                  <td className="dim">{drv ? drv.name : v.assignment.kind === 'pool' ? 'Pool' : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
