import type { Config } from "prettier"
import type { PluginOptions } from "prettier-plugin-tailwindcss"

const config: Config & PluginOptions = {
  semi: false,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: ["^@/(.*)$", "^[./]"],
  tailwindFunctions: ["cx"],
}

export default config
