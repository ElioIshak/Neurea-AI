import { useState } from 'react'
import { Button } from '../components/ui'
import { Assistant } from '../components/workspace/Assistant'
import { Sidebar } from '../components/workspace/Sidebar'
import { ExpandedShell, initialView, Viewer } from '../components/workspace/Viewer'
import type { CaseRec, Patient, Study } from '../types'

export default function Workspace({ c, patient, study, onPatient, onLibrary }: { c: CaseRec; patient?: Patient; study?: Study; onPatient: () => void; onLibrary: () => void }) {
  const [v, setV] = useState(initialView), [exp, setExp] = useState(false)
  return <div className="lg:grid lg:grid-cols-[minmax(260px,300px)_1fr] lg:h-[calc(100%-58px)]">
    <Sidebar c={c} p={patient} onPatient={onPatient} />
    <main className="px-5 pb-20 flex flex-col gap-4 overflow-auto">
      {study ? <Viewer v={v} setV={setV} total={study.slices} onToggle={() => setExp(true)} /> :
        <div className="h-72 rounded-md bg-[#101512] grid place-content-center text-center text-[#dfe7e2] gap-2"><div className="font-medium">No MRI attached</div><Button onClick={onLibrary}>Open MRI Library</Button></div>}
      {study && <div className="flex items-center gap-3 border border-bd bg-sf rounded-md px-3 py-2.5"><div className="flex-1"><div className="font-medium">Not yet analyzed</div><div className="text-t2">Segmentation is not available in this prototype.</div></div><Button disabled>Run segmentation</Button></div>}
      <Assistant />
      <p className="text-xs text-t2">Prototype with sample data and placeholder visuals. Nothing here is a real clinical result.</p>
    </main>
    {exp && study && <ExpandedShell onClose={() => setExp(false)}><Viewer expanded v={v} setV={setV} total={study.slices} onToggle={() => setExp(false)} /></ExpandedShell>}
  </div>
}
