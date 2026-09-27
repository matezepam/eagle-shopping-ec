declare module 'graphql-depth-limit' {
  import type { ValidationRule } from 'graphql'
  const depthLimit: (maximumDepth: number) => ValidationRule
  export default depthLimit
}
