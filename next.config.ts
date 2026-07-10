import type { NextConfig } from "next"
import type { RuleSetRule } from "webpack"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [60, 65, 70, 75, 80, 85, 90, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
    ],
  },
  webpack(config) {
    /**
     * APPROVED EXCEPTION TO NO CODE COMMENT RULE: Clones Webpack
     * SVG loader to apply @svgr/webpack while negating ?url query
     */
    const fileLoaderRule = config.module.rules.find(
      (rule: RuleSetRule) =>
        rule.test instanceof RegExp && rule.test.test(".svg"),
    )

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule?.resourceQuery?.not || []), /url/],
        },
        use: ["@svgr/webpack"],
      },
    )

    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

export default nextConfig
