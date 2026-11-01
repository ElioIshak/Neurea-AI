import { useState } from 'react'
import { Button } from '../ui'
import type { CaseRec, Patient } from '../../types'

const Sec = ({ title, children }: { title: string; children: React.ReactNode }) => <section className="py-3 border-b border-bd last:border-0"><h3 className="text-t2 mb-1.5">{title}</h3>{children}</section>
export function Sidebar({ c, p, onPatient }: { c: CaseRec; p?: Patient; onPatient: () => void }) {
  const [notes, setNotes] = useState(c.notes)
  return <aside aria-label="Case information" className="px-5 pb-6 overflow-auto lg:border-r border-bd">
    <Sec title="Patient"><div className="font-medium">{p?.name}</div><div className="text-t2">DOB {p?.dob || '—'} · {p?.sex || '—'}</div><Button className="mt-2" onClick={onPatient}>View patient record</Button></Sec>
    <Sec title="Case"><div className="font-medium">{c.name}</div><div className="text-t2">Created {c.created} · Modified {c.modified}</div></Sec>
    <Sec title="Symptoms and concerns">{c.symptoms ? <><div>{c.symptoms}</div><div className="text-xs text-t2">As entered by the user</div></> : <span className="text-t2">None recorded.</span>}</Sec>
    <Sec title="Notes"><textarea aria-label="Case notes" className="w-full min-h-24 px-2.5 py-2 border border-bd rounded-md" value={notes} onChange={(e) => setNotes(e.target.value)} /><div className="text-xs text-t2" role="status">Local draft. Not saved anywhere.</div></Sec>
    <Sec title="Files"><span className="text-t2">No files attached (sample).</span></Sec>
    <Sec title="Timeline"><div>{c.created} · Case created (sample)</div></Sec>
  </aside>
}
