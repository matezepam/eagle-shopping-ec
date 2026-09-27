import { z } from 'zod'
export const credentialsInput = z.object({ email: z.string().trim().email().max(254).transform((v) => v.toLowerCase()), password: z.string().min(12).max(128) })
