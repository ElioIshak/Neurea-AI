import { useEffect, useState, type ReactNode } from 'react'
import { House, LogOut } from 'lucide-react'
import { user } from '../data/sample'
import { Button } from './ui'

export function TopBar({ center, onSignOut, onHome }: { center?: ReactNode; onSignOut: () => void; onHome?: () => void }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k)
  }, [open])
  return <header className="relative flex items-center justify-between gap-3 px-5 py-3">
    <div className="flex items-center gap-2 font-semibold"><span className="w-[22px] h-[22px] rounded-md bg-ac text-white grid place-items-center text-xs">N</span>Neurea AI
      {onHome && <Button className="ml-2" onClick={onHome}><House size={16} />Home</Button>}</div>
    <div className="text-t2 truncate max-sm:hidden">{center}</div>
    <div>
      <button aria-label="Account menu" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(!open)} className="w-9 h-9 rounded-full border border-bd bg-s2 font-semibold">{user.name[0]}</button>
      {open && <div className="absolute right-5 top-14 w-60 bg-sf border border-bd rounded-md p-3 shadow-lg z-30 anim-fade">
        <div className="font-medium">{user.name}</div><div className="text-t2 text-xs">{user.email}</div>
        <p className="text-xs text-t2 my-3">Sample profile. No session is managed in this prototype.</p>
        <Button className="w-full" onClick={onSignOut}><LogOut size={16} />Sign out</Button></div>}
    </div></header>
}
