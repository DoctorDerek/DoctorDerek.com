/**
 * ONE-TIME EXCEPTION TO NO CODE COMMENT RULE:
 * typescript-eslint (v8.63.0) is broken with TypeScript 7 (v7.0.2)
 * TODO Restore typescript-eslint rules as soon as possible!!
 * */
import gitignore from "eslint-config-flat-gitignore"
// import nextConfig from "eslint-config-next"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import onlyWarn from "eslint-plugin-only-warn"

const eslintConfig = [
  gitignore(),
  // ...nextConfig,
  eslintConfigPrettier,
  {
    plugins: {
      "only-warn": onlyWarn,
    },
  },
]

export default eslintConfig
