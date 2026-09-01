import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
{{#if language=typescript}}
import tseslint from 'typescript-eslint'
{{/if}}

export default [
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
{{#if language=typescript}}
  ...tseslint.configs.recommended,
{{/if}}
  prettier,
]
