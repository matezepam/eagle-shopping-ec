import { config } from 'dotenv'
import { z } from 'zod'
config({ path: new URL('../../../../.env', import.meta.url) })
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().url(), WEB_ORIGIN: z.string().url(),
  SESSION_SECRET: z.string().min(32)
})
export const env = schema.parse(process.env)
