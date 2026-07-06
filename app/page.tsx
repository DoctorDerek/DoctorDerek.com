import ClientShell from "@/components/ClientShell"
import getMediumPosts from "@/utils/medium"

export const revalidate = 86400

export default async function Home() {
  const posts = await getMediumPosts()
  return <ClientShell posts={posts} />
}
