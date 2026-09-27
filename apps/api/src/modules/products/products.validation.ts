import { z } from 'zod'
const money = z.coerce.number().finite().min(0).max(99999999)
export const productInput = z.object({
  name: z.string().trim().min(2).max(140), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  description: z.string().trim().min(10).max(2000), story: z.string().trim().min(10).max(5000), price: money,
  discountPercentage: z.coerce.number().int().min(0).max(100).default(0), categoryId: z.string().cuid(), techniqueId: z.string().cuid(), returnable: z.boolean().default(true)
})
export const variantInput = z.object({ sizeId: z.string().cuid(), colorId: z.string().cuid(), sku: z.string().trim().min(2).max(80), stock: z.coerce.number().int().min(0).max(100000), active: z.boolean().default(true) })
export const imageInput = z.object({ productId: z.string().cuid(), url: z.string().url().max(2048), alt: z.string().trim().min(2).max(180), position: z.coerce.number().int().min(0).max(100) })
