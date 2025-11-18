import React from 'react'
import { RichText } from '@/components/RichText'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type PostSectionBlockProps = {
  title?: string
  content: SerializedEditorState
}

export const PostSectionBlock: React.FC<PostSectionBlockProps> = ({ title, content }) => {
  return (
    <div className="mb-4">
      <h2 className="text-header2">{title}</h2>
      <RichText data={content} enableGutter={false} />
    </div>
  )
}
