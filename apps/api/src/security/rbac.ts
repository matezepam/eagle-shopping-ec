import { Role } from '@prisma/client'
import type { GraphqlContext } from '../graphql/context.js'
import { fail } from '../shared/errors.js'
export function requireUser(context: GraphqlContext) { if (!context.user) throw fail('Authentication required', 'UNAUTHENTICATED', 401); return context.user }
export function requireModerator(context: GraphqlContext) { const user = requireUser(context); if (user.role !== Role.MODERATOR) throw fail('Insufficient permission', 'FORBIDDEN', 403); return user }
