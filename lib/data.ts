// Executive Mobility Hub — demo seed data.
// Kenya-accurate: Toyota-heavy executive fleet (Prado, Land Cruiser V8) with Mercedes/Range
// Rover at the top; KES day-rate bands; government/corporate framework + wedding work;
// NTSA/PSV/TSV/insurance compliance with real expiry cycles. Figures are indicative market
// bands from research — validate against live operator quotes before going to production.

export type VehicleClass =
  | 'Executive Sedan' | 'Luxury SUV' | 'Executive MPV' | 'Prestige / Limousine' | 'VIP Van' | 'Coaster'
export type VehicleStatus = 'Available' | 'On Job' | 'Maintenance'
export type DocStatus = 'ok' | 'soon' | 'expired'

export type ComplianceDoc = { label: string; expiry: string } // ISO date

export type Vehicle = {
  id: string
  name: string
  make: string
  plate: string
  klass: VehicleClass
  year: number
  seats: number
  dailyRate: number // KES
  fuelPolicy: 'Full-to-full' | 'Billed on actuals' | 'Incl. 200km/day'
  status: VehicleStatus
  assignment: { kind: 'dedicated'; driverId: string } | { kind: 'pool' }
  odometer: number
  jobsDone: number
  utilisation: number // % last 30d
  compliance: ComplianceDoc[]
  emoji: string
}

export type Driver = {
  id: string
  name: string
  phone: string
  licenceClass: string
  experienceYears: number
  rating: number // out of 5
  status: 'Available' | 'On Job' | 'Off Duty'
  homeVehicleId: string | null // dedicated to a car, or null = pool
  jobsDone: number
  languages: string[]
  compliance: ComplianceDoc[]
}

export type ClientType = 'Government' | 'Corporate' | 'Diplomatic' | 'Wedding' | 'Event'
export type JobStatus = 'Enquiry' | 'Quoted' | 'Confirmed' | 'Dispatched' | 'Completed' | 'Invoiced'

export type Job = {
  id: string
  ref: string
  title: string
  client: string
  clientType: ClientType
  status: JobStatus
  startDate: string
  endDate: string
  location: string
  vehicleIds: string[]
  driverIds: string[]
  lsoRef: string | null
  signedOff: boolean
  cost: {
    days: number
    dayRateTotal: number
    driverAllowance: number
    fuel: number
    extras: number
    vatPct: number
  }
  notes: string
}

// ---- Vehicles -------------------------------------------------------------
export const VEHICLES: Vehicle[] = [
  { id: 'v-s500', name: 'Mercedes-Benz S500', make: 'Mercedes-Benz', plate: 'KDL 001A', klass: 'Executive Sedan', year: 2023, seats: 4, dailyRate: 45000, fuelPolicy: 'Billed on actuals', status: 'On Job', assignment: { kind: 'dedicated', driverId: 'd-mwangi' }, odometer: 38200, jobsDone: 64, utilisation: 82, emoji: '🚘',
    compliance: [ { label: 'NTSA Inspection', expiry: '2027-03-18' }, { label: 'Comprehensive Insurance', expiry: '2026-12-02' }, { label: 'PSV Licence', expiry: '2027-01-20' }, { label: 'TSV Licence', expiry: '2026-11-29' } ] },
  { id: 'v-lc300', name: 'Land Cruiser V8 (300)', make: 'Toyota', plate: 'KDK 444V', klass: 'Luxury SUV', year: 2022, seats: 7, dailyRate: 32000, fuelPolicy: 'Billed on actuals', status: 'On Job', assignment: { kind: 'dedicated', driverId: 'd-otieno' }, odometer: 72500, jobsDone: 121, utilisation: 91, emoji: '🚙',
    compliance: [ { label: 'NTSA Inspection', expiry: '2026-12-11' }, { label: 'Comprehensive Insurance', expiry: '2027-02-14' }, { label: 'PSV Licence', expiry: '2027-04-01' }, { label: 'TSV Licence', expiry: '2027-01-09' } ] },
  { id: 'v-prado1', name: 'Prado VX-L', make: 'Toyota', plate: 'KDM 212P', klass: 'Luxury SUV', year: 2023, seats: 7, dailyRate: 22000, fuelPolicy: 'Incl. 200km/day', status: 'Available', assignment: { kind: 'pool' }, odometer: 41800, jobsDone: 88, utilisation: 74, emoji: '🚙',
    compliance: [ { label: 'NTSA Inspection', expiry: '2027-05-22' }, { label: 'Comprehensive Insurance', expiry: '2026-11-21' }, { label: 'PSV Licence', expiry: '2027-03-15' }, { label: 'TSV Licence', expiry: '2027-02-28' } ] },
  { id: 'v-prado2', name: 'Prado TX-L', make: 'Toyota', plate: 'KDN 909P', klass: 'Luxury SUV', year: 2021, seats: 7, dailyRate: 20000, fuelPolicy: 'Incl. 200km/day', status: 'Available', assignment: { kind: 'pool' }, odometer: 96300, jobsDone: 142, utilisation: 68, emoji: '🚙',
    compliance: [ { label: 'NTSA Inspection', expiry: '2026-11-18' }, { label: 'Comprehensive Insurance', expiry: '2027-01-30' }, { label: 'PSV Licence', expiry: '2026-12-19' }, { label: 'TSV Licence', expiry: '2027-03-03' } ] },
  { id: 'v-alphard', name: 'Alphard Executive Lounge', make: 'Toyota', plate: 'KDL 777H', klass: 'Executive MPV', year: 2023, seats: 6, dailyRate: 28000, fuelPolicy: 'Billed on actuals', status: 'Available', assignment: { kind: 'dedicated', driverId: 'd-wanjiru' }, odometer: 29400, jobsDone: 53, utilisation: 79, emoji: '🚐',
    compliance: [ { label: 'NTSA Inspection', expiry: '2027-02-08' }, { label: 'Comprehensive Insurance', expiry: '2027-04-19' }, { label: 'PSV Licence', expiry: '2027-02-02' }, { label: 'TSV Licence', expiry: '2026-12-07' } ] },
  { id: 'v-eclass', name: 'Mercedes-Benz E350', make: 'Mercedes-Benz', plate: 'KDJ 318E', klass: 'Executive Sedan', year: 2022, seats: 4, dailyRate: 20000, fuelPolicy: 'Full-to-full', status: 'Maintenance', assignment: { kind: 'pool' }, odometer: 58700, jobsDone: 97, utilisation: 61, emoji: '🚘',
    compliance: [ { label: 'NTSA Inspection', expiry: '2026-11-15' }, { label: 'Comprehensive Insurance', expiry: '2026-11-25' }, { label: 'PSV Licence', expiry: '2027-01-11' }, { label: 'TSV Licence', expiry: '2027-02-17' } ] },
  { id: 'v-range', name: 'Range Rover Vogue', make: 'Land Rover', plate: 'KDL 555R', klass: 'Prestige / Limousine', year: 2022, seats: 4, dailyRate: 48000, fuelPolicy: 'Billed on actuals', status: 'Available', assignment: { kind: 'pool' }, odometer: 33100, jobsDone: 41, utilisation: 57, emoji: '🏎️',
    compliance: [ { label: 'NTSA Inspection', expiry: '2027-06-03' }, { label: 'Comprehensive Insurance', expiry: '2027-03-28' }, { label: 'PSV Licence', expiry: '2027-05-12' }, { label: 'TSV Licence', expiry: '2027-04-04' } ] },
  { id: 'v-hiace', name: 'Hiace VIP (High-roof)', make: 'Toyota', plate: 'KDG 120W', klass: 'VIP Van', year: 2021, seats: 9, dailyRate: 14000, fuelPolicy: 'Incl. 200km/day', status: 'On Job', assignment: { kind: 'pool' }, odometer: 113400, jobsDone: 176, utilisation: 85, emoji: '🚐',
    compliance: [ { label: 'NTSA Inspection', expiry: '2026-12-22' }, { label: 'Comprehensive Insurance', expiry: '2027-02-09' }, { label: 'PSV Licence', expiry: '2027-01-27' }, { label: 'TSV Licence', expiry: '2027-03-19' } ] },
  { id: 'v-coaster', name: 'Coaster (29-seat)', make: 'Toyota', plate: 'KDF 330C', klass: 'Coaster', year: 2020, seats: 29, dailyRate: 26000, fuelPolicy: 'Billed on actuals', status: 'Available', assignment: { kind: 'pool' }, odometer: 158900, jobsDone: 203, utilisation: 49, emoji: '🚌',
    compliance: [ { label: 'NTSA Inspection', expiry: '2026-11-30' }, { label: 'Comprehensive Insurance', expiry: '2027-01-15' }, { label: 'PSV Licence', expiry: '2026-12-05' }, { label: 'TSV Licence', expiry: '2027-02-21' } ] },
  { id: 'v-lc200', name: 'Land Cruiser V8 (200)', make: 'Toyota', plate: 'KDK 888V', klass: 'Luxury SUV', year: 2020, seats: 7, dailyRate: 26000, fuelPolicy: 'Billed on actuals', status: 'Available', assignment: { kind: 'dedicated', driverId: 'd-kipchoge' }, odometer: 121000, jobsDone: 188, utilisation: 72, emoji: '🚙',
    compliance: [ { label: 'NTSA Inspection', expiry: '2027-01-08' }, { label: 'Comprehensive Insurance', expiry: '2026-12-14' }, { label: 'PSV Licence', expiry: '2027-03-22' }, { label: 'TSV Licence', expiry: '2027-01-31' } ] },
]

// ---- Drivers --------------------------------------------------------------
export const DRIVERS: Driver[] = [
  { id: 'd-mwangi', name: 'James Mwangi', phone: '+254 712 004 118', licenceClass: 'B3 (Professional)', experienceYears: 14, rating: 4.9, status: 'On Job', homeVehicleId: 'v-s500', jobsDone: 410, languages: ['English', 'Kiswahili', 'Kikuyu'],
    compliance: [ { label: 'Driving Licence', expiry: '2028-04-10' }, { label: 'PSV Badge', expiry: '2026-12-01' }, { label: 'Certificate of Good Conduct', expiry: '2027-05-20' }, { label: 'Medical Fitness', expiry: '2027-08-14' } ] },
  { id: 'd-otieno', name: 'Collins Otieno', phone: '+254 722 551 902', licenceClass: 'B3 (Professional)', experienceYears: 11, rating: 4.8, status: 'On Job', homeVehicleId: 'v-lc300', jobsDone: 322, languages: ['English', 'Kiswahili', 'Dholuo'],
    compliance: [ { label: 'Driving Licence', expiry: '2027-11-22' }, { label: 'PSV Badge', expiry: '2027-02-18' }, { label: 'Certificate of Good Conduct', expiry: '2026-11-24' }, { label: 'Medical Fitness', expiry: '2028-01-05' } ] },
  { id: 'd-wanjiru', name: 'Grace Wanjiru', phone: '+254 733 870 441', licenceClass: 'B3 (Professional)', experienceYears: 8, rating: 4.9, status: 'Available', homeVehicleId: 'v-alphard', jobsDone: 201, languages: ['English', 'Kiswahili', 'French'],
    compliance: [ { label: 'Driving Licence', expiry: '2029-02-27' }, { label: 'PSV Badge', expiry: '2027-03-30' }, { label: 'Certificate of Good Conduct', expiry: '2027-07-11' }, { label: 'Medical Fitness', expiry: '2027-10-02' } ] },
  { id: 'd-kipchoge', name: 'Daniel Kipchoge', phone: '+254 710 332 650', licenceClass: 'B3 (Professional)', experienceYears: 16, rating: 4.7, status: 'Available', homeVehicleId: 'v-lc200', jobsDone: 455, languages: ['English', 'Kiswahili', 'Kalenjin'],
    compliance: [ { label: 'Driving Licence', expiry: '2027-12-09' }, { label: 'PSV Badge', expiry: '2026-11-19' }, { label: 'Certificate of Good Conduct', expiry: '2027-04-03' }, { label: 'Medical Fitness', expiry: '2027-06-28' } ] },
  { id: 'd-achieng', name: 'Mercy Achieng', phone: '+254 745 118 207', licenceClass: 'B3 (Professional)', experienceYears: 7, rating: 4.8, status: 'Available', homeVehicleId: null, jobsDone: 143, languages: ['English', 'Kiswahili'],
    compliance: [ { label: 'Driving Licence', expiry: '2028-09-15' }, { label: 'PSV Badge', expiry: '2027-05-06' }, { label: 'Certificate of Good Conduct', expiry: '2027-09-22' }, { label: 'Medical Fitness', expiry: '2028-03-11' } ] },
  { id: 'd-barasa', name: 'Victor Barasa', phone: '+254 720 664 713', licenceClass: 'D1 (Vans)', experienceYears: 13, rating: 4.6, status: 'On Job', homeVehicleId: null, jobsDone: 388, languages: ['English', 'Kiswahili', 'Luhya'],
    compliance: [ { label: 'Driving Licence', expiry: '2027-10-30' }, { label: 'PSV Badge', expiry: '2027-01-14' }, { label: 'Certificate of Good Conduct', expiry: '2026-12-08' }, { label: 'Medical Fitness', expiry: '2027-11-19' } ] },
  { id: 'd-mutua', name: 'Peter Mutua', phone: '+254 768 229 540', licenceClass: 'D2 (Mid-bus)', experienceYears: 19, rating: 4.7, status: 'Available', homeVehicleId: null, jobsDone: 512, languages: ['English', 'Kiswahili', 'Kamba'],
    compliance: [ { label: 'Driving Licence', expiry: '2028-06-20' }, { label: 'PSV Badge', expiry: '2027-04-24' }, { label: 'Certificate of Good Conduct', expiry: '2027-02-15' }, { label: 'Medical Fitness', expiry: '2027-12-01' } ] },
  { id: 'd-njeri', name: 'Anne Njeri', phone: '+254 714 905 388', licenceClass: 'B3 (Professional)', experienceYears: 6, rating: 4.9, status: 'Off Duty', homeVehicleId: null, jobsDone: 97, languages: ['English', 'Kiswahili'],
    compliance: [ { label: 'Driving Licence', expiry: '2029-01-18' }, { label: 'PSV Badge', expiry: '2027-06-12' }, { label: 'Certificate of Good Conduct', expiry: '2027-08-30' }, { label: 'Medical Fitness', expiry: '2028-02-09' } ] },
]

// ---- Jobs / Bookings ------------------------------------------------------
export const JOBS: Job[] = [
  { id: 'j-au', ref: 'EMH-2611-014', title: 'AU Special Envoy — Airport & Summit Transfers', client: 'Ministry of Foreign Affairs', clientType: 'Government', status: 'Dispatched', startDate: '2026-11-12', endDate: '2026-11-15', location: 'JKIA · Nairobi CBD · KICC', vehicleIds: ['v-s500', 'v-lc300', 'v-hiace'], driverIds: ['d-mwangi', 'd-otieno', 'd-barasa'], lsoRef: 'LSO/MFA/2026/0391', signedOff: false,
    cost: { days: 4, dayRateTotal: (45000 + 32000 + 14000) * 4, driverAllowance: 3 * 2500 * 4, fuel: 86000, extras: 40000, vatPct: 16 }, notes: 'Convoy with lead car. Protocol officer: Hon. A. Mohamed. Strict timekeeping; confidentiality NDA signed.' },
  { id: 'j-wed', ref: 'EMH-2611-019', title: 'Karimi–Odhiambo Wedding', client: 'Faith Karimi', clientType: 'Wedding', status: 'Confirmed', startDate: '2026-11-22', endDate: '2026-11-22', location: 'Karen · Windsor Golf Hotel', vehicleIds: ['v-range', 'v-eclass'], driverIds: ['d-kipchoge', 'd-achieng'], lsoRef: null, signedOff: false,
    cost: { days: 1, dayRateTotal: 48000 + 20000, driverAllowance: 2 * 2500, fuel: 12000, extras: 15000, vatPct: 16 }, notes: 'Range Rover decorated (bridal). 50% deposit paid via M-Pesa. Balance on the day.' },
  { id: 'j-kengen', ref: 'EMH-2610-022', title: 'KenGen Board Retreat — Naivasha', client: 'KenGen PLC', clientType: 'Corporate', status: 'Invoiced', startDate: '2026-10-28', endDate: '2026-10-30', location: 'Nairobi · Naivasha', vehicleIds: ['v-prado1', 'v-prado2', 'v-lc200'], driverIds: ['d-wanjiru', 'd-mutua', 'd-njeri'], lsoRef: 'LSO/KGN/2026/1187', signedOff: true,
    cost: { days: 3, dayRateTotal: (22000 + 20000 + 26000) * 3, driverAllowance: 3 * 3000 * 3, fuel: 72000, extras: 0, vatPct: 16 }, notes: 'Framework agreement draw-down. Night-out allowance paid. eTIMS invoice issued; awaiting 30-day settlement.' },
  { id: 'j-dipl', ref: 'EMH-2611-024', title: 'EU Delegation — City Programme', client: 'Delegation of the EU to Kenya', clientType: 'Diplomatic', status: 'Quoted', startDate: '2026-11-25', endDate: '2026-11-27', location: 'Gigiri · Nairobi CBD', vehicleIds: ['v-lc300', 'v-alphard'], driverIds: ['d-otieno', 'd-wanjiru'], lsoRef: null, signedOff: false,
    cost: { days: 3, dayRateTotal: (32000 + 28000) * 3, driverAllowance: 2 * 2500 * 3, fuel: 45000, extras: 20000, vatPct: 16 }, notes: 'Quote sent; awaiting LPO. Vetted drivers + Certificate of Good Conduct requested.' },
  { id: 'j-conf', ref: 'EMH-2611-027', title: 'Safaricom Leaders Conference — Staff Shuttle', client: 'Safaricom PLC', clientType: 'Corporate', status: 'Confirmed', startDate: '2026-11-19', endDate: '2026-11-20', location: 'Nairobi · Two Rivers', vehicleIds: ['v-coaster'], driverIds: ['d-mutua'], lsoRef: 'LSO/SAF/2026/0774', signedOff: false,
    cost: { days: 2, dayRateTotal: 26000 * 2, driverAllowance: 2500 * 2, fuel: 22000, extras: 0, vatPct: 16 }, notes: 'Framework agreement. Staff movement between venues.' },
  { id: 'j-air', ref: 'EMH-2611-031', title: 'JKIA VIP Meet-and-Greet — Investor Visit', client: 'KenInvest', clientType: 'Government', status: 'Enquiry', startDate: '2026-11-28', endDate: '2026-11-29', location: 'JKIA · Westlands', vehicleIds: [], driverIds: [], lsoRef: null, signedOff: false,
    cost: { days: 2, dayRateTotal: 0, driverAllowance: 0, fuel: 0, extras: 0, vatPct: 16 }, notes: 'New enquiry — needs an Alphard or S-Class + meet-and-assist. Awaiting availability check and quote.' },
]

// ---- Helpers --------------------------------------------------------------
export const vehicleById = (id: string) => VEHICLES.find(v => v.id === id)
export const driverById = (id: string) => DRIVERS.find(d => d.id === id)
export const jobById = (id: string) => JOBS.find(j => j.id === id)

export function jobTotal(j: Job): number {
  const sub = j.cost.dayRateTotal + j.cost.driverAllowance + j.cost.fuel + j.cost.extras
  return Math.round(sub * (1 + j.cost.vatPct / 100))
}
export function jobSubtotal(j: Job): number {
  return j.cost.dayRateTotal + j.cost.driverAllowance + j.cost.fuel + j.cost.extras
}

// Days until a date (negative = past). "Today" is fixed for a stable demo.
export const TODAY = new Date('2026-11-13')
export function daysUntil(iso: string): number {
  return Math.round((new Date(iso).getTime() - TODAY.getTime()) / 86400000)
}
export function docStatus(iso: string): DocStatus {
  const d = daysUntil(iso)
  if (d < 0) return 'expired'
  if (d <= 30) return 'soon'
  return 'ok'
}
// Earliest-expiring doc status across a set (for a roll-up badge).
export function worstDoc(docs: ComplianceDoc[]): DocStatus {
  let worst: DocStatus = 'ok'
  for (const d of docs) {
    const s = docStatus(d.expiry)
    if (s === 'expired') return 'expired'
    if (s === 'soon') worst = 'soon'
  }
  return worst
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
export const fmtDateShort = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
