module.exports = {
  semi: false,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindStylesheet: "./styles/globals.css",
  tailwindAttributes: ["tw"],
  tailwindFunctions: ["tw", "classNames"],
}
