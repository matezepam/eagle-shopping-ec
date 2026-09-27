import 'dotenv/config'
import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { pinoHttp } from 'pino-http'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import depthLimit from 'graphql-depth-limit'
import { ZodError } from 'zod'
import { env } from './config/env.js'
import { prisma } from './database/prisma.js'
import { typeDefs } from './graphql/schema.js'
import { resolvers } from './graphql/resolvers.js'
import { createContext } from './graphql/context.js'
import { listProducts, productBySlug } from './modules/products/products.service.js'
import { complexityLimit } from './security/graphql-limits.js'

const app = express()
app.disable('x-powered-by')
app.use(pinoHttp({ redact: ['req.headers.authorization', 'req.headers.cookie', 'res.headers.set-cookie'] }))
app.use(helmet({ contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false, crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true, methods: ['GET', 'POST', 'OPTIONS'] }))
app.use(express.json({ limit: '100kb', type: ['application/json', 'application/graphql-response+json'] }))
app.use('/api', rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }))

const publicJsonProduct = (item: { price: { toString(): string } }) => ({ ...item, price: Number(item.price.toString()) })
app.get('/api/health', (_req, res) => res.status(200).json({ status: 'ok' }))
app.get('/api/categories', async (_req, res, next) => { try { res.status(200).json(await prisma.category.findMany({ orderBy: { name: 'asc' } })) } catch (error) { next(error) } })
app.get('/api/products', async (req, res, next) => { try {
  const filters = { categorySlug: typeof req.query.category === 'string' ? req.query.category : undefined, techniqueSlug: typeof req.query.technique === 'string' ? req.query.technique : undefined, inStock: req.query.inStock === 'true', sort: typeof req.query.sort === 'string' ? req.query.sort : undefined }
  res.status(200).json((await listProducts(filters)).map(publicJsonProduct))
} catch (error) { next(error) } })
app.get('/api/products/:slug', async (req, res, next) => { try { res.status(200).json(publicJsonProduct(await productBySlug(req.params.slug))) } catch (error) { next(error) } })

const graphRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many requests. Try again later.' } })
const loginRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, skip: (req) => !String(req.body?.query ?? '').includes('login'), message: { error: 'Too many login attempts. Try again later.' } })
const server = new ApolloServer({ typeDefs, resolvers, introspection: env.NODE_ENV !== 'production', validationRules: [depthLimit(8), complexityLimit(200)], formatError: (formatted, error) => {
  const originalError = typeof error === 'object' && error !== null && 'originalError' in error ? error.originalError : undefined
  if (originalError instanceof ZodError) return { message: 'Invalid input', extensions: { code: 'VALIDATION_FAILED' } }
  if (formatted.extensions?.code === 'INTERNAL_SERVER_ERROR') return { message: 'An unexpected error occurred', extensions: { code: 'INTERNAL_SERVER_ERROR' } }
  return formatted
} })
await server.start()
const graphql = expressMiddleware(server, { context: createContext })
app.use('/graphql', graphRateLimit, loginRateLimit, graphql)
app.use('/api/graphql', graphRateLimit, loginRateLimit, graphql)
app.use((_req: Request, res: Response) => res.status(404).json({ error: 'Route not found' }))
app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => { void next; const status = typeof error === 'object' && error !== null && 'extensions' in error && typeof (error as { extensions?: { http?: { status?: number } } }).extensions?.http?.status === 'number' ? (error as { extensions: { http: { status: number } } }).extensions.http.status : 500; res.status(status).json({ error: status === 500 ? 'Internal server error' : (error as Error).message }) })
const httpServer = app.listen(env.API_PORT, () => console.info(`API listening on http://localhost:${env.API_PORT}`))
async function shutdown() { httpServer.close(); await server.stop(); await prisma.$disconnect() }
process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown)
