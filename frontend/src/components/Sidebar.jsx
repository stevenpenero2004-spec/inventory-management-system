import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useState } from 'react'

export default function Sidebar() {
  const { isAuthenticated, logout } = useAuth()
  const [confirm, setConfirm] = useState(false)
const linkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-lg transition ${isActive ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-sm' : 'text-gray-200 hover:bg-neutral-800'}`
  return (
    <aside className="w-64 h-full border-r border-neutral-800 bg-neutral-950 text-gray-200">
      <div className="p-4 text-xl font-semibold">Inventory</div>
      <nav className="space-y-1 px-2">
        <NavLink to="/" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/products" className={linkClass}>Products</NavLink>
        <NavLink to="/suppliers" className={linkClass}>Suppliers</NavLink>
        <NavLink to="/categories" className={linkClass}>Categories</NavLink>
        <NavLink to="/stock" className={linkClass}>Stock</NavLink>
        <NavLink to="/reports" className={linkClass}>Reports</NavLink>
        <NavLink to="/activity" className={linkClass}>Activity</NavLink>
      </nav>
      <div className="px-4 py-3">
        {isAuthenticated ? (
          <button className="text-sm text-red-400" onClick={() => setConfirm(true)}>Logout</button>
        ) : (
          <NavLink to="/login" className="text-sm text-blue-400">Login</NavLink>
        )}
      </div>
      {confirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card w-full max-w-sm">
            <div className="text-lg font-semibold mb-2">Save info before logout?</div>
            <div className="text-sm text-gray-400 mb-4">Save your email to prefill next sign in.</div>
            <div className="flex gap-2">
              <button className="btn btn-primary flex-1" onClick={() => {
                const last = localStorage.getItem('lastLoginEmail') || ''
                if (last) localStorage.setItem('rememberEmail', last)
                logout()
              }}>Yes, save</button>
              <button className="btn btn-secondary flex-1" onClick={() => {
                localStorage.removeItem('rememberEmail')
                logout()
              }}>No</button>
            </div>
            <div className="mt-3 text-center">
              <button className="text-xs text-gray-400" onClick={() => setConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
