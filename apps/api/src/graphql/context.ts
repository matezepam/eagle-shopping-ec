import type { Request, Response } from 'express'
import { getSession } from '../security/session.js'
export type GraphqlContext = { req: Request; res: Response; user: ReturnType<typeof getSession> }
export const createContext = async ({ req, res }: { req: Request; res: Response }): Promise<GraphqlContext> => ({ req, res, user: getSession(req.headers.cookie) })
