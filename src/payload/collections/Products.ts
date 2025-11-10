import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Product Details',
          fields: [
            {
              name: 'url',
              type: 'text',
            },
            {
              name: 'color',
              type: 'text',
            },
            {
              name: 'price',
              type: 'number',
              required: true,
            },
            {
              name: 'pricePrevious',
              type: 'number',
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'mediaImages',
              label: 'Images',
              type: 'array',
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'isMain',
                  type: 'checkbox',
                  required: true,
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          label: 'AI',
          fields: [
            {
              name: 'embedding',
              type: 'number',
              hasMany: true,
            },
          ],
        },
      ],
    },
    {
      name: 'category',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'manufacturer',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
}
