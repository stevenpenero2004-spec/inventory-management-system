import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Suppliers from './pages/Suppliers'
import Categories from './pages/Categories'
import Stock from './pages/Stock'
import Reports from './pages/Reports'
import Activity from './pages/Activity'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './auth/PrivateRoute'
import { AuthProvider } from './auth/AuthContext'

function MainLayout() {
  return (
    <div className="h-full flex app-bg">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="layout-main space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-neutral-950 to-neutral-900">
      <div className="card w-full max-w-sm">
        <div className="mb-4 text-center">
          <div className="text-xl font-semibold text-gradient">Inventory</div>
          <div className="text-sm text-gray-400">Sign in to continue</div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/suppliers" element={<PrivateRoute><Suppliers /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
          <Route path="/stock" element={<PrivateRoute><Stock /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/activity" element={<PrivateRoute><Activity /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
