import Parser from "rss-parser"

export interface MediumPost {
  title: string
  link: string
  pubDate: string
  thumbnail: string
  description: string
}

export default async function getMediumPosts(): Promise<MediumPost[]> {
  const parser = new Parser()
  const feed = await parser.parseURL("https://medium.com/feed/@doctorderek")

  return feed.items.map((item) => {
    const content =
      item["content:encoded"] || item.content || item.description || ""

    // Find all images, select the first that isn't a tracking pixel
    const imgMatches = Array.from(content.matchAll(/<img[^>]+src="([^">]+)"/g)) as RegExpMatchArray[]
    const validImage = imgMatches.find(
      (m) => !m[1].includes("stat?event") && !m[1].includes("stat.medium.com"),
    )
    const thumbnail = validImage ? validImage[1] : ""

    const description =
      content
        .replace(/<[^>]*>?/gm, "")
        .replace(/&nbsp;/g, " ")
        .trim()
        .substring(0, 180) + "..."

    return {
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate || "",
      thumbnail,
      description,
    }
  })
}
