type GraphqlResponse<T> = { data?: T; errors?: Array<{ message: string }> }
export async function graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const config = useRuntimeConfig()
  const requestHeaders = import.meta.server ? useRequestHeaders(['cookie']) : {}
  const response = await $fetch<GraphqlResponse<T>>(config.public.graphqlUrl, { method: 'POST', credentials: 'include', body: { query, variables }, headers: { 'content-type': 'application/json', ...requestHeaders } })
  if (response.errors?.length) throw new Error(response.errors[0]?.message ?? 'The server rejected this request.')
  if (!response.data) throw new Error('The server returned an empty response.')
  return response.data
}
