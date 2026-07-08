import gitignore from "eslint-config-flat-gitignore"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import onlyWarn from "eslint-plugin-only-warn"

const eslintConfig = [
  { files: ["**/*.ts", "**/*.tsx"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  eslintConfigPrettier,
  {
    plugins: {
      "only-warn": onlyWarn,
    },
  },
  gitignore(),
  {
    files: ["components/ClientShell.tsx"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]

export default eslintConfig
