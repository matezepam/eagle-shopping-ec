import { AuditAction, Prisma } from '@prisma/client'
import { prisma } from '../../database/prisma.js'
import { audit } from '../audit/audit.service.js'
import { fail, notFound } from '../../shared/errors.js'
import { imageInput, productInput, variantInput } from './products.validation.js'

const productInclude = { category: true, technique: true, images: { orderBy: { position: 'asc' as const } }, variants: { include: { size: true, color: true }, orderBy: { createdAt: 'asc' as const } } }
export type ProductRecord = Prisma.ProductGetPayload<{ include: typeof productInclude }>
export async function listProducts(filters: { categorySlug?: string; techniqueSlug?: string; minPrice?: number; maxPrice?: number; sizeId?: string; colorId?: string; inStock?: boolean; sort?: string }, includeDrafts = false) {
  const where: Prisma.ProductWhereInput = {
    ...(includeDrafts ? {} : { published: true }),
    ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    ...(filters.techniqueSlug ? { technique: { slug: filters.techniqueSlug } } : {}),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined ? { price: { ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}), ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}) } } : {}),
    ...(filters.sizeId || filters.colorId || filters.inStock ? { variants: { some: { active: true, ...(filters.sizeId ? { sizeId: filters.sizeId } : {}), ...(filters.colorId ? { colorId: filters.colorId } : {}), ...(filters.inStock ? { stock: { gt: 0 } } : {}) } } } : {})
  }
  const orderBy: Prisma.ProductOrderByWithRelationInput = filters.sort === 'PRICE_ASC' ? { price: 'asc' } : filters.sort === 'PRICE_DESC' ? { price: 'desc' } : { createdAt: 'desc' }
  return prisma.product.findMany({ where, orderBy, include: productInclude })
}
export async function productBySlug(slug: string, includeDrafts = false) {
  const product = await prisma.product.findFirst({ where: { slug, ...(includeDrafts ? {} : { published: true }) }, include: productInclude })
  if (!product) throw notFound('Product')
  return product
}
export async function createProduct(rawProduct: unknown, rawVariants: unknown[], userId: string) {
  const data = productInput.parse(rawProduct); const variants = rawVariants.map((item) => variantInput.parse(item))
  if (!variants.length) throw fail('A product must include at least one variant', 'VALIDATION_FAILED', 422)
  const unique = new Set(variants.map((variant) => `${variant.sizeId}:${variant.colorId}`)); if (unique.size !== variants.length) throw fail('Duplicate variants are not allowed', 'VALIDATION_FAILED', 422)
  try {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data: { ...data, price: new Prisma.Decimal(data.price), variants: { create: variants } }, include: productInclude })
      await tx.auditLog.create({ data: { userId, action: AuditAction.CREATE_PRODUCT, entity: 'Product', entityId: product.id, metadata: { slug: product.slug, variants: variants.length } } })
      return product
    })
  } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw fail('Slug or SKU already exists', 'CONFLICT', 409); throw error }
}
export async function updateProduct(id: string, raw: unknown, userId: string) {
  const data = productInput.partial().parse(raw)
  const exists = await prisma.product.findUnique({ where: { id } }); if (!exists) throw notFound('Product')
  const product = await prisma.product.update({ where: { id }, data: { ...data, ...(data.price !== undefined ? { price: new Prisma.Decimal(data.price) } : {}) }, include: productInclude })
  await audit(userId, AuditAction.UPDATE_PRODUCT, 'Product', id, Object.keys(data)); return product
}
export async function setPublication(id: string, published: boolean, userId: string) {
  const product = await prisma.product.update({ where: { id }, data: { published }, include: productInclude }).catch(() => { throw notFound('Product') })
  await audit(userId, published ? AuditAction.PUBLISH_PRODUCT : AuditAction.UNPUBLISH_PRODUCT, 'Product', id, { published }); return product
}
export async function updateStock(variantId: string, stock: number, userId: string) {
  if (!Number.isInteger(stock) || stock < 0 || stock > 100000) throw fail('Invalid stock', 'VALIDATION_FAILED', 422)
  const variant = await prisma.productVariant.update({ where: { id: variantId }, data: { stock }, include: { size: true, color: true } }).catch(() => { throw notFound('Variant') })
  await audit(userId, AuditAction.UPDATE_STOCK, 'ProductVariant', variantId, { stock }); return variant
}
export async function addImage(raw: unknown, userId: string) {
  const data = imageInput.parse(raw); const product = await prisma.product.findUnique({ where: { id: data.productId } }); if (!product) throw notFound('Product')
  const image = await prisma.productImage.create({ data }).catch((error: unknown) => { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw fail('Image position is already in use', 'CONFLICT', 409); throw error })
  await audit(userId, AuditAction.ADD_PRODUCT_IMAGE, 'ProductImage', image.id, { productId: data.productId }); return image
}
export async function removeImage(id: string, userId: string) { const image = await prisma.productImage.delete({ where: { id } }).catch(() => { throw notFound('Image') }); await audit(userId, AuditAction.REMOVE_PRODUCT_IMAGE, 'ProductImage', id, { productId: image.productId }); return true }
export async function reorderImages(productId: string, imageIds: string[], userId: string) {
  const images = await prisma.productImage.findMany({ where: { productId }, select: { id: true } })
  if (images.length !== imageIds.length || new Set(imageIds).size !== imageIds.length || images.some((image) => !imageIds.includes(image.id))) throw fail('Invalid image order', 'VALIDATION_FAILED', 422)
  await prisma.$transaction(async (tx) => {
    for (const [index, id] of imageIds.entries()) await tx.productImage.update({ where: { id }, data: { position: -index - 1 } })
    for (const [position, id] of imageIds.entries()) await tx.productImage.update({ where: { id }, data: { position } })
  })
  await audit(userId, AuditAction.REORDER_PRODUCT_IMAGES, 'Product', productId, { imageIds }); return true
}
export const getCatalogMeta = () => Promise.all([prisma.category.findMany({ orderBy: { name: 'asc' } }), prisma.technique.findMany({ orderBy: { name: 'asc' } }), prisma.size.findMany({ orderBy: { sortOrder: 'asc' } }), prisma.color.findMany({ orderBy: { name: 'asc' } })])
export const inventory = () => prisma.productVariant.findMany({ include: { product: true, size: true, color: true }, orderBy: { updatedAt: 'desc' } })
export async function upsertColor(name: string, hex: string) { return prisma.color.upsert({ where: { name }, update: { hex }, create: { name, hex } }) }
export async function upsertSize(name: string, sortOrder: number) { return prisma.size.upsert({ where: { name }, update: { sortOrder }, create: { name, sortOrder } }) }
