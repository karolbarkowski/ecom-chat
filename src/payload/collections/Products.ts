import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { mediaImagesField } from '../fields/mediaImageSelector'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'color', 'actions'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
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
            ...mediaImagesField(),
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
    {
      name: 'actions',
      type: 'ui',
      admin: {
        components: {
          Cell: '@/payload/components/ProductActionsCell',
        },
      },
    },
  ],
}
