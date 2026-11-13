'use client'
// Live in-session store for the demo. Seeded from the static seed data, held in React state,
// so during a pitch the client can add a chauffeur, a vehicle or a booking and watch it appear
// immediately across the app. Resets on reload — no database yet (that comes once they sign on).
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { VEHICLES, DRIVERS, JOBS, type Vehicle, type Driver, type Job } from './data'

type NewDriver = { name: string; phone?: string; licenceClass?: string; experienceYears?: number; languages?: string[]; homeVehicleId?: string | null }
type NewVehicle = { name: string; make?: string; plate?: string; klass?: Vehicle['klass']; year?: number; seats?: number; dailyRate?: number }
type NewBooking = { title: string; client: string; clientType?: Job['clientType']; startDate: string; endDate: string; location?: string; vehicleIds?: string[]; driverIds?: string[] }

type Store = {
  vehicles: Vehicle[]
  drivers: Driver[]
  jobs: Job[]
  addDriver: (d: NewDriver) => Driver
  addVehicle: (v: NewVehicle) => Vehicle
  addBooking: (j: NewBooking) => Job
  setDriverStatus: (id: string, status: Driver['status']) => void
  setVehicleStatus: (id: string, status: Vehicle['status']) => void
  reset: () => void
}

const Ctx = createContext<Store | null>(null)

// Default compliance docs for newly-added records (a year out, so they read as "valid").
function futureISO(monthsAhead: number): string {
  const d = new Date('2026-11-13')
  d.setMonth(d.getMonth() + monthsAhead)
  return d.toISOString().slice(0, 10)
}
const newVehicleDocs = () => [
  { label: 'NTSA Inspection', expiry: futureISO(12) },
  { label: 'Comprehensive Insurance', expiry: futureISO(10) },
  { label: 'PSV Licence', expiry: futureISO(11) },
  { label: 'TSV Licence', expiry: futureISO(9) },
]
const newDriverDocs = () => [
  { label: 'Driving Licence', expiry: futureISO(24) },
  { label: 'PSV Badge', expiry: futureISO(14) },
  { label: 'Certificate of Good Conduct', expiry: futureISO(12) },
  { label: 'Medical Fitness', expiry: futureISO(18) },
]

let seq = 1000
const uid = (p: string) => p + '-' + ++seq

export function StoreProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => [...VEHICLES])
  const [drivers, setDrivers] = useState<Driver[]>(() => [...DRIVERS])
  const [jobs, setJobs] = useState<Job[]>(() => [...JOBS])

  const api = useMemo<Store>(() => ({
    vehicles, drivers, jobs,
    addDriver: (d) => {
      const driver: Driver = {
        id: uid('d'), name: d.name, phone: d.phone || '+254 7__ ___ ___',
        licenceClass: d.licenceClass || 'B3 (Professional)', experienceYears: d.experienceYears ?? 5,
        rating: 5.0, status: 'Available', homeVehicleId: d.homeVehicleId ?? null, jobsDone: 0,
        languages: d.languages || ['English', 'Kiswahili'], compliance: newDriverDocs(),
      }
      setDrivers(x => [driver, ...x]); return driver
    },
    addVehicle: (v) => {
      const vehicle: Vehicle = {
        id: uid('v'), name: v.name, make: v.make || v.name.split(' ')[0], plate: v.plate || 'KDX 000X',
        klass: v.klass || 'Luxury SUV', year: v.year ?? 2024, seats: v.seats ?? 5, dailyRate: v.dailyRate ?? 20000,
        fuelPolicy: 'Billed on actuals', status: 'Available', assignment: { kind: 'pool' }, odometer: 0, jobsDone: 0,
        utilisation: 0, compliance: newVehicleDocs(), emoji: '🚙',
      }
      setVehicles(x => [vehicle, ...x]); return vehicle
    },
    addBooking: (j) => {
      const start = new Date(j.startDate), end = new Date(j.endDate)
      const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1)
      const dayRateTotal = (j.vehicleIds || []).reduce((a, id) => a + (vehicles.find(v => v.id === id)?.dailyRate || 0), 0) * days
      const job: Job = {
        id: uid('j'), ref: 'EMH-NEW-' + (seq % 1000), title: j.title, client: j.client,
        clientType: j.clientType || 'Corporate', status: 'Enquiry', startDate: j.startDate, endDate: j.endDate,
        location: j.location || 'Nairobi', vehicleIds: j.vehicleIds || [], driverIds: j.driverIds || [],
        lsoRef: null, signedOff: false,
        cost: { days, dayRateTotal, driverAllowance: (j.driverIds?.length || 0) * 2500 * days, fuel: 0, extras: 0, vatPct: 16 },
        notes: 'Created in-session during the demo.',
      }
      setJobs(x => [job, ...x]); return job
    },
    setDriverStatus: (id, status) => setDrivers(x => x.map(d => d.id === id ? { ...d, status } : d)),
    setVehicleStatus: (id, status) => setVehicles(x => x.map(v => v.id === id ? { ...v, status } : v)),
    reset: () => { setVehicles([...VEHICLES]); setDrivers([...DRIVERS]); setJobs([...JOBS]) },
  }), [vehicles, drivers, jobs])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used within StoreProvider')
  return s
}
