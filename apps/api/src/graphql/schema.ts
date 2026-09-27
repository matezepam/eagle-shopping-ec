export const typeDefs = `#graphql
  enum Role { CLIENT MODERATOR }
  enum ProductSort { PRICE_ASC PRICE_DESC NEWEST }
  type User { id: ID! email: String! role: Role! createdAt: String! }
  type Category { id: ID! name: String! slug: String! }
  type Technique { id: ID! name: String! slug: String! }
  type Size { id: ID! name: String! sortOrder: Int! }
  type Color { id: ID! name: String! hex: String! }
  type ProductImage { id: ID! productId: ID! url: String! alt: String! position: Int! }
  type ProductVariant { id: ID! sku: String! stock: Int! active: Boolean! size: Size! color: Color! updatedAt: String! product: Product }
  type Product { id: ID! name: String! slug: String! description: String! story: String! price: Float! discountPercentage: Int! published: Boolean! returnable: Boolean! category: Category! technique: Technique! images: [ProductImage!]! variants: [ProductVariant!]! createdAt: String! updatedAt: String! }
  input CredentialsInput { email: String! password: String! }
  input ProductInput { name: String! slug: String! description: String! story: String! price: Float! discountPercentage: Int categoryId: ID! techniqueId: ID! returnable: Boolean }
  input ProductPatchInput { name: String slug: String description: String story: String price: Float discountPercentage: Int categoryId: ID techniqueId: ID returnable: Boolean }
  input VariantInput { sizeId: ID! colorId: ID! sku: String! stock: Int! active: Boolean }
  input ProductFilter { categorySlug: String techniqueSlug: String minPrice: Float maxPrice: Float sizeId: ID colorId: ID inStock: Boolean sort: ProductSort }
  input ImageInput { productId: ID! url: String! alt: String! position: Int! }
  type Query { getProducts(filter: ProductFilter): [Product!]! getProductBySlug(slug: String!): Product! getCategories: [Category!]! getTechniques: [Technique!]! getSizes: [Size!]! getColors: [Color!]! me: User productsAdmin(filter: ProductFilter): [Product!]! inventory: [ProductVariant!]! }
  type Mutation { register(input: CredentialsInput!): User! login(input: CredentialsInput!): User! logout: Boolean! createProduct(input: ProductInput!, variants: [VariantInput!]!): Product! updateProduct(id: ID!, input: ProductPatchInput!): Product! publishProduct(id: ID!): Product! unpublishProduct(id: ID!): Product! updateStock(variantId: ID!, stock: Int!): ProductVariant! addProductImage(input: ImageInput!): ProductImage! removeProductImage(id: ID!): Boolean! reorderProductImages(productId: ID!, imageIds: [ID!]!): Boolean! upsertColor(name: String!, hex: String!): Color! upsertSize(name: String!, sortOrder: Int!): Size! }
`
