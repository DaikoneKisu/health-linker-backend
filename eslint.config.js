const { configs: eslintConfigs } = require('@eslint/js')
const { config, configs: tsEslintConfigs } = require('typescript-eslint')
const eslintConfigPrettier = require('eslint-config-prettier')
const drizzle = require('eslint-plugin-drizzle')

module.exports = config(
  eslintConfigs.recommended,
  ...tsEslintConfigs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    plugins: {
      drizzle
    },
    files: ['src/**/*.ts'],
    rules: {
      'no-undef': 'off',
      'drizzle/enforce-delete-with-where': ['error', { drizzleObjectName: ['_db', 'db'] }],
      'drizzle/enforce-update-with-where': ['error', { drizzleObjectName: ['_db', 'db'] }]
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname
      }
    }
  },
  {
    ignores: ['.DS_Store', 'dist/**', '**/*.config.js', 'generated/**']
  }
)
