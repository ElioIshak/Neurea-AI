import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Field, inputCls } from '../components/ui'

export default function Auth({ mode, onSwitch, onEnter }: { mode: 'signin' | 'signup'; onSwitch: () => void; onEnter: () => void }) {
  const up = mode === 'signup'
  const [f, setF] = useState({ name: '', email: '', pw: '', pw2: '' }), [show, setShow] = useState(false), [err, setErr] = useState<Record<string, string>>({})
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })
  const submit = (e: FormEvent) => {
    e.preventDefault(); const x: Record<string, string> = {}
    if (up && !f.name.trim()) x.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Enter a valid email address.'
    if (f.pw.length < 8) x.pw = 'Use at least 8 characters.'
    if (up && f.pw2 !== f.pw) x.pw2 = 'Passwords do not match.'
    setErr(x); if (!Object.keys(x).length) onEnter()
  }
  return <main className="max-w-[380px] mx-auto mt-[9vh] px-5">
    <div className="flex items-center justify-center gap-2 font-semibold text-lg mb-6"><span className="w-6 h-6 rounded-md bg-ac text-white grid place-items-center text-xs">N</span>Neurea AI</div>
    <form noValidate onSubmit={submit} className="bg-sf border border-bd rounded-lg p-6">
      <h1 className="text-xl font-semibold mb-4">{up ? 'Create your account' : 'Sign in'}</h1>
      {up && <Field label="Full name" error={err.name}><input className={inputCls} value={f.name} onChange={set('name')} autoComplete="name" /></Field>}
      <Field label="Email" error={err.email}><input className={inputCls} type="email" value={f.email} onChange={set('email')} autoComplete="email" /></Field>
      <Field label="Password" error={err.pw}><span className="relative block"><input className={inputCls} type={show ? 'text' : 'password'} value={f.pw} onChange={set('pw')} autoComplete={up ? 'new-password' : 'current-password'} />
        <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)} className="absolute right-2 top-2.5 text-t2">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></Field>
      {up && <Field label="Confirm password" error={err.pw2}><input className={inputCls} type="password" value={f.pw2} onChange={set('pw2')} autoComplete="new-password" /></Field>}
      <Button variant="primary" className="w-full">{up ? 'Create account' : 'Sign in'}</Button>
      <p className="bg-s2 rounded-md px-3 py-2 text-xs text-t2 mt-3.5">Prototype screen. Nothing is verified and no account is created.</p>
      <p className="text-center mt-3.5">{up ? 'Already registered?' : 'New to Neurea AI?'} <button type="button" onClick={onSwitch} className="text-ac underline">{up ? 'Sign in' : 'Create an account'}</button></p>
    </form></main>
}
