import type { User } from '~/types/catalog'
import { graphql } from '~/services/graphql'
const ME = 'query Me { me { id email role createdAt } }'
export function useAuth() {
  const user = useState<User | null>('auth-user', () => null)
  const checked = useState<boolean>('auth-checked', () => false)
  const refresh = async (force = false) => {
    if (checked.value && !force) return user.value
    try { user.value = (await graphql<{ me: User | null }>(ME)).me } catch { user.value = null }
    checked.value = true; return user.value
  }
  const login = async (email: string, password: string) => { user.value = (await graphql<{ login: User }>('mutation Login($input: CredentialsInput!) { login(input: $input) { id email role createdAt } }', { input: { email, password } })).login; checked.value = true; return user.value }
  const register = async (email: string, password: string) => { user.value = (await graphql<{ register: User }>('mutation Register($input: CredentialsInput!) { register(input: $input) { id email role createdAt } }', { input: { email, password } })).register; checked.value = true; return user.value }
  const logout = async () => { await graphql<{ logout: boolean }>('mutation Logout { logout }'); user.value = null; checked.value = true }
  return { user, refresh, login, register, logout }
}
