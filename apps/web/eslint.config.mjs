import tsParser from '@typescript-eslint/parser'
import tseslint from '@typescript-eslint/eslint-plugin'
import vueParser from 'vue-eslint-parser'

export default [
  { ignores: ['.nuxt/**', '.output/**', 'node_modules/**'] },
  { files: ['**/*.ts'], languageOptions: { parser: tsParser }, plugins: { '@typescript-eslint': tseslint }, rules: { '@typescript-eslint/no-explicit-any': 'error' } },
  { files: ['**/*.vue'], languageOptions: { parser: vueParser, parserOptions: { parser: tsParser, extraFileExtensions: ['.vue'] } }, plugins: { '@typescript-eslint': tseslint }, rules: { '@typescript-eslint/no-explicit-any': 'error' } }
]
