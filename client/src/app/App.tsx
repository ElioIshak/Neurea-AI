import { useEffect, useRef, useState } from 'react'
import { FolderPlus, FolderSearch } from 'lucide-react'
import { Drawer } from '../components/navigation/Drawer'
import { TopBar } from '../components/TopBar'
import { Button, DemoNote, inputCls, Modal } from '../components/ui'
import { sampleCases, samplePapers, samplePatients, sampleStudies } from '../data/sample'
import CasesPanel, { CaseTable } from '../features/cases/CasesPanel'
import NewCase from '../features/cases/NewCase'
import MriPanel from '../features/mri-library/MriPanel'
import PatientsPanel from '../features/patients/PatientsPanel'
import ResearchPanel from '../features/research/ResearchPanel'
import Auth from '../pages/Auth'
import Home from '../pages/Home'
import Workspace from '../pages/Workspace'
import type { CaseRec, NewCaseDraft, Overlay, Patient, Section } from '../types'

type View = 'signin' | 'signup' | 'home' | 'newcase' | 'workspace'

export default function App() {
  const [view, setView] = useState<View>('signin'), [patients, setPatients] = useState(samplePatients), [cases, setCases] = useState(sampleCases)
  const [caseId, setCaseId] = useState(''), [ov, setOv] = useState<Overlay | null>(null), [drawer, setDrawer] = useState(false)
  const [dlg, setDlg] = useState<'choose' | 'existing' | null>(null), [q, setQ] = useState('')
  const bg = useRef<HTMLDivElement>(null)
  useEffect(() => { bg.current?.toggleAttribute('inert', !!(ov || dlg)) }, [ov, dlg])
  const c = cases.find((x) => x.id === caseId), authed = view !== 'signin' && view !== 'signup'
  const openCase = (id: string) => { setCaseId(id); setOv(null); setDlg(null); setView('workspace') }
  const newCase = () => { setOv(null); setDlg(null); setView('newcase') }
  const signOut = () => { setOv(null); setDrawer(false); setView('signin') }
  const create = (d: NewCaseDraft) => {
    let pid = d.pid
    if (d.pMode === 'new') { const p: Patient = { id: `p${Date.now()}`, ...d.np }; setPatients((x) => [...x, p]); pid = p.id }
    const t = new Date().toISOString().slice(0, 10), rec: CaseRec = { id: `c${Date.now()}`, name: d.name, patientId: pid, studyId: d.mMode === 'existing' && d.sid ? d.sid : null, created: t, modified: t, status: 'Open', symptoms: d.symptoms, notes: d.notes }
    setCases((x) => [...x, rec]); openCase(rec.id)
  }
  const open = (section: Section) => setOv((o) => ({ section, detail: o?.section === section ? o.detail : undefined }))
  const det = (kind: 'patient' | 'study' | 'paper') => (id?: string) => setOv((o) => o && { section: o.section, detail: id ? { kind, id } : undefined })
  const close = () => setOv(null)
  return <>
    <div ref={bg} className="h-full overflow-auto">
      {view === 'signin' && <Auth mode="signin" onSwitch={() => setView('signup')} onEnter={() => setView('home')} />}
      {view === 'signup' && <Auth mode="signup" onSwitch={() => setView('signin')} onEnter={() => setView('home')} />}
      {authed && <TopBar onSignOut={signOut} onHome={view !== 'home' ? () => { setOv(null); setView('home') } : undefined} center={view === 'workspace' && c ? `${patients.find((p) => p.id === c.patientId)?.name} · ${c.name}` : view === 'newcase' ? 'New case' : undefined} />}
      {view === 'home' && <Home onOpen={() => setDlg('choose')} />}
      {view === 'newcase' && <NewCase patients={patients} studies={sampleStudies} onCancel={() => setView('home')} onCreate={create} />}
      {view === 'workspace' && c && <Workspace key={c.id} c={c} patient={patients.find((p) => p.id === c.patientId)} study={sampleStudies.find((s) => s.id === c.studyId)} onPatient={() => setOv({ section: 'patients', detail: { kind: 'patient', id: c.patientId } })} onLibrary={() => open('mri')} />}
    </div>
    {authed && <Drawer open={drawer} setOpen={setDrawer} active={ov?.section} onSelect={open} />}
    {dlg === 'choose' && <Modal label="Open a case" onClose={() => setDlg(null)}><h2 className="text-base font-semibold">Open a case</h2>
      <div className="flex gap-3 mt-3.5 max-sm:flex-col">
        <button onClick={() => setDlg('existing')} className="flex-1 text-left p-3.5 border border-bd rounded-md hover:border-ac hover:bg-bg flex flex-col gap-1.5"><FolderSearch size={18} /><strong>Open existing case</strong><span className="text-t2">Search your cases</span></button>
        <button onClick={newCase} className="flex-1 text-left p-3.5 border border-bd rounded-md hover:border-ac hover:bg-bg flex flex-col gap-1.5"><FolderPlus size={18} /><strong>Create new case</strong><span className="text-t2">Guided, four steps</span></button></div></Modal>}
    {dlg === 'existing' && <Modal wide label="Open existing case" onClose={() => setDlg(null)}><h2 className="text-base font-semibold mb-3">Open existing case</h2>
      <input autoFocus aria-label="Search cases" placeholder="Search cases" className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} /><DemoNote />
      <CaseTable cases={cases} patients={patients} studies={sampleStudies} q={q} onOpen={openCase} /><div className="text-right mt-3"><Button onClick={() => setDlg('choose')}>Back</Button></div></Modal>}
    {ov?.section === 'patients' && <PatientsPanel patients={patients} cases={cases} studies={sampleStudies} detailId={ov.detail?.id} setDetail={det('patient')} onAdd={(p) => setPatients((x) => [...x, p])} onOpenCase={openCase} onOpenStudy={(id) => setOv({ section: 'mri', detail: { kind: 'study', id } })} onClose={close} />}
    {ov?.section === 'cases' && <CasesPanel cases={cases} patients={patients} studies={sampleStudies} onOpen={openCase} onNew={newCase} onClose={close} />}
    {ov?.section === 'mri' && <MriPanel studies={sampleStudies} patients={patients} cases={cases} detailId={ov.detail?.id} setDetail={det('study')} onOpenCase={openCase} onClose={close} />}
    {ov?.section === 'research' && <ResearchPanel papers={samplePapers} detailId={ov.detail?.id} setDetail={det('paper')} onClose={close} />}
  </>
}
