import gitignore from "eslint-config-flat-gitignore"
import nextConfig from "eslint-config-next"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import onlyWarn from "eslint-plugin-only-warn"

const eslintConfig = [
  gitignore(),
  ...nextConfig,
  eslintConfigPrettier,
  {
    plugins: {
      "only-warn": onlyWarn,
    },
  },
  {
    files: ["components/ClientShell.tsx"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]

export default eslintConfig
