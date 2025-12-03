import { useEffect, useMemo, useState } from 'react'
import client from '../api/client'

export default function Stock() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ product: '', type: 'IN', quantity: 1, remarks: '' })
  const [history, setHistory] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState(null)
  const [edit, setEdit] = useState({ type: 'IN', quantity: 1, remarks: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const limit = 10
  const pages = useMemo(() => Math.ceil(total / limit), [total])

  function loadHistory() {
    client.get('/stocks/history', { params: { page, limit } }).then(r => { setHistory(r.data.items); setTotal(r.data.total) })
  }

  useEffect(() => {
    client.get('/products', { params: { limit: 100 } }).then(r => setProducts(r.data.items))
  }, [])

  useEffect(() => { loadHistory() }, [page])

  function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.product) { setError('Please select a product'); return }
    const qty = parseInt(form.quantity, 10)
    if (!qty || qty < 1) { setError('Quantity must be at least 1'); return }
    const payload = { ...form, quantity: qty }
    setSubmitting(true)
    client.post('/stocks', payload)
      .then(() => {
        setForm({ product: '', type: 'IN', quantity: 1, remarks: '' })
        setSuccess('Stock entry saved')
        loadHistory()
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to save stock entry')
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <form className="grid grid-cols-4 gap-3" onSubmit={submit}>
          <select className="select" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}>
            <option value="">Product</option>
            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <select className="select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </select>
          <input className="input" type="number" min={1} placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
          <input className="input" placeholder="Remarks" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} />
          <button className="btn btn-primary col-span-1" disabled={submitting}>{submitting ? 'Saving...' : 'Submit'}</button>
        </form>
        {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
        {success && <div className="mt-3 text-sm text-emerald-400">{success}</div>}
      </div>
      <div className="card">
        <div className="p-4 border-b border-neutral-800 text-lg font-semibold">History</div>
        <table className="table">
          <thead>
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Type</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Date</th>
              <th className="p-3">Remarks</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h._id}>
                {editingId === h._id ? (
                  <>
                    <td className="p-3">{h.product?.name}</td>
                    <td className="p-3">
                      <select className="select" value={edit.type} onChange={e=>setEdit({...edit,type:e.target.value})}>
                        <option value="IN">IN</option>
                        <option value="OUT">OUT</option>
                      </select>
                    </td>
                    <td className="p-3"><input className="input" type="number" min={1} value={edit.quantity} onChange={e=>setEdit({...edit,quantity:e.target.value})} /></td>
                    <td className="p-3">{new Date(h.date).toLocaleString()}</td>
                    <td className="p-3"><input className="input" value={edit.remarks} onChange={e=>setEdit({...edit,remarks:e.target.value})} /></td>
                    <td className="p-3">
                      <button className="btn btn-primary mr-2" onClick={async ()=>{ try { await client.put(`/stocks/${h._id}`, { ...edit, quantity: parseInt(edit.quantity,10) }); setEditingId(null); loadHistory(); } catch (err) { alert(err.response?.data?.message || 'Failed to update entry') } }}>Save</button>
                      <button className="btn btn-secondary" onClick={()=>setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{h.product?.name}</td>
                    <td className="p-3">{h.type}</td>
                    <td className="p-3">{h.quantity}</td>
                    <td className="p-3">{new Date(h.date).toLocaleString()}</td>
                    <td className="p-3">{h.remarks}</td>
                    <td className="p-3">
                      <button className="btn btn-primary mr-2" onClick={()=>{ setEditingId(h._id); setEdit({ type:h.type, quantity:h.quantity, remarks:h.remarks }) }}>Edit</button>
                      <button className="btn btn-danger" onClick={async () => {
                        if (!confirm('Delete this stock entry? This will adjust product quantity.')) return
                        await client.delete(`/stocks/${h._id}`)
                        loadHistory()
                      }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-2 p-3">
          <button disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-2 border rounded">Prev</button>
          <span>Page {page} / {pages || 1}</span>
          <button disabled={page>=pages} onClick={() => setPage(p => p+1)} className="px-3 py-2 border rounded">Next</button>
        </div>
      </div>
    </div>
  )
}
