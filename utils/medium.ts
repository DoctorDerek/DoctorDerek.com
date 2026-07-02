import Parser from "rss-parser"

export interface MediumPost {
  title: string
  link: string
  pubDate: string
  thumbnail: string
  description: string
}

const decodeEntities = (str: string) => {
  return (
    str
      /**
       * APPROVED EXCEPTION TO NO CODE COMMENT RULE:
       * Decode hex/decimal and common named HTML entities
       */
      .replace(/&#x([0-9A-Fa-f]+);/gi, (_, hex) =>
        String.fromCodePoint(parseInt(hex, 16)),
      )
      .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
      .replace(/&quot;/g, "”")
      .replace(/&apos;/g, "’")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&rsquo;/g, "’")
      .replace(/&lsquo;/g, "‘")
      .replace(/&rdquo;/g, "”")
      .replace(/&ldquo;/g, "“")
      .replace(/&mdash;/g, "—")
      .replace(/&ndash;/g, "–")
      .replace(/&hellip;/g, "…")
      .replace(/&nbsp;/g, " ")
  )
}

export default async function getMediumPosts(): Promise<MediumPost[]> {
  const parser = new Parser()
  const feed = await parser.parseURL("https://medium.com/feed/@doctorderek")

  return feed.items.map((item) => {
    const content =
      item["content:encoded"] || item.content || item.description || ""

    /**
     * APPROVED EXCEPTION TO NO CODE COMMENT RULE: Find all images,
     * skip Medium's 1x1 invisible tracking pixel (stat.medium.com)
     */
    const imgMatches = Array.from(
      content.matchAll(/<img[^>]+src="([^">]+)"/g),
    ) as RegExpMatchArray[]
    const validImage = imgMatches.find(
      (m) => !m[1].includes("stat?event") && !m[1].includes("stat.medium.com"),
    )
    const thumbnail = validImage ? validImage[1] : ""

    const description =
      decodeEntities(
        content
          .replace(/<[^>]*>?/gm, "")
          .replace(/&nbsp;/g, " ")
          .trim(),
      ).substring(0, 180) + "..."

    return {
      title: decodeEntities(item.title || ""),
      link: item.link || "",
      pubDate: item.pubDate || "",
      thumbnail,
      description,
    }
  })
}
