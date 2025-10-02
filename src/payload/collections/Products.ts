import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { colorPickerField } from '../fields/colorPicker'

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
    colorPickerField,
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
              name: 'color',
              type: 'text',
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
  ],
}
