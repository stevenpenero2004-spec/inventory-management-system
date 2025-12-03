import { useEffect, useMemo, useState } from 'react'
import client from '../api/client'

export default function Reports() {
  const [levels, setLevels] = useState([])
  const [movements, setMovements] = useState([])
  const [top, setTop] = useState([])
  const [byCat, setByCat] = useState([])
  const [range, setRange] = useState(30)

  useEffect(() => {
    client.get('/reports/stock-levels').then(r => setLevels(r.data))
  }, [])

  useEffect(() => {
    client.get('/reports/stock-movements', { params: { days: range } }).then(r => setMovements(r.data))
    client.get('/reports/top-products', { params: { days: range, top: 5 } }).then(r => setTop(r.data))
    client.get('/reports/demand-by-category', { params: { days: range } }).then(r => setByCat(r.data))
  }, [range])

  const totalOut = useMemo(() => movements.reduce((a, m) => a + (m.out || 0), 0), [movements])
  const totalIn = useMemo(() => movements.reduce((a, m) => a + (m.in || 0), 0), [movements])
  const velocity = useMemo(() => Math.round(100 * (totalOut / Math.max(1, totalOut + totalIn))), [totalOut, totalIn])
  const stockHealth = useMemo(() => {
    const total = levels.length || 1
    const ok = levels.reduce((acc, l) => acc + (l.stockQuantity > l.reorderLevel ? 1 : 0), 0)
    return Math.round(100 * (ok / total))
  }, [levels])
  const topCatQty = useMemo(() => (byCat[0]?.quantity || 0), [byCat])
  const maxCatQty = useMemo(() => Math.max(1, ...byCat.map(c => c.quantity)), [byCat])
  const catIntensity = useMemo(() => Math.round(100 * (topCatQty / maxCatQty)), [topCatQty, maxCatQty])
  const topCatName = useMemo(() => (byCat[0]?.category?.name || '—'), [byCat])

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Reports & Analytics</div>
            <div className="text-sm text-gray-400">Insights on movement and demand</div>
          </div>
          <select className="select w-32" value={range} onChange={e=>setRange(parseInt(e.target.value,10))}>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-sm text-gray-400">Total OUT</div>
            <div className="text-3xl font-bold">{totalOut}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-400">Total IN</div>
            <div className="text-3xl font-bold">{totalIn}</div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-400">Top Category</div>
            <div className="text-3xl font-bold">{topCatName}</div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Digital Report Analytics</div>
            <div className="text-sm text-gray-400">Speedometer gauges with bright neon UI</div>
          </div>
          <select className="select w-32" value={range} onChange={e=>setRange(parseInt(e.target.value,10))}>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card flex flex-col items-center gap-3">
            <div className="gauge" style={{ ['--gauge-angle']: `${velocity * 3.6}deg`, ['--needle-angle']: `${velocity * 3.6}deg`, ['--gauge-color']: '#22d3ee' }}>
              <div className="gauge-ring" />
              <div className="gauge-needle" />
              <div className="gauge-center">
                <div className="text-2xl font-bold">{velocity}%</div>
                <div className="gauge-label">Demand Velocity</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">OUT vs total movement</div>
          </div>
          <div className="card flex flex-col items-center gap-3">
            <div className="gauge" style={{ ['--gauge-angle']: `${stockHealth * 3.6}deg`, ['--needle-angle']: `${stockHealth * 3.6}deg`, ['--gauge-color']: '#10b981' }}>
              <div className="gauge-ring" />
              <div className="gauge-needle" />
              <div className="gauge-center">
                <div className="text-2xl font-bold">{stockHealth}%</div>
                <div className="gauge-label">Stock Health</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">OK items above reorder</div>
          </div>
          <div className="card flex flex-col items-center gap-3">
            <div className="gauge" style={{ ['--gauge-angle']: `${catIntensity * 3.6}deg`, ['--needle-angle']: `${catIntensity * 3.6}deg`, ['--gauge-color']: '#8b5cf6' }}>
              <div className="gauge-ring" />
              <div className="gauge-needle" />
              <div className="gauge-center">
                <div className="text-2xl font-bold">{catIntensity}%</div>
                <div className="gauge-label">Top Category</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">{topCatName}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="text-lg font-semibold">Top Moving Products</div>
        <table className="table mt-4">
          <thead>
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Qty OUT</th>
            </tr>
          </thead>
          <tbody>
            {top.map(t => (
              <tr key={t.product?._id}>
                <td className="p-3">{t.product?.name}</td>
                <td className="p-3">{t.product?.sku}</td>
                <td className="p-3">{t.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="text-lg font-semibold">Stock Levels</div>
        <table className="table mt-4">
          <thead>
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Reorder</th>
              <th className="p-3">Status</th>
              <th className="p-3">Progress</th>
            </tr>
          </thead>
          <tbody>
            {levels.map(l => (
              <tr key={l._id}>
                <td className="p-3">{l.name}</td>
                <td className="p-3">{l.sku}</td>
                <td className="p-3">{l.stockQuantity}</td>
                <td className="p-3">{l.reorderLevel}</td>
                <td className="p-3">
                  {l.stockQuantity <= l.reorderLevel ? (
                    <span className="badge badge-red">Low</span>
                  ) : (
                    <span className="badge badge-green">OK</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="h-2 bg-neutral-800 rounded">
                    <div className={`${l.stockQuantity <= l.reorderLevel ? 'bg-red-600' : 'bg-green-600'} h-2 rounded`} style={{ width: `${Math.min(100, (l.stockQuantity / Math.max(1, l.reorderLevel)) * 100)}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
