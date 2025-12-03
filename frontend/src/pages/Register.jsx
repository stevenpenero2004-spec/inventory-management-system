import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      await client.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed')
    }
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input className="input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <div className="relative">
        <input className="input pr-10" type={show ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200" onClick={()=>setShow(s=>!s)}>{show ? 'Hide' : 'Show'}</button>
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button className="btn btn-primary w-full">Create Account</button>
      <div className="text-sm text-gray-400">Already have an account? <a className="text-blue-400" href="/login">Sign in</a></div>
    </form>
  )
}
