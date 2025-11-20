import { CollectionConfig } from 'payload'

export const ProductReviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'rating',
    defaultColumns: ['rating', 'user', 'product', 'createdAt'],
  },
  fields: [
    {
      name: 'rating',
      type: 'select',
      required: true,
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
      ],
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
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
  ],
}
