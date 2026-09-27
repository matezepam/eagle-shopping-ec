import jwt from 'jsonwebtoken'
import type { Role } from '@prisma/client'
import { env } from '../config/env.js'
export type SessionUser = { id: string; email: string; role: Role }
export const SESSION_COOKIE = 'eagle_session'
export const signSession = (user: SessionUser) => jwt.sign(user, env.SESSION_SECRET, { expiresIn: '8h', issuer: 'shopping-eagle' })
export function getSession(cookieHeader?: string): SessionUser | null {
  const raw = cookieHeader?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1)
  if (!raw) return null
  try { return jwt.verify(raw, env.SESSION_SECRET, { issuer: 'shopping-eagle' }) as SessionUser } catch { return null }
}
export const cookieValue = (token: string) => `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${env.NODE_ENV === 'production' ? '; Secure' : ''}`
export const expiredCookie = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${env.NODE_ENV === 'production' ? '; Secure' : ''}`
