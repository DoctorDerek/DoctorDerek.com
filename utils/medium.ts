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
    const content = item["content:encoded"] || ""
    const thumbnailMatch = content.match(/<img[^>]+src="([^">]+)"/)
    const thumbnail = thumbnailMatch ? thumbnailMatch[1] : ""

    const description = content
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
