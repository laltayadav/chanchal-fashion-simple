import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from './admin-auth'

type RequestLike = {
  cookies?: {
    get(name: string): { value: string } | undefined
  }
}

export async function isRequestAdminAuthorized(request: RequestLike) {
  const cookieStore = request.cookies ?? { get: () => undefined }
  return isAdminAuthenticated(cookieStore)
}

export async function requireAdmin(request: RequestLike) {
  const authorized = await isRequestAdminAuthorized(request)
  if (!authorized) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  return null
}
