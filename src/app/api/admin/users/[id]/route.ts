import prisma from '@/lib/db'
import { requirePermission } from '@/lib/auth'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requirePermission('users', 'view')
  if (denied) return denied

  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: {
        include: {
          rolePermissions: { include: { permission: true } },
        },
      },
    },
  })

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  return Response.json(user)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requirePermission('users', 'edit')
  if (denied) return denied

  const { id } = await params
  const body = await request.json()

  const data: Record<string, unknown> = {}
  if (body.roleId !== undefined) data.roleId = body.roleId
  if (body.name !== undefined) data.name = body.name
  if (body.isActive !== undefined) data.isActive = body.isActive

  const user = await prisma.user.update({
    where: { id },
    data,
    include: { role: { select: { id: true, name: true } } },
  })

  return Response.json(user)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requirePermission('users', 'delete')
  if (denied) return denied

  const { id } = await params

  // Soft delete
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: false },
    include: { role: { select: { id: true, name: true } } },
  })

  return Response.json(user)
}
