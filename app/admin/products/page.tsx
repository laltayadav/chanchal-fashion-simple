import { AdminProductsManager } from '../../../components/AdminProductsManager'
import { requireAdminPageAccess } from '../../../lib/admin-page-auth'

export default async function AdminProductsPage() {
  await requireAdminPageAccess()
  return <AdminProductsManager />
}
