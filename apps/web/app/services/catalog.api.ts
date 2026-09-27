import type { Category, Color, Product, ProductFilter, Size, Technique } from '~/types/catalog'
import { graphql } from './graphql'
const productFields = `id name slug description story price discountPercentage published returnable createdAt updatedAt category { id name slug } technique { id name slug } images { id productId url alt position } variants { id sku stock active size { id name sortOrder } color { id name hex } }`
export const catalogApi = {
  products: (filter?: ProductFilter) => graphql<{ getProducts: Product[] }>(`query Products($filter: ProductFilter) { getProducts(filter: $filter) { ${productFields} } }`, { filter }),
  product: (slug: string) => graphql<{ getProductBySlug: Product }>(`query Product($slug: String!) { getProductBySlug(slug: $slug) { ${productFields} } }`, { slug }),
  metadata: () => graphql<{ getCategories: Category[]; getTechniques: Technique[]; getSizes: Size[]; getColors: Color[] }>(`query Metadata { getCategories { id name slug } getTechniques { id name slug } getSizes { id name sortOrder } getColors { id name hex } }`)
}
export { productFields }
