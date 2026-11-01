import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Button({ variant = 'default', active, className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'primary'; active?: boolean }) {
  return <button {...p} className={`inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-md border text-sm transition-colors active:translate-y-px disabled:opacity-45 disabled:cursor-not-allowed ${variant === 'primary' ? 'bg-ac text-white border-ac hover:brightness-110' : 'bg-sf border-bd hover:bg-s2'} ${active ? '!bg-s2 !border-ac' : ''} ${className}`} />
}
export const inputCls = 'w-full px-2.5 py-2 border border-bd rounded-md bg-sf'
export function Field({ label, optional, error, children }: { label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return <label className="flex flex-col gap-1 mb-3.5"><span className="font-medium">{label}{optional && <span className="text-t2 font-normal"> (optional)</span>}</span>{children}{error && <span role="alert" className="text-xs text-er">{error}</span>}</label>
}
export const EmptyState = ({ title, text }: { title: string; text: string }) => <div className="text-center py-10 px-5 text-t2"><div className="text-tx font-medium mb-1">{title}</div>{text}</div>
export const DemoNote = ({ children = 'Demonstration data for this prototype. Not real records.' }: { children?: ReactNode }) => <p className="bg-s2 rounded-md px-3 py-2 text-xs text-t2 my-3">{children}</p>
export const Badge = ({ children }: { children: ReactNode }) => <span className="inline-block px-2 py-0.5 rounded border border-bd bg-bg text-xs">{children}</span>

const stack: object[] = []
export function useModal(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null), cb = useRef(onClose); cb.current = onClose
  useEffect(() => {
    const token = {}; stack.push(token); const prev = document.activeElement as HTMLElement | null; ref.current?.focus()
    const k = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== token) return
      if (e.key === 'Escape') cb.current()
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('button:not([disabled]),input,select,textarea,a[href]'); if (!f.length) return
        const a = f[0], z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    document.addEventListener('keydown', k)
    return () => { document.removeEventListener('keydown', k); stack.splice(stack.indexOf(token), 1); prev?.focus() }
  }, [])
  return ref
}
export function Modal({ label, onClose, children, wide }: { label: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useModal(onClose)
  return <div className="fixed inset-0 z-[55] grid place-items-center bg-[rgba(20,28,23,.28)] anim-fade" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label} className={`bg-sf border border-bd rounded-lg p-5 max-h-[86vh] overflow-auto anim-pop ${wide ? 'w-[min(620px,94vw)]' : 'w-[min(440px,92vw)]'}`}>{children}</div></div>
}
export function DataTable<T extends { id: string }>({ cols, rows, onRow }: { cols: { h: string; cell: (r: T) => ReactNode; hideSm?: boolean }[]; rows: T[]; onRow: (r: T) => void }) {
  return <table className="w-full"><thead><tr>{cols.map((c) => <th key={c.h} className={`text-left font-medium text-t2 text-xs px-2 py-1.5 border-b border-bd ${c.hideSm ? 'max-md:hidden' : ''}`}>{c.h}</th>)}</tr></thead>
    <tbody>{rows.map((r) => <tr key={r.id} className="border-b border-bd hover:bg-bg cursor-pointer" onClick={() => onRow(r)}>{cols.map((c, i) => <td key={c.h} className={c.hideSm ? 'max-md:hidden' : ''}>{i === 0 ? <button className="block w-full text-left py-2.5 px-2">{c.cell(r)}</button> : <div className="py-2.5 px-2">{c.cell(r)}</div>}</td>)}</tr>)}</tbody></table>
}
export function OverlayFrame({ title, onBack, onClose, children }: { title: string; onBack?: () => void; onClose: () => void; children: ReactNode }) {
  const ref = useModal(onClose)
  return <>
    <div className="fixed inset-0 z-50 bg-[rgba(226,232,227,.4)] backdrop-blur-lg anim-fade" onClick={onClose} aria-hidden />
    <section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="fixed z-[51] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(940px,94vw)] h-[min(660px,82vh)] max-md:w-screen max-md:h-[92vh] max-md:top-auto max-md:bottom-0 max-md:translate-y-0 max-md:rounded-b-none bg-sf border border-bd rounded-lg shadow-xl flex flex-col anim-pop">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-bd">
        {onBack && <Button className="!w-9 !px-0" aria-label="Back" onClick={onBack}>←</Button>}
        <h2 className="flex-1 text-base font-semibold">{title}</h2>
        <Button className="!w-9 !px-0" aria-label="Close" onClick={onClose}><X size={16} /></Button></div>
      <div className="flex-1 overflow-auto px-4 pb-4">{children}</div></section></>
}
