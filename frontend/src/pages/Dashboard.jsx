import { useEffect, useState } from 'react'
import client from '../api/client'

export default function Dashboard() {
  const [data, setData] = useState({ totalProducts: 0, totalCategories: 0, lowStock: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/dashboard/summary').then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-gray-500">Total Products</div>
          <div className="text-3xl font-bold">{data.totalProducts}</div>
        </div>
        <div className="card">
          <div className="text-gray-500">Total Categories</div>
          <div className="text-3xl font-bold">{data.totalCategories}</div>
        </div>
        <div className="card">
          <div className="text-gray-500">Low Stock Alerts</div>
          <div className="text-3xl font-bold">{data.lowStock.length}</div>
        </div>
      </div>
      <div className="card">
        <div className="p-4 border-b border-neutral-800 text-lg font-semibold">Low Stock</div>
        <table className="table">
          <thead>
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Reorder</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.lowStock.map(i => (
              <tr key={i._id}>
                <td className="p-3">{i.name}</td>
                <td className="p-3">{i.sku}</td>
                <td className="p-3">{i.stockQuantity}</td>
                <td className="p-3">{i.reorderLevel}</td>
                <td className="p-3">
                  <button className="btn btn-primary mr-2" onClick={async () => {
                    const next = prompt('New reorder level', String(i.reorderLevel))
                    if (!next) return
                    await client.put(`/products/${i._id}`, { reorderLevel: parseInt(next, 10) })
                    const r = await client.get('/dashboard/summary')
                    setData(r.data)
                  }}>Edit</button>
                  <button className="btn btn-danger" onClick={async () => {
                    if (!confirm('Delete this product?')) return
                    await client.delete(`/products/${i._id}`)
                    const r = await client.get('/dashboard/summary')
                    setData(r.data)
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
