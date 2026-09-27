import type { Product } from '@prisma/client'
import { prisma } from '../database/prisma.js'
import type { GraphqlContext } from './context.js'
import { cookieValue, expiredCookie, signSession } from '../security/session.js'
import { requireModerator } from '../security/rbac.js'
import * as auth from '../modules/auth/auth.service.js'
import * as products from '../modules/products/products.service.js'

type Filter = { categorySlug?: string; techniqueSlug?: string; minPrice?: number; maxPrice?: number; sizeId?: string; colorId?: string; inStock?: boolean; sort?: string }
type ProductParent = Product & { price: { toString(): string } }
const apiProduct = (product: ProductParent) => ({ ...product, price: Number(product.price.toString()) })

export const resolvers = {
  Query: {
    getProducts: async (_: unknown, { filter = {} }: { filter?: Filter }) => (await products.listProducts(filter)).map(apiProduct),
    getProductBySlug: async (_: unknown, { slug }: { slug: string }) => apiProduct(await products.productBySlug(slug)),
    getCategories: () => prisma.category.findMany({ orderBy: { name: 'asc' } }),
    getTechniques: () => prisma.technique.findMany({ orderBy: { name: 'asc' } }),
    getSizes: () => prisma.size.findMany({ orderBy: { sortOrder: 'asc' } }),
    getColors: () => prisma.color.findMany({ orderBy: { name: 'asc' } }),
    me: (_: unknown, _args: unknown, context: GraphqlContext) => context.user,
    productsAdmin: async (_: unknown, { filter = {} }: { filter?: Filter }, context: GraphqlContext) => { requireModerator(context); return (await products.listProducts(filter, true)).map(apiProduct) },
    inventory: (_: unknown, _args: unknown, context: GraphqlContext) => { requireModerator(context); return products.inventory() }
  },
  Mutation: {
    register: async (_: unknown, { input }: { input: unknown }, context: GraphqlContext) => {
      const user = await auth.register(input); context.res.append('Set-Cookie', cookieValue(signSession(user))); return user
    },
    login: async (_: unknown, { input }: { input: unknown }, context: GraphqlContext) => {
      const user = await auth.login(input); context.res.append('Set-Cookie', cookieValue(signSession(user))); return user
    },
    logout: (_: unknown, _args: unknown, context: GraphqlContext) => { context.res.append('Set-Cookie', expiredCookie()); return true },
    createProduct: async (_: unknown, { input, variants }: { input: unknown; variants: unknown[] }, context: GraphqlContext) => apiProduct(await products.createProduct(input, variants, requireModerator(context).id)),
    updateProduct: async (_: unknown, { id, input }: { id: string; input: unknown }, context: GraphqlContext) => apiProduct(await products.updateProduct(id, input, requireModerator(context).id)),
    publishProduct: async (_: unknown, { id }: { id: string }, context: GraphqlContext) => apiProduct(await products.setPublication(id, true, requireModerator(context).id)),
    unpublishProduct: async (_: unknown, { id }: { id: string }, context: GraphqlContext) => apiProduct(await products.setPublication(id, false, requireModerator(context).id)),
    updateStock: (_: unknown, { variantId, stock }: { variantId: string; stock: number }, context: GraphqlContext) => products.updateStock(variantId, stock, requireModerator(context).id),
    addProductImage: (_: unknown, { input }: { input: unknown }, context: GraphqlContext) => products.addImage(input, requireModerator(context).id),
    removeProductImage: (_: unknown, { id }: { id: string }, context: GraphqlContext) => products.removeImage(id, requireModerator(context).id),
    reorderProductImages: (_: unknown, { productId, imageIds }: { productId: string; imageIds: string[] }, context: GraphqlContext) => products.reorderImages(productId, imageIds, requireModerator(context).id),
    upsertColor: (_: unknown, { name, hex }: { name: string; hex: string }, context: GraphqlContext) => { requireModerator(context); return products.upsertColor(name, hex) },
    upsertSize: (_: unknown, { name, sortOrder }: { name: string; sortOrder: number }, context: GraphqlContext) => { requireModerator(context); return products.upsertSize(name, sortOrder) }
  }
}
