import type { Metadata } from 'next/types'
import { PostsList } from './_components/PostsList'

// export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page({ searchParams }: { searchParams: Promise<{ tag: string }> }) {
  const { tag } = await searchParams
  const listType = tag ? 'tag' : 'all'

  return <PostsList listType={listType} tag={tag} />
}

export function generateMetadata(): Metadata {
  return {
    title: `Posts`,
  }
}
