import { config } from 'dotenv'
import argon2 from 'argon2'
import { PrismaClient, Role } from '@prisma/client'
config({ path: new URL('../../../.env', import.meta.url) })
const prisma = new PrismaClient()
async function main() {
  await Promise.all([
    prisma.category.upsert({ where: { slug: 't-shirts' }, update: { name: 'T-shirts' }, create: { name: 'T-shirts', slug: 't-shirts' } }),
    prisma.category.upsert({ where: { slug: 'caps' }, update: { name: 'Caps' }, create: { name: 'Caps', slug: 'caps' } }),
    prisma.technique.upsert({ where: { slug: 'embroidery' }, update: { name: 'Embroidery' }, create: { name: 'Embroidery', slug: 'embroidery' } }),
    prisma.technique.upsert({ where: { slug: 'print' }, update: { name: 'Print' }, create: { name: 'Print', slug: 'print' } }),
    ...['One size', 'S', 'M', 'L', 'XL'].map((name, sortOrder) => prisma.size.upsert({ where: { name }, update: { sortOrder }, create: { name, sortOrder } }))
  ])
  const email = process.env.SEED_MODERATOR_EMAIL
  const password = process.env.SEED_MODERATOR_PASSWORD
  if (email && password) await prisma.user.upsert({ where: { email }, update: { role: Role.MODERATOR }, create: { email, passwordHash: await argon2.hash(password, { type: argon2.argon2id }), role: Role.MODERATOR } })
}
main().finally(() => prisma.$disconnect())
