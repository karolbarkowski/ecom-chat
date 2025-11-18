import React from 'react'
import { TagsCloud } from './_components/PostsTagsCloud'
import { PostsTrendingList } from './_components/PostsTrendingList'

const PostsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex gap-x-16 min-h-screen w-full container mx-auto py-16">
      <main className="flex-3">{children}</main>

      <aside className="flex flex-col flex-1 gap-12">
        <div>
          <h2 className="text-xl uppercase tracking-wider mb-2">Trending Posts</h2>
          <PostsTrendingList />
        </div>

        <div>
          <h2 className="text-xl uppercase tracking-wider mb-2">Browse other tags</h2>
          <TagsCloud />
        </div>
      </aside>
    </div>
  )
}

export default PostsLayout
