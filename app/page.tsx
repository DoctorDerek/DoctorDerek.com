import getMediumPosts from "@/utils/medium"
import ClientShell from "@/components/ClientShell"

export const revalidate = 86400

export default async function Home() {
  const posts = await getMediumPosts()
  return <ClientShell posts={posts} />
}
