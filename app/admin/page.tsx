import { cookies } from 'next/headers'
import AdminDashboard from '../../components/AdminDashboard'
import AdminLoginForm from '../../components/AdminLoginForm'
import { isAdminAuthenticated } from '../../lib/admin-auth'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authenticated = await isAdminAuthenticated(cookieStore)

  return authenticated ? <AdminDashboard /> : <AdminLoginForm />
}
