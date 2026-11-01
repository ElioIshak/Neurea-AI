import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button, DataTable, DemoNote, EmptyState, inputCls, OverlayFrame } from '../../components/ui'
import type { CaseRec, Patient, Study } from '../../types'

export default function MriPanel({ studies, patients, cases, detailId, setDetail, onOpenCase, onClose }: { studies: Study[]; patients: Patient[]; cases: CaseRec[]; detailId?: string; setDetail: (id?: string) => void; onOpenCase: (id: string) => void; onClose: () => void }) {
  const [q, setQ] = useState(''), [file, setFile] = useState('')
  const pn = (id: string) => patients.find((p) => p.id === id)?.name ?? '—'
  const s = studies.find((x) => x.id === detailId), c = cases.find((x) => x.studyId === s?.id)
  const rows = studies.filter((x) => `${x.title} ${pn(x.patientId)}`.toLowerCase().includes(q.toLowerCase()))
  return <OverlayFrame title={s ? s.title : 'MRI Library'} onBack={s ? () => setDetail() : undefined} onClose={onClose}>
    {s ? <div className="pt-3">
      <div className="h-40 rounded-md bg-[#101512] grid place-items-center text-[#9aa59e] text-xs mb-4">Placeholder · no MRI image in this prototype</div>
      <dl className="grid grid-cols-[130px_1fr] gap-y-1.5 mb-4"><dt className="text-t2">Patient</dt><dd>{pn(s.patientId)}</dd><dt className="text-t2">Study date</dt><dd>{s.date}</dd><dt className="text-t2">Modality</dt><dd>{s.modality}</dd><dt className="text-t2">Slices</dt><dd>{s.slices}</dd><dt className="text-t2">Segmentation</dt><dd>Not analyzed</dd></dl>
      {c ? <Button variant="primary" onClick={() => onOpenCase(c.id)}>Open associated case</Button> : <p className="text-t2">Not attached to a case.</p>}
    </div> : <>
      <div className="flex gap-2.5 py-3"><input aria-label="Search studies" placeholder="Search studies" className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <label className="flex flex-col items-center gap-1 border border-dashed border-ac rounded-md p-5 mb-3 text-center cursor-pointer hover:bg-bg focus-within:outline focus-within:outline-2 focus-within:outline-ac"><Upload size={18} /><span className="font-medium">Choose an MRI file to upload</span>
        <span className="text-t2 text-xs">{file ? `Selected: ${file}. ` : ''}Prototype: nothing is uploaded or stored.</span><input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')} /></label>
      <DemoNote />
      {rows.length ? <DataTable<Study> rows={rows} onRow={(r) => setDetail(r.id)} cols={[{ h: 'Study', cell: (r) => r.title }, { h: 'Patient', cell: (r) => pn(r.patientId) }, { h: 'Date', cell: (r) => r.date, hideSm: true }, { h: 'Modality', cell: (r) => r.modality, hideSm: true }]} /> : <EmptyState title="No studies found" text="Try another search." />}
    </>}
  </OverlayFrame>
}
