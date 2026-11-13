'use client'
// Interactive "add" flows for the demo. Each button opens a modal, writes to the in-session
// store, and the lists + dashboard update immediately — so in a pitch the owner can add a
// chauffeur, a vehicle or a booking and watch the system respond. Resets on reload (no DB yet).
import { useState, type ReactNode } from 'react'
import { useStore } from '../lib/store'
import { kes } from '../lib/brand'
import type { VehicleClass, ClientType } from '../lib/data'

function Modal({ title, sub, onClose, children, footer }: { title: string; sub?: string; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{title}</h3>
            {sub && <div className="dim" style={{ fontSize: 12, marginTop: 3 }}>{sub}</div>}
          </div>
          <button className="btn btn-sm" onClick={onClose} aria-label="Close" style={{ flex: 'none' }}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-foot">{footer}</div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="field"><label>{label}</label>{children}</div>
}

const VCLASSES: VehicleClass[] = ['Executive Sedan', 'Luxury SUV', 'Executive MPV', 'Prestige / Limousine', 'VIP Van', 'Coaster']
const CTYPES: ClientType[] = ['Government', 'Corporate', 'Diplomatic', 'Wedding', 'Event']
const LICENCES = ['B3 (Professional)', 'D1 (Vans)', 'D2 (Mid-bus)']

export function AddDriverButton() {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [licence, setLicence] = useState(LICENCES[0])
  const [exp, setExp] = useState('6')
  const [home, setHome] = useState('')

  function save() {
    if (!name.trim()) return
    store.addDriver({ name: name.trim(), phone: phone.trim() || undefined, licenceClass: licence, experienceYears: Number(exp) || 0, homeVehicleId: home || null })
    setOpen(false); setName(''); setPhone(''); setExp('6'); setHome('')
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Add chauffeur</button>
      {open && (
        <Modal title="Add a chauffeur" sub="They appear in the directory straight away." onClose={() => setOpen(false)}
          footer={<><button className="btn" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={!name.trim()}>Add chauffeur</button></>}>
          <Field label="Full name"><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Kamau" autoFocus /></Field>
          <div className="field-row">
            <Field label="Phone"><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 7…" /></Field>
            <Field label="Experience (yrs)"><input type="number" min="0" value={exp} onChange={e => setExp(e.target.value)} /></Field>
          </div>
          <div className="field-row">
            <Field label="Licence class"><select value={licence} onChange={e => setLicence(e.target.value)}>{LICENCES.map(l => <option key={l} value={l}>{l}</option>)}</select></Field>
            <Field label="Home vehicle"><select value={home} onChange={e => setHome(e.target.value)}><option value="">Driver pool</option>{store.vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></Field>
          </div>
        </Modal>
      )}
    </>
  )
}

export function AddVehicleButton() {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [plate, setPlate] = useState('')
  const [klass, setKlass] = useState<VehicleClass>('Luxury SUV')
  const [year, setYear] = useState('2024')
  const [seats, setSeats] = useState('5')
  const [rate, setRate] = useState('25000')

  function save() {
    if (!name.trim()) return
    store.addVehicle({ name: name.trim(), plate: plate.trim() || undefined, klass, year: Number(year) || 2024, seats: Number(seats) || 5, dailyRate: Number(rate) || 0 })
    setOpen(false); setName(''); setPlate(''); setRate('25000')
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Add vehicle</button>
      {open && (
        <Modal title="Add a vehicle" sub="New cars join the fleet instantly." onClose={() => setOpen(false)}
          footer={<><button className="btn" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={!name.trim()}>Add vehicle</button></>}>
          <Field label="Vehicle"><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Toyota Prado TX" autoFocus /></Field>
          <div className="field-row">
            <Field label="Number plate"><input value={plate} onChange={e => setPlate(e.target.value)} placeholder="KDX 000X" /></Field>
            <Field label="Class"><select value={klass} onChange={e => setKlass(e.target.value as VehicleClass)}>{VCLASSES.map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
          </div>
          <div className="field-row">
            <Field label="Year"><input type="number" value={year} onChange={e => setYear(e.target.value)} /></Field>
            <Field label="Seats"><input type="number" value={seats} onChange={e => setSeats(e.target.value)} /></Field>
          </div>
          <Field label="Day rate (KES)"><input type="number" step="1000" value={rate} onChange={e => setRate(e.target.value)} /></Field>
        </Modal>
      )}
    </>
  )
}

function daysBetween(a: string, b: string): number {
  if (!a || !b) return 1
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1)
}

export function AddBookingButton({ label = '+ New booking' }: { label?: string }) {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [client, setClient] = useState('')
  const [ctype, setCtype] = useState<ClientType>('Corporate')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [loc, setLoc] = useState('')
  const [veh, setVeh] = useState<string[]>([])
  const [drv, setDrv] = useState<string[]>([])

  const days = daysBetween(start, end)
  const estimate = veh.reduce((a, id) => a + (store.vehicles.find(v => v.id === id)?.dailyRate || 0), 0) * days

  function toggle(list: string[], set: (v: string[]) => void, id: string) {
    set(list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  }
  function save() {
    if (!title.trim() || !start || !end) return
    store.addBooking({ title: title.trim(), client: client.trim() || 'New client', clientType: ctype, startDate: start, endDate: end, location: loc.trim() || undefined, vehicleIds: veh, driverIds: drv })
    setOpen(false); setTitle(''); setClient(''); setStart(''); setEnd(''); setLoc(''); setVeh([]); setDrv([])
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>{label}</button>
      {open && (
        <Modal title="New booking" sub="Pick the cars and the cost is worked out for you." onClose={() => setOpen(false)}
          footer={<><button className="btn" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={!title.trim() || !start || !end}>Create booking</button></>}>
          <Field label="What is the job?"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Board retreat — Naivasha" autoFocus /></Field>
          <div className="field-row">
            <Field label="Client"><input value={client} onChange={e => setClient(e.target.value)} placeholder="Company / name" /></Field>
            <Field label="Type"><select value={ctype} onChange={e => setCtype(e.target.value as ClientType)}>{CTYPES.map(c => <option key={c} value={c}>{c}</option>)}</select></Field>
          </div>
          <div className="field-row">
            <Field label="From"><input type="date" value={start} onChange={e => setStart(e.target.value)} /></Field>
            <Field label="To"><input type="date" value={end} onChange={e => setEnd(e.target.value)} /></Field>
          </div>
          <Field label="Location"><input value={loc} onChange={e => setLoc(e.target.value)} placeholder="e.g. Nairobi · Naivasha" /></Field>
          <Field label={'Vehicles' + (veh.length ? ' · ' + veh.length + ' picked' : '')}>
            <div className="pick">
              {store.vehicles.map(v => <label key={v.id}><input type="checkbox" checked={veh.includes(v.id)} onChange={() => toggle(veh, setVeh, v.id)} />{v.name}</label>)}
            </div>
          </Field>
          <Field label={'Chauffeurs' + (drv.length ? ' · ' + drv.length + ' picked' : '')}>
            <div className="pick">
              {store.drivers.map(d => <label key={d.id}><input type="checkbox" checked={drv.includes(d.id)} onChange={() => toggle(drv, setDrv, d.id)} />{d.name.split(' ')[0]}</label>)}
            </div>
          </Field>
          <div className="card card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px' }}>
            <div><div className="dimmer" style={{ fontSize: 10 }}>ESTIMATE · {days} day{days === 1 ? '' : 's'}</div><div className="dim" style={{ fontSize: 10.5 }}>Day rates only — fuel &amp; VAT added later</div></div>
            <div className="num" style={{ fontSize: 18, fontWeight: 700, color: 'var(--gold)' }}>{estimate ? kes(estimate, { compact: true }) : '—'}</div>
          </div>
        </Modal>
      )}
    </>
  )
}
