import { AdminSettingsForm } from '../../../components/AdminSettingsForm'
import { requireAdminPageAccess } from '../../../lib/admin-page-auth'

export default async function AdminSettingsPage() {
  await requireAdminPageAccess()
  return <AdminSettingsForm />
}
