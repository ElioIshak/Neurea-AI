import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge, Button, DataTable, DemoNote, EmptyState, inputCls, OverlayFrame } from '../../components/ui'
import type { CaseRec, Patient, Study } from '../../types'

export function CaseTable({ cases, patients, studies, q, onOpen }: { cases: CaseRec[]; patients: Patient[]; studies: Study[]; q: string; onOpen: (id: string) => void }) {
  const pn = (id: string) => patients.find((p) => p.id === id)?.name ?? '—'
  const rows = cases.filter((c) => `${c.name} ${pn(c.patientId)}`.toLowerCase().includes(q.toLowerCase()))
  if (!rows.length) return <EmptyState title="No matching cases" text="Try a different name or create a new case." />
  return <DataTable<CaseRec> rows={rows} onRow={(r) => onOpen(r.id)} cols={[{ h: 'Case', cell: (r) => r.name }, { h: 'Patient', cell: (r) => pn(r.patientId) }, { h: 'Status (sample)', cell: (r) => <Badge>{r.status}</Badge> }, { h: 'Modified', cell: (r) => r.modified, hideSm: true }, { h: 'MRI', cell: (r) => studies.find((s) => s.id === r.studyId)?.title ?? 'None attached', hideSm: true }]} />
}
export default function CasesPanel(p: { cases: CaseRec[]; patients: Patient[]; studies: Study[]; onOpen: (id: string) => void; onNew: () => void; onClose: () => void }) {
  const [q, setQ] = useState('')
  return <OverlayFrame title="Cases" onClose={p.onClose}>
    <div className="flex gap-2.5 py-3"><input aria-label="Search cases" placeholder="Search cases" className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} /><Button variant="primary" className="shrink-0" onClick={p.onNew}><Plus size={16} />Create new case</Button></div>
    <DemoNote /><CaseTable cases={p.cases} patients={p.patients} studies={p.studies} q={q} onOpen={p.onOpen} />
    <p className="text-xs text-t2 mt-3">Report download is not available in this prototype.</p>
  </OverlayFrame>
}
