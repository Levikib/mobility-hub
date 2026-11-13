import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JOBS, jobById, vehicleById, driverById, jobTotal, jobSubtotal, fmtDate } from '../../../lib/data'
import { kes } from '../../../lib/brand'

export function generateStaticParams() {
  return JOBS.map(j => ({ id: j.id }))
}

const FLOW = ['Enquiry', 'Quoted', 'Confirmed', 'Dispatched', 'Completed', 'Invoiced']

export default function JobDetail({ params }: { params: { id: string } }) {
  const j = jobById(params.id)
  if (!j) return notFound()
  const stage = FLOW.indexOf(j.status)
  const vat = Math.round(jobSubtotal(j) * j.cost.vatPct / 100)

  const lines = [
    ['Vehicle hire', j.cost.days + ' day' + (j.cost.days === 1 ? '' : 's') + ' × ' + j.vehicleIds.length + ' vehicle' + (j.vehicleIds.length === 1 ? '' : 's'), j.cost.dayRateTotal],
    ['Chauffeur allowance', 'Per diem / night-out', j.cost.driverAllowance],
    ['Fuel', j.cost.fuel ? 'On actuals' : '—', j.cost.fuel],
    ['Extras', 'Airport, waiting, lead car', j.cost.extras],
  ] as [string, string, number][]

  return (
    <div>
      <div style={{ marginBottom: 14 }}><Link href="/jobs" className="dim" style={{ fontSize: 12 }}>← Bookings &amp; Jobs</Link></div>

      <div className="card card-pad" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow">{j.ref} · {j.clientType}</div>
            <h1 className="page-title" style={{ marginTop: 4 }}>{j.title}</h1>
            <div className="dim" style={{ fontSize: 13, marginTop: 4 }}>{j.client} · {j.location}</div>
            <div className="num dim" style={{ fontSize: 12, marginTop: 2 }}>{fmtDate(j.startDate)} → {fmtDate(j.endDate)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="dimmer" style={{ fontSize: 10 }}>TOTAL (INCL. VAT)</div>
            <div className="num" style={{ fontSize: 26, fontWeight: 700, color: 'var(--gold)' }}>{jobTotal(j) ? kes(jobTotal(j)) : 'To be quoted'}</div>
            {j.lsoRef && <div className="mono dim" style={{ fontSize: 11, marginTop: 4 }}>LSO · {j.lsoRef}</div>}
          </div>
        </div>

        {/* status flow */}
        <div style={{ display: 'flex', gap: 0, marginTop: 20, flexWrap: 'wrap' }}>
          {FLOW.map((s, i) => (
            <div key={s} style={{ flex: 1, minWidth: 90 }}>
              <div style={{ height: 3, background: i <= stage ? 'var(--gold)' : 'var(--surface-2)', borderRadius: 2 }} />
              <div className="mono" style={{ fontSize: 9.5, marginTop: 6, letterSpacing: '0.04em', color: i === stage ? 'var(--gold)' : i < stage ? 'var(--platinum)' : 'var(--slate-dim)' }}>
                {i < stage ? '✓ ' : ''}{s}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid cols-2" style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)' }}>
        <div style={{ display: 'grid', gap: 14 }}>
          {/* cost breakdown */}
          <div className="card">
            <div className="card-pad"><h3 style={{ fontSize: 14 }}>Cost breakdown</h3></div>
            <hr className="hairline" />
            <table className="tbl">
              <tbody>
                {lines.map(([label, note, amt]) => (
                  <tr key={label}><td style={{ fontWeight: 500 }}>{label}<div className="dimmer" style={{ fontSize: 11 }}>{note}</div></td><td className="num" style={{ textAlign: 'right' }}>{kes(amt)}</td></tr>
                ))}
                <tr><td className="dim">Subtotal</td><td className="num dim" style={{ textAlign: 'right' }}>{kes(jobSubtotal(j))}</td></tr>
                <tr><td className="dim">VAT ({j.cost.vatPct}%)</td><td className="num dim" style={{ textAlign: 'right' }}>{kes(vat)}</td></tr>
                <tr><td style={{ fontWeight: 700, fontSize: 15 }}>Total</td><td className="num" style={{ textAlign: 'right', fontWeight: 700, fontSize: 15, color: 'var(--gold)' }}>{kes(jobTotal(j))}</td></tr>
              </tbody>
            </table>
          </div>

          {/* assigned resources */}
          <div className="card">
            <div className="card-pad"><h3 style={{ fontSize: 14 }}>Assigned fleet &amp; chauffeurs</h3></div>
            <hr className="hairline" />
            <table className="tbl">
              <tbody>
                {j.vehicleIds.map((vid, i) => {
                  const v = vehicleById(vid); const d = driverById(j.driverIds[i])
                  if (!v) return null
                  return (
                    <tr key={vid} className="row">
                      <td style={{ width: 40, fontSize: 22 }}>{v.emoji}</td>
                      <td><Link href={'/fleet/' + v.id} style={{ fontWeight: 500 }}>{v.name}</Link><div className="mono dimmer" style={{ fontSize: 10 }}>{v.plate}</div></td>
                      <td style={{ textAlign: 'right' }}>{d ? <Link href={'/drivers/' + d.id} className="dim">🧑‍✈️ {d.name}</Link> : <span className="dimmer">Unassigned</span>}</td>
                    </tr>
                  )
                })}
                {j.vehicleIds.length === 0 && <tr><td className="dim" style={{ padding: 18 }}>No fleet assigned yet — awaiting availability check.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* audit chain + notes */}
        <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <div className="card card-pad">
            <h3 style={{ fontSize: 14, marginBottom: 12 }}>Procurement audit trail</h3>
            {[
              ['Service order (LSO)', j.lsoRef || 'Not yet issued', !!j.lsoRef],
              ['Dispatch / job sheet', stage >= 3 ? 'Issued to chauffeurs' : 'Pending confirmation', stage >= 3],
              ['Trip log — client sign-off', j.signedOff ? 'Signed by protocol officer' : 'Awaiting sign-off', j.signedOff],
              ['eTIMS tax invoice', j.status === 'Invoiced' ? 'Issued · KRA e-invoice' : 'Not raised', j.status === 'Invoiced'],
              ['IFMIS payment', j.status === 'Invoiced' ? 'Awaiting 30-day settlement' : '—', false],
            ].map(([label, val, done]) => (
              <div key={label as string} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0' }}>
                <span className="dot" style={{ marginTop: 5, background: done ? 'var(--ok)' : 'var(--slate-dim)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{label}</div>
                  <div className="dim" style={{ fontSize: 11 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card card-pad">
            <h3 style={{ fontSize: 14, marginBottom: 8 }}>Operations notes</h3>
            <p className="dim" style={{ fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>{j.notes}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
