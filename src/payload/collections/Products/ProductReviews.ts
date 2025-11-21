import { CollectionConfig } from 'payload'
import { reviewAfterChange } from './hooks/review-afterChange'

export const ProductReviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'rating',
    defaultColumns: ['rating', 'user', 'product', 'createdAt'],
  },
  hooks: {
    afterChange: [reviewAfterChange],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
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
  ],
}
