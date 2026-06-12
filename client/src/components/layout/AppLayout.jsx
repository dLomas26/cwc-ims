import { Outlet, Navigate } from 'react-router'
import { useAuth } from '../../store/AuthContext'
import Sidebar from './Sidebar'
import { FullPageLoader } from '../ui/Loader'

const AppLayout = () => {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) return <FullPageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-6 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
