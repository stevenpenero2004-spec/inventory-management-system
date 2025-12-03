import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200" onClick={()=>setShow(s=>!s)}>{show ? 'Hide' : 'Show'}</button>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button className="btn btn-primary w-full">Sign In</button>
      <div className="text-sm text-gray-400">No account? <a className="text-blue-400" href="/register">Register</a></div>
    </form>
  )
}
