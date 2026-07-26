import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from './admin-auth'

export async function requireAdminPageAccess() {
  const cookieStore = await cookies()
  const authenticated = await isAdminAuthenticated(cookieStore)
  if (!authenticated) {
    redirect('/admin')
  }
}
