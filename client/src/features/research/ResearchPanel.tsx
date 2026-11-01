import { useState } from 'react'
import { Button, DemoNote, EmptyState, inputCls, OverlayFrame } from '../../components/ui'
import type { Paper } from '../../types'

export default function ResearchPanel({ papers, detailId, setDetail, onClose }: { papers: Paper[]; detailId?: string; setDetail: (id?: string) => void; onClose: () => void }) {
  const [q, setQ] = useState(''), p = papers.find((x) => x.id === detailId)
  const rows = papers.filter((x) => x.title.toLowerCase().includes(q.toLowerCase()))
  return <OverlayFrame title={p ? 'Paper' : 'Research'} onBack={p ? () => setDetail() : undefined} onClose={onClose}>
    {p ? <article className="pt-3 max-w-[70ch]"><h3 className="text-lg font-semibold mb-1">{p.title}</h3><p className="text-t2 mb-3">{p.authors} · {p.venue} · {p.date}</p><p className="mb-4">{p.abstract}</p>
      <DemoNote>Demonstration record. It is not a real publication and has no source link.</DemoNote>
      <div className="flex gap-2"><Button disabled>View source</Button><Button disabled>Download</Button></div></article> : <>
      <div className="py-3"><input aria-label="Search papers" placeholder="Search papers" className={inputCls} value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <DemoNote>Sample entries only. Literature search is not connected.</DemoNote>
      {rows.length ? rows.map((r) => <button key={r.id} onClick={() => setDetail(r.id)} className="block w-full text-left py-3 px-2 border-b border-bd hover:bg-bg"><div className="font-medium">{r.title}</div><div className="text-t2 text-xs">{r.authors} · {r.venue} · {r.date}</div></button>) : <EmptyState title="No papers found" text="Try different keywords." />}</>}
  </OverlayFrame>
}
