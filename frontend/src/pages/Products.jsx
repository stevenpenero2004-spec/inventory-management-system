import { useEffect, useMemo, useState } from 'react'
import client from '../api/client'

export default function Products() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ name: '', sku: '', price: '', category: '', supplier: '' })
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [edit, setEdit] = useState({ name: '', sku: '', price: '', category: '', supplier: '' })

  const limit = 10
  const pages = useMemo(() => Math.ceil(total / limit), [total])

  function load() {
    client.get('/products', { params: { page, limit, q } }).then(r => {
      setItems(r.data.items)
      setTotal(r.data.total)
    })
  }

  useEffect(() => {
    client.get('/categories').then(r => setCategories(r.data))
    client.get('/suppliers').then(r => setSuppliers(r.data))
  }, [])

  useEffect(() => { load() }, [page, q])

  function submit(e) {
    e.preventDefault()
    const payload = { ...form, price: parseFloat(form.price) }
    client.post('/products', payload).then(() => {
      setForm({ name: '', sku: '', price: '', category: '', supplier: '' })
      load()
    })
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <form className="grid grid-cols-6 gap-3" onSubmit={submit}>
          <input className="input col-span-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="input col-span-1" placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
          <input className="input col-span-1" type="number" step="0.01" placeholder="Price (₱)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <select className="select col-span-1" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="">Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select className="select col-span-1" value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}>
            <option value="">Supplier</option>
            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <button className="btn btn-primary col-span-1">Add</button>
        </form>
      </div>

      <div className="flex items-center gap-3">
        <input className="border p-2 bg-neutral-900 border-neutral-800 text-gray-100" placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id}>
                {editingId === p._id ? (
                  <>
                    <td className="p-3"><input className="input" value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})} /></td>
                    <td className="p-3"><input className="input" value={edit.sku} onChange={e=>setEdit({...edit,sku:e.target.value})} /></td>
                    <td className="p-3"><input className="input" type="number" step="0.01" value={edit.price} onChange={e=>setEdit({...edit,price:e.target.value})} /></td>
                    <td className="p-3">
                      <select className="select" value={edit.category} onChange={e=>setEdit({...edit,category:e.target.value})}>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <select className="select" value={edit.supplier} onChange={e=>setEdit({...edit,supplier:e.target.value})}>
                        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <button className="btn btn-primary mr-2" onClick={async ()=>{
                        await client.put(`/products/${p._id}`, { ...edit, price: parseFloat(edit.price) })
                        setEditingId(null)
                        load()
                      }}>Save</button>
                      <button className="btn btn-secondary" onClick={()=>setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.sku}</td>
                    <td className="p-3">₱{p.price.toFixed(2)}</td>
                    <td className="p-3">{p.category?.name}</td>
                    <td className="p-3">{p.supplier?.name}</td>
                    <td className="p-3">
                      <button className="btn btn-primary mr-2" onClick={()=>{ setEditingId(p._id); setEdit({ name:p.name, sku:p.sku, price:String(p.price), category:p.category?._id||'', supplier:p.supplier?._id||'' }) }}>Edit</button>
                      <button className="btn btn-danger" onClick={async () => {
                        if (!confirm('Delete this product?')) return
                        await client.delete(`/products/${p._id}`)
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

      <div className="flex gap-2 text-gray-300">
        <button disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-2 border rounded">Prev</button>
        <span>Page {page} / {pages || 1}</span>
        <button disabled={page>=pages} onClick={() => setPage(p => p+1)} className="px-3 py-2 border rounded">Next</button>
      </div>
    </div>
  )
}
