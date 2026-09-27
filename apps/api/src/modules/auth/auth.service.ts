import argon2 from 'argon2'
import { Role } from '@prisma/client'
import { prisma } from '../../database/prisma.js'
import { fail } from '../../shared/errors.js'
import { credentialsInput } from './auth.validation.js'
export async function register(input: unknown) {
  const data = credentialsInput.parse(input)
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw fail('Unable to create account', 'CONFLICT', 409)
  return prisma.user.create({ data: { email: data.email, passwordHash: await argon2.hash(data.password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 }), role: Role.CLIENT } })
}
export async function login(input: unknown) {
  const data = credentialsInput.parse(input)
  const user = await prisma.user.findUnique({ where: { email: data.email } })
  if (!user || !(await argon2.verify(user.passwordHash, data.password))) throw fail('Invalid credentials', 'UNAUTHENTICATED', 401)
  return user
}
