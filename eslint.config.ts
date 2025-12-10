import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path"
import { fileURLToPath } from "url"

import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, ...compat.extends("prettier"), {
  rules: {
    /**
     * I have to turn this to "warn" for compatibility with Cursor since
     * ESLint has a parsing bug around importing and use of Error types.
     * */
    "@typescript-eslint/no-unused-vars": "warn",
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}]

export default eslintConfig
