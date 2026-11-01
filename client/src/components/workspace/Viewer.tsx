import { useRef, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { Button, useModal } from '../ui'

export interface ViewState { slice: number; zoom: number; x: number; y: number; mode: 'orig' | 'seg' | 'ovl' }
export const initialView: ViewState = { slice: 1, zoom: 1, x: 0, y: 0, mode: 'orig' }
const modes: [ViewState['mode'], string][] = [['orig', 'Original'], ['seg', 'Segmentation'], ['ovl', 'Overlay']]

export function Viewer({ v, setV, total, expanded, onToggle }: { v: ViewState; setV: Dispatch<SetStateAction<ViewState>>; total: number; expanded?: boolean; onToggle: () => void }) {
  const drag = useRef<{ x: number; y: number } | null>(null)
  const zoom = (f: number) => setV((s) => ({ ...s, zoom: Math.min(8, Math.max(0.4, s.zoom * f)) }))
  const pid = expanded ? 'gx' : 'gi'
  return <div className={expanded ? 'flex flex-col h-full gap-2' : ''}>
    <div className={`relative overflow-hidden rounded-md bg-[#101512] touch-none cursor-grab active:cursor-grabbing ${expanded ? 'flex-1' : 'h-[min(48vh,440px)]'}`}
      onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId) }}
      onPointerMove={(e) => { const d = drag.current; if (!d) return; drag.current = { x: e.clientX, y: e.clientY }; setV((s) => ({ ...s, x: s.x + e.clientX - d.x, y: s.y + e.clientY - d.y })) }}
      onPointerUp={() => (drag.current = null)}>
      <div className="absolute inset-0 grid place-items-center" style={{ transform: `translate(${v.x}px,${v.y}px) scale(${v.zoom})` }}>
        <svg width="480" height="360" viewBox="0 0 480 360" className="max-w-full opacity-70" aria-hidden>
          <defs><pattern id={pid} width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#2c3630" /></pattern></defs>
          <rect width="480" height="360" fill={`url(#${pid})`} stroke="#8DB49E" />
          {v.mode !== 'orig' && <rect x="170" y="120" width="140" height="120" fill={v.mode === 'ovl' ? 'rgba(141,180,158,.25)' : 'none'} stroke="#8DB49E" strokeDasharray="6 4" />}</svg></div>
      <div className="absolute left-2.5 top-2 text-xs text-[#dfe7e2] bg-black/45 px-2 py-0.5 rounded">Placeholder · no MRI image{v.mode !== 'orig' ? ' · layer is a visual stand-in, not a result' : ''}</div>
      <div className="absolute left-2.5 bottom-2 text-xs text-[#dfe7e2] bg-black/45 px-2 py-0.5 rounded">Slice {v.slice} / {total} · {Math.round(v.zoom * 100)}%</div></div>
    <div className="flex flex-wrap items-center gap-1.5 py-2">
      {modes.map(([m, l]) => <Button key={m} active={v.mode === m} onClick={() => setV((s) => ({ ...s, mode: m }))}>{l}</Button>)}<span className="flex-1" />
      <Button className="!w-9 !px-0" aria-label="Zoom out" title="Zoom out" onClick={() => zoom(1 / 1.25)}><ZoomOut size={16} /></Button>
      <Button className="!w-9 !px-0" aria-label="Zoom in" title="Zoom in" onClick={() => zoom(1.25)}><ZoomIn size={16} /></Button>
      <Button className="!w-9 !px-0" aria-label="Reset view" title="Reset view" onClick={() => setV((s) => ({ ...s, zoom: 1, x: 0, y: 0 }))}><RotateCcw size={16} /></Button>
      <label className="flex items-center gap-1.5"><span className="text-t2">Slice</span><input type="range" min={1} max={total} value={v.slice} onChange={(e) => setV((s) => ({ ...s, slice: +e.target.value }))} className="w-28 accent-ac" /></label>
      <Button className="!w-9 !px-0" aria-label={expanded ? 'Close expanded viewer' : 'Expand viewer'} title={expanded ? 'Close' : 'Expand'} onClick={onToggle}>{expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</Button></div>
  </div>
}
export function ExpandedShell({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const ref = useModal(onClose)
  return <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Expanded MRI viewer" className="fixed inset-0 z-[45] bg-bg p-3 anim-fade">{children}</div>
}
