'use client'
import { useState } from 'react'
import { DRIVERS, JOBS, vehicleById, docStatus, fmtDate, daysUntil } from '../../lib/data'
import { initials } from '../../lib/brand'

const badge: Record<string, string> = { ok: 'badge-ok', soon: 'badge-soon', expired: 'badge-expired' }
const word: Record<string, string> = { ok: 'Valid', soon: 'Renew soon', expired: 'Expired' }

export default function PortalPage() {
  const [id, setId] = useState(DRIVERS[0].id)
  const [available, setAvailable] = useState(true)
  const d = DRIVERS.find(x => x.id === id)!
  const jobs = JOBS.filter(j => j.driverIds.includes(d.id)).sort((a, b) => daysUntil(a.startDate) - daysUntil(b.startDate))
  const next = jobs.find(j => daysUntil(j.endDate) >= 0)

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Chauffeur Portal</div>
          <h1 className="page-title">My schedule</h1>
          <div className="dim" style={{ fontSize: 12.5, marginTop: 2 }}>What each chauffeur sees when they sign in on their phone.</div>
        </div>
        <select value={id} onChange={e => setId(e.target.value)} className="btn" style={{ paddingRight: 10 }}>
          {DRIVERS.map(x => <option key={x.id} value={x.id} style={{ color: '#000' }}>{x.name}</option>)}
        </select>
      </div>

      <div className="card card-pad" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ width: 54, height: 54, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontWeight: 600, color: 'var(--gold)', fontSize: 18, flex: 'none' }}>{initials(d.name)}</div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{d.name}</div>
          <div className="dim" style={{ fontSize: 12 }}>★ {d.rating.toFixed(1)} · {d.jobsDone} jobs · {d.licenceClass}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="dimmer" style={{ fontSize: 10, marginBottom: 5 }}>MY STATUS</div>
          <button className="btn" onClick={() => setAvailable(!available)} style={{ borderColor: available ? 'var(--ok)' : 'var(--slate-dim)', color: available ? 'var(--ok)' : 'var(--slate)' }}>
            <span className="dot" style={{ background: available ? 'var(--ok)' : 'var(--slate-dim)' }} />
            {available ? 'Available for jobs' : 'Off duty'}
          </button>
        </div>
      </div>

      {next && (
        <div className="card" style={{ marginBottom: 14, borderColor: 'var(--gold)' }}>
          <div className="card-pad">
            <div className="eyebrow">Next assignment</div>
            <div style={{ fontWeight: 600, fontSize: 16, marginTop: 6 }}>{next.title}</div>
            <div className="dim" style={{ fontSize: 12.5, marginTop: 3 }}>{fmtDate(next.startDate)} → {fmtDate(next.endDate)} · {next.location}</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
              {next.vehicleIds.map(vid => { const v = vehicleById(vid); return v ? <span key={vid} className="chip">{v.emoji} {v.name} · {v.plate}</span> : null })}
            </div>
          </div>
        </div>
      )}

      <div className="grid cols-2" style={{ gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)' }}>
        <div className="card">
          <div className="card-pad"><h3 style={{ fontSize: 14 }}>My jobs</h3></div>
          <hr className="hairline" />
          <table className="tbl">
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} className="row">
                  <td>
                    <div style={{ fontWeight: 500 }}>{j.title}</div>
                    <div className="dim" style={{ fontSize: 11 }}>{fmtDate(j.startDate)} · {j.client}</div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="badge" style={{ background: 'var(--surface)', color: daysUntil(j.endDate) < 0 ? 'var(--slate-dim)' : 'var(--gold)' }}>
                      {daysUntil(j.startDate) > 0 ? 'in ' + daysUntil(j.startDate) + 'd' : daysUntil(j.endDate) < 0 ? 'Done' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && <tr><td className="dim" style={{ padding: 18 }}>No assignments yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-pad"><h3 style={{ fontSize: 14 }}>My documents</h3></div>
          <hr className="hairline" />
          <table className="tbl">
            <tbody>
              {d.compliance.map(doc => {
                const s = docStatus(doc.expiry)
                return <tr key={doc.label} className="row"><td style={{ fontWeight: 500 }}>{doc.label}</td><td style={{ textAlign: 'right' }}><span className={'badge ' + badge[s]}>{word[s]}</span><div className="num dimmer" style={{ fontSize: 10, marginTop: 3 }}>{fmtDate(doc.expiry)}</div></td></tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
