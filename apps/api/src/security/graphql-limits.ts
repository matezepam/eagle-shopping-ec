import { GraphQLError, type ValidationRule } from 'graphql'

export const complexityLimit = (maximum: number): ValidationRule => (context) => {
  let cost = 0
  return {
    Field() {
      cost += 1
      if (cost === maximum + 1) context.reportError(new GraphQLError('Query complexity limit exceeded'))
    }
  }
}
