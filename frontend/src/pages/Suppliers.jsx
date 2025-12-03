import { useEffect, useState } from 'react'
import client from '../api/client'

export default function Suppliers() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [editingId, setEditingId] = useState(null)
  const [edit, setEdit] = useState({ name: '', email: '', phone: '', address: '' })

  function load() { client.get('/suppliers').then(r => setItems(r.data)) }
  useEffect(() => { load() }, [])

  function submit(e) {
    e.preventDefault()
    client.post('/suppliers', form).then(() => { setForm({ name: '', email: '', phone: '', address: '' }); load() })
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <form className="grid grid-cols-4 gap-3" onSubmit={submit}>
          <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <button className="btn btn-primary col-span-1">Add</button>
        </form>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => (
              <tr key={s._id}>
                {editingId === s._id ? (
                  <>
                    <td className="p-3"><input className="input" value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})} /></td>
                    <td className="p-3"><input className="input" value={edit.email} onChange={e=>setEdit({...edit,email:e.target.value})} /></td>
                    <td className="p-3"><input className="input" value={edit.phone} onChange={e=>setEdit({...edit,phone:e.target.value})} /></td>
                    <td className="p-3"><input className="input" value={edit.address} onChange={e=>setEdit({...edit,address:e.target.value})} /></td>
                    <td className="p-3">
                      <button className="btn btn-primary mr-2" onClick={async ()=>{ await client.put(`/suppliers/${s._id}`, edit); setEditingId(null); load() }}>Save</button>
                      <button className="btn btn-secondary" onClick={()=>setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.phone}</td>
                    <td className="p-3">{s.address}</td>
                    <td className="p-3">
                      <button className="btn btn-primary mr-2" onClick={()=>{ setEditingId(s._id); setEdit({ name:s.name, email:s.email, phone:s.phone, address:s.address }) }}>Edit</button>
                      <button className="btn btn-danger" onClick={async () => {
                        if (!confirm('Delete this supplier?')) return
                        await client.delete(`/suppliers/${s._id}`)
                        load()
                      }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
