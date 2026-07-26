import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { AdminNav } from '../../components/AdminNav'
import { isAdminAuthenticated } from '../../lib/admin-auth'

export const metadata: Metadata = {
  title: 'Admin - Chanchal Fashion'
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const authenticated = await isAdminAuthenticated(cookieStore)

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-700">Chanchal • Admin</p>
              <h1 className="text-2xl font-semibold">Admin dashboard</h1>
            </div>
            <p className="text-sm text-stone-500">Manage products, orders, and shop settings.</p>
          </div>
        </header>
        {authenticated ? <AdminNav /> : null}
        <main>{children}</main>
      </div>
    </div>
  )
}
