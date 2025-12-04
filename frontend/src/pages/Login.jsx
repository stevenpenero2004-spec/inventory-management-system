import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: localStorage.getItem('rememberEmail') || '', password: '' })
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const r = await client.post('/auth/login', form)
      await login(r.data.token)
      localStorage.setItem('lastLoginEmail', form.email)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <input className="input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <div className="relative">
        <input className="input pr-10" type={show ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button
          type="button"
          aria-label={show ? 'Hide password' : 'Show password'}
          title={show ? 'Hide password' : 'Show password'}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 p-2 rounded-full hover:bg-neutral-800 border border-neutral-700"
          onClick={()=>setShow(s=>!s)}
        >
          {show ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.48-1.09 1.12-2.09 1.9-2.97M9.88 9.88A3 3 0 0 1 14.12 14.12" />
              <path d="M6.1 6.1 17.9 17.9" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button className="btn btn-primary w-full">Sign In</button>
      <div className="text-sm text-gray-400">No account? <Link className="text-blue-400" to="/register">Register</Link></div>
    </form>
  )
}
