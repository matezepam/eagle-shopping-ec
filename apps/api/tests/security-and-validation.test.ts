import { describe, expect, it } from 'vitest'
import { Role } from '@prisma/client'
import { requireModerator } from '../src/security/rbac.js'
import { credentialsInput } from '../src/modules/auth/auth.validation.js'
import { productInput, variantInput } from '../src/modules/products/products.validation.js'

describe('role based access control', () => {
  it('rejects a CLIENT trying to use moderator functionality', () => {
    expect(() => requireModerator({ user: { id: 'user', email: 'client@example.com', role: Role.CLIENT }, req: {} as never, res: {} as never })).toThrow('Insufficient permission')
  })
  it('allows a MODERATOR', () => {
    const user = { id: 'user', email: 'moderator@example.com', role: Role.MODERATOR }
    expect(requireModerator({ user, req: {} as never, res: {} as never })).toEqual(user)
  })
})

describe('product input validation', () => {
  const validProduct = { name: 'Classic T-shirt', slug: 'classic-t-shirt', description: 'A properly described everyday T-shirt.', story: 'A longer story which explains why this piece was designed.', price: 24.5, discountPercentage: 10, categoryId: 'clw6d8z4p000008l4c2s5k8wu', techniqueId: 'clw6d8z4p000108l45no1ihlu', returnable: true }
  it('rejects negative price and invalid discount', () => {
    expect(() => productInput.parse({ ...validProduct, price: -1 })).toThrow()
    expect(() => productInput.parse({ ...validProduct, discountPercentage: 101 })).toThrow()
  })
  it('rejects negative variant stock', () => {
    expect(() => variantInput.parse({ sizeId: 'clw6d8z4p000208l4ppwp02rc', colorId: 'clw6d8z4p000308l4a3d153qg', sku: 'TEE-BLK-S', stock: -1 })).toThrow()
  })
})

describe('credential policy', () => {
  it('rejects malformed credentials before authentication', () => {
    expect(() => credentialsInput.parse({ email: 'not-an-email', password: 'short' })).toThrow()
  })
})
