'use client'
import { useState } from 'react'
import Link from 'next/link'
import { JOBS, jobTotal, fmtDateShort, type JobStatus } from '../../lib/data'
import { kes } from '../../lib/brand'

const JOB_COLORS: Record<string, string> = { Enquiry: 'var(--slate)', Quoted: 'var(--info)', Confirmed: 'var(--gold)', Dispatched: 'var(--ok)', Completed: 'var(--slate)', Invoiced: 'var(--ok)' }
const TYPE_TINT: Record<string, string> = { Government: 'var(--gold)', Diplomatic: 'var(--info)', Corporate: 'var(--platinum)', Wedding: '#C9879F', Event: 'var(--ok)' }
const TABS: (JobStatus | 'All')[] = ['All', 'Enquiry', 'Quoted', 'Confirmed', 'Dispatched', 'Invoiced']

export default function JobsPage() {
  const [tab, setTab] = useState<JobStatus | 'All'>('All')
  const list = JOBS.filter(j => tab === 'All' || j.status === tab)

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Operations</div>
          <h1 className="page-title">Bookings &amp; Jobs</h1>
          <div className="dim" style={{ fontSize: 12.5, marginTop: 2 }}>Enquiry → quote → dispatch → sign-off → invoice</div>
        </div>
        <button className="btn btn-primary">+ New booking</button>
      </div>

      <div className="tabbar" style={{ marginBottom: 14 }}>
        {TABS.map(t => <div key={t} className={'tab' + (tab === t ? ' active' : '')} onClick={() => setTab(t)}>{t}</div>)}
      </div>

      <div className="card">
        <table className="tbl">
          <thead><tr><th>Ref</th><th>Engagement</th><th>Client</th><th>Dates</th><th>Fleet</th><th>Status</th><th style={{ textAlign: 'right' }}>Value</th></tr></thead>
          <tbody>
            {list.map(j => (
              <tr key={j.id} className="row">
                <td className="mono dimmer" style={{ fontSize: 10.5, whiteSpace: 'nowrap' }}>{j.ref}</td>
                <td style={{ maxWidth: 260 }}><Link href={'/jobs/' + j.id} style={{ fontWeight: 600 }}>{j.title}</Link><div className="dim" style={{ fontSize: 11 }}>{j.location}</div></td>
                <td><span style={{ color: TYPE_TINT[j.clientType], fontSize: 12.5 }}>{j.client}</span><div className="dimmer mono" style={{ fontSize: 9.5 }}>{j.clientType.toUpperCase()}</div></td>
                <td className="num dim" style={{ fontSize: 11.5, whiteSpace: 'nowrap' }}>{fmtDateShort(j.startDate)}–{fmtDateShort(j.endDate)}</td>
                <td className="num dim">{j.vehicleIds.length || '—'}</td>
                <td><span className="badge" style={{ color: JOB_COLORS[j.status], background: 'var(--surface)' }}>{j.status}</span></td>
                <td className="num" style={{ textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 600 }}>{jobTotal(j) ? kes(jobTotal(j), { compact: true }) : 'TBQ'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
