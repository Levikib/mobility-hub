'use client'
import { useState } from 'react'
import Link from 'next/link'
import { VEHICLES, driverById, worstDoc, type VehicleClass } from '../../lib/data'
import { kes } from '../../lib/brand'
import { useStore } from '../../lib/store'
import { AddVehicleButton } from '../../components/QuickAdd'

const STATUS_COLORS: Record<string, string> = { Available: 'var(--ok)', 'On Job': 'var(--info)', Maintenance: 'var(--warn)' }
const CLASSES: (VehicleClass | 'All')[] = ['All', 'Executive Sedan', 'Luxury SUV', 'Executive MPV', 'Prestige / Limousine', 'VIP Van', 'Coaster']
const docBadge: Record<string, string> = { ok: 'badge-ok', soon: 'badge-soon', expired: 'badge-expired' }
const docText: Record<string, string> = { ok: 'Compliant', soon: 'Renewal due', expired: 'Expired doc' }
const SEED = new Set(VEHICLES.map(v => v.id))

export default function FleetPage() {
  const store = useStore()
  const [klass, setKlass] = useState<VehicleClass | 'All'>('All')
  const [onlyAvail, setOnlyAvail] = useState(false)
  const list = store.vehicles.filter(v => (klass === 'All' || v.klass === klass) && (!onlyAvail || v.status === 'Available'))

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Directory</div>
          <h1 className="page-title">Fleet</h1>
          <div className="dim" style={{ fontSize: 12.5, marginTop: 2 }}>{store.vehicles.length} vehicles · executive &amp; government-grade</div>
        </div>
        <AddVehicleButton />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <div className="tabbar">
          {CLASSES.map(c => <div key={c} className={'tab' + (klass === c ? ' active' : '')} onClick={() => setKlass(c)}>{c}</div>)}
        </div>
        <label className="chip" style={{ cursor: 'pointer', height: 30 }} onClick={() => setOnlyAvail(!onlyAvail)}>
          <span className="dot" style={{ background: onlyAvail ? 'var(--ok)' : 'var(--slate-dim)' }} /> Available only
        </label>
      </div>

      <div className="grid cols-3">
        {list.map(v => {
          const drv = v.assignment.kind === 'dedicated' ? driverById(v.assignment.driverId) : null
          const w = worstDoc(v.compliance)
          const isNew = !SEED.has(v.id)
          const Card: any = isNew ? 'div' : Link
          return (
            <Card key={v.id} {...(isNew ? {} : { href: '/fleet/' + v.id })} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(150deg, var(--surface), var(--midnight))', padding: '20px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 40 }}>{v.emoji}</div>
                <span className="chip" style={{ color: STATUS_COLORS[v.status] }}><span className="dot" style={{ background: STATUS_COLORS[v.status] }} />{v.status}</span>
              </div>
              <div className="card-pad">
                <div style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 7 }}>{v.name}{isNew && <span className="tag-new">NEW</span>}</div>
                <div className="mono dimmer" style={{ fontSize: 10.5, marginTop: 2 }}>{v.plate} · {v.year} · {v.seats} seats</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14 }}>
                  <div>
                    <div className="dimmer" style={{ fontSize: 10 }}>DAY RATE</div>
                    <div className="num" style={{ fontSize: 17, fontWeight: 700, color: 'var(--gold)' }}>{kes(v.dailyRate)}</div>
                  </div>
                  <span className={'badge ' + docBadge[w]}>{docText[w]}</span>
                </div>
                <hr className="hairline" style={{ margin: '12px 0' }} />
                <div className="dim" style={{ fontSize: 11.5 }}>{v.klass} · {drv ? '🧑‍✈️ ' + drv.name : 'Pool assignment'}</div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
