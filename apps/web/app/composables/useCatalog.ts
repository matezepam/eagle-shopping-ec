import type { Category, Color, Product, ProductFilter, Size, Technique } from '~/types/catalog'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { catalogApi } from '~/services/catalog.api'
export function useCatalog() {
  const loadProducts = (filter?: MaybeRefOrGetter<ProductFilter | undefined>) => useAsyncData<Product[]>('products', async () => (await catalogApi.products(filter ? toValue(filter) : undefined)).getProducts, { watch: filter ? [filter] : undefined })
  const loadProduct = (slug: string) => useAsyncData<Product>(`product:${slug}`, async () => (await catalogApi.product(slug)).getProductBySlug)
  const loadMetadata = () => useAsyncData<{ getCategories: Category[]; getTechniques: Technique[]; getSizes: Size[]; getColors: Color[] }>('catalog-metadata', catalogApi.metadata)
  return { loadProducts, loadProduct, loadMetadata }
}
