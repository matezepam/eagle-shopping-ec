import { GraphQLError } from 'graphql'
export const fail = (message: string, code: string, httpStatus = 400) => new GraphQLError(message, { extensions: { code, http: { status: httpStatus } } })
export const notFound = (entity: string) => fail(`${entity} not found`, 'NOT_FOUND', 404)
