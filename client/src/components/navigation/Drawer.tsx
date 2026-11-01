import { BookOpen, FolderOpen, ScanLine, Users, type LucideIcon } from 'lucide-react'
import type { Section } from '../../types'

const items: { id: Section; label: string; Icon: LucideIcon }[] = [
  { id: 'patients', label: 'Patients', Icon: Users }, { id: 'cases', label: 'Cases', Icon: FolderOpen },
  { id: 'mri', label: 'MRI Library', Icon: ScanLine }, { id: 'research', label: 'Research', Icon: BookOpen },
]
export function Drawer({ open, setOpen, active, onSelect }: { open: boolean; setOpen: (o: boolean) => void; active?: Section; onSelect: (s: Section) => void }) {
  return <nav aria-label="Primary" className={`fixed bottom-0 left-1/2 z-[60] w-[min(520px,100%)] -translate-x-1/2 bg-sf border border-b-0 border-bd rounded-t-xl transition-transform duration-200 ${open ? 'translate-y-0 shadow-[0_-6px_24px_rgba(0,0,0,.08)]' : 'translate-y-[calc(100%-22px)]'}`}>
    <button aria-label={open ? 'Collapse navigation' : 'Expand navigation'} aria-expanded={open} onClick={() => setOpen(!open)} className="block w-full h-[22px]"><span className="block w-11 h-1 mx-auto rounded bg-t2 opacity-60" /></button>
    <div className={`flex justify-around px-2 pb-3 ${open ? '' : 'invisible'}`}>
      {items.map(({ id, label, Icon }) => <button key={id} onClick={() => onSelect(id)} aria-current={active === id} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md hover:bg-bg ${active === id ? 'bg-s2 text-ac font-medium' : 'text-t2'}`}><Icon size={18} />{label}</button>)}
    </div></nav>
}
