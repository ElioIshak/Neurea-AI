import { useState } from 'react'
import { Button, EmptyState, Field, inputCls } from '../../components/ui'
import type { NewCaseDraft, Patient, Sex, Study } from '../../types'

const empty: NewCaseDraft = { pMode: 'existing', pid: '', np: { name: '', dob: '', sex: '', note: '' }, name: '', symptoms: '', notes: '', mMode: 'existing', sid: '', file: '' }
const titles = ['Patient', 'Case details', 'MRI', 'Review']

export default function NewCase({ patients, studies, onCancel, onCreate }: { patients: Patient[]; studies: Study[]; onCancel: () => void; onCreate: (d: NewCaseDraft) => void }) {
  const [step, setStep] = useState(1), [d, setD] = useState<NewCaseDraft>(empty), [q, setQ] = useState(''), [err, setErr] = useState<Record<string, string>>({})
  const patch = (p: Partial<NewCaseDraft>) => setD((s) => ({ ...s, ...p }))
  const np = (p: Partial<NewCaseDraft['np']>) => setD((s) => ({ ...s, np: { ...s.np, ...p } }))
  const next = () => {
    const x: Record<string, string> = {}
    if (step === 1) { if (d.pMode === 'existing' && !d.pid) x.pid = 'Select a patient to continue.'; if (d.pMode === 'new' && !d.np.name.trim()) x.pname = 'Enter the patient’s full name.' }
    if (step === 2 && !d.name.trim()) x.name = 'Enter a case name.'
    setErr(x); if (Object.keys(x).length) return
    step === 4 ? onCreate(d) : setStep(step + 1)
  }
  const pat = d.pMode === 'existing' ? patients.find((p) => p.id === d.pid)?.name : d.np.name
  const list = studies.filter((s) => d.pMode === 'new' || !d.pid || s.patientId === d.pid)
  const Seg = ({ a, b, k, la, lb }: { a: string; b: string; k: 'pMode' | 'mMode'; la: string; lb: string }) => <div className="flex gap-2 mb-3"><Button active={d[k] === a} onClick={() => patch({ [k]: a } as Partial<NewCaseDraft>)}>{la}</Button><Button active={d[k] === b} onClick={() => patch({ [k]: b } as Partial<NewCaseDraft>)}>{lb}</Button></div>
  const opt = (sel: boolean) => `flex w-full text-left gap-2.5 p-2.5 border rounded-md mb-1.5 ${sel ? 'border-ac bg-bg' : 'border-bd bg-sf'}`
  return <main className="max-w-[620px] mx-auto px-5 pb-16">
    <h1 className="text-xl font-semibold mt-2">{titles[step - 1]}</h1>
    <div className="flex gap-1.5 my-4" aria-label={`Step ${step} of 4`}>{titles.map((t, i) => <span key={t} className={`flex-1 h-[3px] rounded ${i < step ? 'bg-ac' : 'bg-bd'}`} />)}</div>
    {step === 1 && <>
      <Seg a="existing" b="new" k="pMode" la="Select existing patient" lb="Create new patient" />
      {d.pMode === 'existing' ? <>
        <Field label="Search patients"><input className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} /></Field>
        {patients.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).map((p) => <button key={p.id} className={opt(d.pid === p.id)} onClick={() => patch({ pid: p.id })}><span><strong>{p.name}</strong><br /><span className="text-t2">DOB {p.dob || '—'} · {p.sex || 'Sex not specified'}</span></span></button>)}
        {err.pid && <p role="alert" className="text-xs text-er">{err.pid}</p>}
      </> : <>
        <Field label="Full name" error={err.pname}><input className={inputCls} value={d.np.name} onChange={(e) => np({ name: e.target.value })} /></Field>
        <Field label="Date of birth"><input className={inputCls} type="date" value={d.np.dob} onChange={(e) => np({ dob: e.target.value })} /></Field>
        <Field label="Sex"><select className={inputCls} value={d.np.sex} onChange={(e) => np({ sex: e.target.value as Sex })}><option value="">Not specified</option><option>Female</option><option>Male</option><option>Other</option></select></Field>
        <Field label="Patient note" optional><textarea className={`${inputCls} min-h-20`} value={d.np.note} onChange={(e) => np({ note: e.target.value })} /></Field></>}
    </>}
    {step === 2 && <>
      <Field label="Case name" error={err.name}><input className={inputCls} value={d.name} onChange={(e) => patch({ name: e.target.value })} /></Field>
      <Field label="Symptoms or clinical concerns" optional><textarea className={`${inputCls} min-h-20`} value={d.symptoms} onChange={(e) => patch({ symptoms: e.target.value })} /></Field>
      <Field label="Case notes" optional><textarea className={`${inputCls} min-h-20`} value={d.notes} onChange={(e) => patch({ notes: e.target.value })} /></Field></>}
    {step === 3 && <>
      <Seg a="existing" b="upload" k="mMode" la="Select from MRI Library" lb="Upload new MRI" />
      {d.mMode === 'existing' ? (list.length ? list.map((s) => <button key={s.id} className={opt(d.sid === s.id)} onClick={() => patch({ sid: s.id })}><span><strong>{s.title}</strong><br /><span className="text-t2">{s.date} · {s.modality}</span></span></button>) : <EmptyState title="No studies available" text="Upload an MRI or continue without one." />) :
        <><Field label="MRI file"><input className={inputCls} type="file" onChange={(e) => patch({ file: e.target.files?.[0]?.name ?? '' })} /></Field>
          <p className="bg-s2 rounded-md px-3 py-2 text-xs text-t2">{d.file ? `Selected: ${d.file}. ` : ''}Prototype: the file is not uploaded or stored anywhere.</p></>}</>}
    {step === 4 && <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2">
      <dt className="text-t2">Patient</dt><dd>{pat || '—'}</dd><dt className="text-t2">Case name</dt><dd>{d.name}</dd>
      <dt className="text-t2">Symptoms</dt><dd>{d.symptoms || <span className="text-t2">Not provided</span>}</dd><dt className="text-t2">Notes</dt><dd>{d.notes || <span className="text-t2">Not provided</span>}</dd>
      <dt className="text-t2">MRI</dt><dd>{d.mMode === 'existing' && d.sid ? studies.find((s) => s.id === d.sid)?.title : d.file ? `${d.file} (not uploaded)` : <span className="text-t2">None attached</span>}</dd></dl>}
    <div className="flex justify-between mt-5"><Button onClick={step === 1 ? onCancel : () => setStep(step - 1)}>{step === 1 ? 'Cancel' : 'Back'}</Button><Button variant="primary" onClick={next}>{step === 4 ? 'Create case and open workspace' : 'Continue'}</Button></div>
  </main>
}
