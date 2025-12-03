import { useEffect, useState } from 'react'
import client from '../api/client'

export default function Categories() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState(null)
  const [edit, setEdit] = useState({ name: '', description: '' })

  function load() { client.get('/categories').then(r => setItems(r.data)) }
  useEffect(() => { load() }, [])

  function submit(e) {
    e.preventDefault()
    client.post('/categories', form).then(() => { setForm({ name: '', description: '' }); load() })
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <form className="grid grid-cols-3 gap-3" onSubmit={submit}>
          <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button className="btn btn-primary col-span-1">Add</button>
        </form>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c._id}>
                {editingId === c._id ? (
                  <>
                    <td className="p-3"><input className="input" value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})} /></td>
                    <td className="p-3"><input className="input" value={edit.description} onChange={e=>setEdit({...edit,description:e.target.value})} /></td>
                    <td className="p-3">
                      <button className="btn btn-primary mr-2" onClick={async ()=>{ await client.put(`/categories/${c._id}`, edit); setEditingId(null); load() }}>Save</button>
                      <button className="btn btn-secondary" onClick={()=>setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.description}</td>
                    <td className="p-3">
                      <button className="btn btn-primary mr-2" onClick={()=>{ setEditingId(c._id); setEdit({ name:c.name, description:c.description }) }}>Edit</button>
                      <button className="btn btn-danger" onClick={async () => {
                        if (!confirm('Delete this category?')) return
                        await client.delete(`/categories/${c._id}`)
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
