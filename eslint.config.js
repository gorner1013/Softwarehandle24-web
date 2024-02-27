import path from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'

// @ts-expect-error no typings
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

export default antfu(
  {
    rules: {
      curly: 'off',
      'no-console': 'off',
      'no-case-declarations': 'off',
      'antfu/consistent-list-newline': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-argument': 'off',
      'ts/no-unsafe-member-access': 'off',
      'style/operator-linebreak': 'off',
      'style/quote-props': 'off',
      'style/brace-style': 'off',
      'style/arrow-parens': 'off',
      'style/indent': 'off',
      'vue/v-on-event-hyphenation': 'off',
    },
  },
  compat.extends('eslint-config-prettier'),
)
