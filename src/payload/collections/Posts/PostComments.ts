import { CollectionConfig } from 'payload'
import { anyone } from '@/payload/access/anyone'
import { analyzeSentiment } from './hooks/analyzeSentiment'

export const PostComments: CollectionConfig = {
  slug: 'post-comments',
  access: {
    create: anyone,
    delete: anyone,
    read: anyone,
    update: anyone,
  },
  hooks: {
    afterChange: [analyzeSentiment],
  },
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'user', 'sentimentIndicator', 'createdAt'],
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'sentiment',
      type: 'select',
      required: false,
      options: [
        { label: 'positive', value: '1' },
        { label: 'neutral', value: '0' },
        { label: 'negative', value: '-1' },
      ],
      admin: {
        disabled: true,
        readOnly: true,
      },
    },
    {
      name: 'sentimentIndicator',
      type: 'ui',
      admin: {
        components: {
          Cell: '@/payload/collections/Posts/components/SentimentCell',
        },
      },
    },
  ],
}
