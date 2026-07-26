import { AdminOrdersPanel } from '../../../components/AdminOrdersPanel'
import { requireAdminPageAccess } from '../../../lib/admin-page-auth'

export default async function AdminOrdersPage() {
  await requireAdminPageAccess()
  return <AdminOrdersPanel />
}
