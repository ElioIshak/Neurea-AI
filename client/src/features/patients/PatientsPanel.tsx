import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, DataTable, DemoNote, EmptyState, Field, inputCls, Modal, OverlayFrame } from '../../components/ui'
import type { CaseRec, Patient, Study } from '../../types'

export default function PatientsPanel({ patients, cases, studies, detailId, setDetail, onAdd, onOpenCase, onOpenStudy, onClose }: { patients: Patient[]; cases: CaseRec[]; studies: Study[]; detailId?: string; setDetail: (id?: string) => void; onAdd: (p: Patient) => void; onOpenCase: (id: string) => void; onOpenStudy: (id: string) => void; onClose: () => void }) {
  const [q, setQ] = useState(''), [adding, setAdding] = useState(false), [f, setF] = useState({ name: '', dob: '', sex: '' }), [err, setErr] = useState('')
  const p = patients.find((x) => x.id === detailId)
  const rows = patients.filter((x) => x.name.toLowerCase().includes(q.toLowerCase()))
  const save = () => { if (!f.name.trim()) return setErr('Enter the patient’s full name.'); onAdd({ id: `p${Date.now()}`, name: f.name, dob: f.dob, sex: f.sex as Patient['sex'], note: '' }); setAdding(false); setF({ name: '', dob: '', sex: '' }); setErr('') }
  return <OverlayFrame title={p ? p.name : 'Patients'} onBack={p ? () => setDetail() : undefined} onClose={onClose}>
    {p ? <div className="pt-3">
      <dl className="grid grid-cols-[130px_1fr] gap-y-1.5 mb-4"><dt className="text-t2">Date of birth</dt><dd>{p.dob || '—'}</dd><dt className="text-t2">Sex</dt><dd>{p.sex || '—'}</dd><dt className="text-t2">Notes</dt><dd>{p.note || '—'}</dd><dt className="text-t2">Files</dt><dd className="text-t2">None</dd></dl>
      <h3 className="text-t2 mb-1.5">Cases</h3>{cases.filter((c) => c.patientId === p.id).map((c) => <Button key={c.id} className="mr-2 mb-2" onClick={() => onOpenCase(c.id)}>{c.name}</Button>)}
      <h3 className="text-t2 mb-1.5 mt-2">MRI studies</h3>{studies.filter((s) => s.patientId === p.id).map((s) => <Button key={s.id} className="mr-2 mb-2" onClick={() => onOpenStudy(s.id)}>{s.title}</Button>)}
    </div> : <>
      <div className="flex gap-2.5 py-3"><input aria-label="Search patients" placeholder="Search patients" className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} /><Button variant="primary" className="shrink-0" onClick={() => setAdding(true)}><Plus size={16} />Add patient</Button></div>
      <DemoNote />
      {rows.length ? <DataTable<Patient> rows={rows} onRow={(r) => setDetail(r.id)} cols={[{ h: 'Name', cell: (r) => r.name }, { h: 'Date of birth', cell: (r) => r.dob || '—' }, { h: 'Cases', cell: (r) => cases.filter((c) => c.patientId === r.id).length }, { h: 'Studies', cell: (r) => studies.filter((s) => s.patientId === r.id).length, hideSm: true }]} /> : <EmptyState title="No patients found" text="Try another search or add a patient." />}
    </>}
    {adding && <Modal label="Add patient" onClose={() => setAdding(false)}>
      <h2 className="text-base font-semibold mb-3">Add patient</h2>
      <Field label="Full name" error={err}><input className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <Field label="Date of birth"><input type="date" className={inputCls} value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} /></Field>
      <Field label="Sex"><select className={inputCls} value={f.sex} onChange={(e) => setF({ ...f, sex: e.target.value })}><option value="">Not specified</option><option>Female</option><option>Male</option><option>Other</option></select></Field>
      <div className="flex justify-end gap-2"><Button onClick={() => setAdding(false)}>Cancel</Button><Button variant="primary" onClick={save}>Add patient</Button></div></Modal>}
  </OverlayFrame>
}
