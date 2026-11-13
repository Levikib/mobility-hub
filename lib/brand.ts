// Executive Mobility Hub — brand tokens.
// Direction from brand research: institutional "Statehouse" palette (deep navy + champagne
// gold), restraint over decoration, audit-ready/serious. Reads "safe to sign off on" to a
// government procurement officer, not "wedding vendor".

export const BRAND = {
  name: 'Executive Mobility Hub',
  short: 'EMH',
  tagline: 'Arrive in confidence.',
}

export const C = {
  ink: '#0E1A2B',       // base navy
  midnight: '#152536',  // surfaces
  surface: '#17293c',   // raised surface
  line: 'rgba(231,227,218,0.10)',
  lineHi: 'rgba(231,227,218,0.18)',
  gold: '#C8A24A',      // champagne gold — primary accent, hairlines, monogram
  goldSoft: 'rgba(200,162,74,0.14)',
  platinum: '#E7E3DA',  // light text / paper
  slate: '#8A94A3',     // secondary text
  slateDim: '#5B6472',
  white: '#FAFAF7',
  // status
  ok: '#5BBF8A',
  warn: '#D9A441',
  danger: '#D9604B',
  info: '#6FA8D6',
}

export const mono = "'JetBrains Mono', ui-monospace, monospace"
export const serif = "'Fraunces', Georgia, serif"
export const sans = "'Inter', system-ui, -apple-system, sans-serif"

// KES currency formatting — the whole product thinks in Kenyan shillings.
export function kes(n: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact && n >= 1_000_000) return 'KES ' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (opts.compact && n >= 1_000) return 'KES ' + (n / 1_000).toFixed(0) + 'K'
  return 'KES ' + n.toLocaleString('en-KE')
}

export function initials(name: string): string {
  return name.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase()
}
