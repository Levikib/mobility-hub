'use client'
import { useState } from 'react'
import Link from 'next/link'
import { DRIVERS, vehicleById, worstDoc } from '../../lib/data'
import { initials } from '../../lib/brand'

const STATUS_COLORS: Record<string, string> = { Available: 'var(--ok)', 'On Job': 'var(--info)', 'Off Duty': 'var(--slate-dim)' }
const docBadge: Record<string, string> = { ok: 'badge-ok', soon: 'badge-soon', expired: 'badge-expired' }
const docText: Record<string, string> = { ok: 'Documents valid', soon: 'Renewal due', expired: 'Expired doc' }
const TABS = ['All', 'Available', 'On Job', 'Off Duty'] as const

export default function DriversPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('All')
  const list = DRIVERS.filter(d => tab === 'All' || d.status === tab)

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Directory</div>
          <h1 className="page-title">Chauffeurs</h1>
          <div className="dim" style={{ fontSize: 12.5, marginTop: 2 }}>{DRIVERS.length} vetted chauffeurs · PSV-badged</div>
        </div>
        <button className="btn btn-primary">+ Add chauffeur</button>
      </div>

      <div className="tabbar" style={{ marginBottom: 14 }}>
        {TABS.map(t => <div key={t} className={'tab' + (tab === t ? ' active' : '')} onClick={() => setTab(t)}>{t}</div>)}
      </div>

      <div className="grid cols-3">
        {list.map(d => {
          const home = d.homeVehicleId ? vehicleById(d.homeVehicleId) : null
          const w = worstDoc(d.compliance)
          return (
            <Link key={d.id} href={'/drivers/' + d.id} className="card card-pad">
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 46, height: 46, borderRadius: 11, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontWeight: 600, color: 'var(--gold)', fontSize: 16, flex: 'none' }}>{initials(d.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{d.name}</div>
                  <div className="dim" style={{ fontSize: 11.5 }}>{d.licenceClass}</div>
                </div>
                <span className="chip" style={{ color: STATUS_COLORS[d.status] }}><span className="dot" style={{ background: STATUS_COLORS[d.status] }} />{d.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
                <div><div className="dimmer" style={{ fontSize: 9.5 }}>RATING</div><div className="num" style={{ fontWeight: 700 }}>★ {d.rating.toFixed(1)}</div></div>
                <div><div className="dimmer" style={{ fontSize: 9.5 }}>EXPERIENCE</div><div className="num" style={{ fontWeight: 700 }}>{d.experienceYears} yrs</div></div>
                <div><div className="dimmer" style={{ fontSize: 9.5 }}>JOBS</div><div className="num" style={{ fontWeight: 700 }}>{d.jobsDone}</div></div>
              </div>
              <hr className="hairline" style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="dim" style={{ fontSize: 11.5 }}>{home ? '🚗 ' + home.name : 'Driver pool'}</span>
                <span className={'badge ' + docBadge[w]}>{docText[w]}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
