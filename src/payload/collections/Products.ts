import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { mediaImagesField } from '../fields/mediaImageSelector'
import { translationManagerField } from '../fields/translationManager'
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
      localized: true,
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
              localized: true,
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
              localized: true,
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
      localized: true,
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
    translationManagerField(),
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
