import { useEffect, useMemo, useState } from 'react'
import client from '../api/client'

function formatType(t) {
  const m = {
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'product.create': 'Product Created',
    'product.update': 'Product Updated',
    'product.delete': 'Product Deleted',
    'supplier.create': 'Supplier Created',
    'supplier.update': 'Supplier Updated',
    'supplier.delete': 'Supplier Deleted',
    'category.create': 'Category Created',
    'category.update': 'Category Updated',
    'category.delete': 'Category Deleted',
    'stock.in': 'Stock IN',
    'stock.out': 'Stock OUT',
    'stock.update': 'Stock Updated',
    'stock.delete': 'Stock Deleted',
  }
  return m[t] || t
}

export default function Activity() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [range, setRange] = useState(30)
  const [page, setPage] = useState(1)

  useEffect(() => {
    client.get('/activity', { params: { days: range, page, limit: 20 } }).then(r => { setItems(r.data.items); setTotal(r.data.total) })
  }, [range, page])

  const pages = useMemo(() => Math.ceil(total / 20), [total])

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Activity Log</div>
            <div className="text-sm text-gray-400">Digital timeline of recent actions</div>
          </div>
          <select className="select w-32" value={range} onChange={e=>{ setPage(1); setRange(parseInt(e.target.value,10)) }}>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="space-y-4">
          {items.map(a => (
            <div key={a._id} className="flex items-center gap-4">
              <div className="relative w-2">
                <div className="w-2 h-2 rounded-full shadow-md" style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee, #16a34a)', boxShadow: '0 0 12px rgba(34, 211, 238, .6)' }} />
                <div className="w-0.5 h-8 bg-neutral-800 ml-[3px]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-accent">{formatType(a.type)}</span>
                  {a.user && <span className="text-xs text-gray-400">{a.user}</span>}
                </div>
                <div className="text-sm mt-1">{a.message}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-gray-400">Total {total}</div>
          <div className="flex gap-2">
            <button className="btn btn-secondary" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
            <button className="btn btn-primary" disabled={page>=pages} onClick={()=>setPage(p=>Math.min(pages,p+1))}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
