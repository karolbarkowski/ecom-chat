import { CollectionConfig } from 'payload'
import { anyone } from '@/payload/access/anyone'

export const PostComments: CollectionConfig = {
  slug: 'post-comments',
  access: {
    create: anyone,
    delete: anyone,
    read: anyone,
    update: anyone,
  },
  fields: [
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
  ],
}
