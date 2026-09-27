import type { Product, ProductVariant } from '~/types/catalog'
import { graphql } from './graphql'
import { productFields } from './catalog.api'
export type ProductInput = { name: string; slug: string; description: string; story: string; price: number; discountPercentage: number; categoryId: string; techniqueId: string; returnable: boolean }
export type VariantInput = { sizeId: string; colorId: string; sku: string; stock: number; active: boolean }
export const moderatorApi = {
  products: () => graphql<{ productsAdmin: Product[] }>(`query ProductsAdmin { productsAdmin { ${productFields} } }`),
  inventory: () => graphql<{ inventory: ProductVariant[] }>('query Inventory { inventory { id sku stock active updatedAt product { id name slug } size { id name } color { id name hex } } }'),
  create: (input: ProductInput, variants: VariantInput[]) => graphql<{ createProduct: Product }>(`mutation Create($input: ProductInput!, $variants: [VariantInput!]!) { createProduct(input: $input, variants: $variants) { ${productFields} } }`, { input, variants }),
  update: (id: string, input: Partial<ProductInput>) => graphql<{ updateProduct: Product }>(`mutation Update($id: ID!, $input: ProductPatchInput!) { updateProduct(id: $id, input: $input) { ${productFields} } }`, { id, input }),
  publish: (id: string, published: boolean) => graphql<{ publishProduct?: Product; unpublishProduct?: Product }>(`mutation Publish($id: ID!) { ${published ? 'publishProduct' : 'unpublishProduct'}(id: $id) { id published } }`, { id }),
  stock: (variantId: string, stock: number) => graphql<{ updateStock: ProductVariant }>('mutation Stock($variantId: ID!, $stock: Int!) { updateStock(variantId: $variantId, stock: $stock) { id stock } }', { variantId, stock }),
  addImage: (productId: string, url: string, alt: string, position: number) => graphql<{ addProductImage: { id: string } }>('mutation Image($input: ImageInput!) { addProductImage(input: $input) { id } }', { input: { productId, url, alt, position } }),
  removeImage: (id: string) => graphql<{ removeProductImage: boolean }>('mutation RemoveImage($id: ID!) { removeProductImage(id: $id) }', { id }),
  reorderImages: (productId: string, imageIds: string[]) => graphql<{ reorderProductImages: boolean }>('mutation ReorderImages($productId: ID!, $imageIds: [ID!]!) { reorderProductImages(productId: $productId, imageIds: $imageIds) }', { productId, imageIds }),
  upsertColor: (name: string, hex: string) => graphql('mutation Color($name: String!, $hex: String!) { upsertColor(name: $name, hex: $hex) { id } }', { name, hex }),
  upsertSize: (name: string, sortOrder: number) => graphql('mutation Size($name: String!, $sortOrder: Int!) { upsertSize(name: $name, sortOrder: $sortOrder) { id } }', { name, sortOrder })
}
