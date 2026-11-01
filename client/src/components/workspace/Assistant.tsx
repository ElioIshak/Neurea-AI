import { useState, type FormEvent } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button, inputCls } from '../ui'

interface Msg { role: 'user' | 'assistant'; text: string }
const seed: Msg[] = [{ role: 'user', text: 'Summarize the recorded symptoms for this case.' }, { role: 'assistant', text: 'Example reply. In the product, answers appear here grounded in this case’s record, with citations to real sources and a clear split between documented facts and AI interpretation.' }]

export function Assistant() {
  const [m, setM] = useState<Msg[]>(seed), [t, setT] = useState('')
  const send = (e: FormEvent) => { e.preventDefault(); if (!t.trim()) return; setM((x) => [...x, { role: 'user', text: t }, { role: 'assistant', text: 'Prototype: no assistant is connected, so no answer was generated.' }]); setT('') }
  return <section aria-label="Medical Assistant" className="border border-bd rounded-md bg-sf">
    <header className="flex items-center gap-2 px-3.5 py-2.5 border-b border-bd font-medium"><Sparkles size={16} />Medical Assistant<span className="text-t2 font-normal">· this case only · example conversation</span></header>
    <div className="flex flex-col gap-2.5 p-3.5 max-h-60 overflow-auto" aria-live="polite">{m.map((x, i) => <div key={i} className={`max-w-[85%] px-3 py-2 rounded-md ${x.role === 'user' ? 'self-end bg-s2' : 'bg-bg'}`}>{x.text}</div>)}</div>
    <form onSubmit={send} className="flex gap-2 p-2.5 border-t border-bd"><input className={inputCls} aria-label="Message the assistant" placeholder="Ask about this case" value={t} onChange={(e) => setT(e.target.value)} /><Button variant="primary" aria-label="Send"><Send size={16} /></Button></form>
    <p className="text-xs text-t2 px-3.5 pb-2.5">Not a diagnosis. Output requires clinician review.</p></section>
}
