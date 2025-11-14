import React from 'react'
import Section from '@/components/Containers/section'
import { TagsCloud } from '@/components/Posts/PostsTagsCloud'
import { PostsTrendingList } from '@/components/Posts/PostsTrendingList'

const PostsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="container">
      <div className="flex gap-x-4 min-h-screen">
        <main className="flex-2">{children}</main>

        <aside className="flex flex-col flex-1 gap-12 bg-gray-200 p-4">
          <Section>
            <Section.Header>
              <h5 className="text-header5">Trending posts</h5>
            </Section.Header>
            <Section.Content>
              <PostsTrendingList />
            </Section.Content>
          </Section>

          <Section>
            <Section.Header>
              <h5 className="text-header5">Browse other tags</h5>
            </Section.Header>
            <Section.Content>
              <TagsCloud />
            </Section.Content>
          </Section>
        </aside>
      </div>
    </div>
  )
}

export default PostsLayout
