import { AuditAction } from '@prisma/client'
import { prisma } from '../../database/prisma.js'
export async function audit(userId: string, action: AuditAction, entity: string, entityId: string, metadata?: object) {
  await prisma.auditLog.create({ data: { userId, action, entity, entityId, metadata } })
}
