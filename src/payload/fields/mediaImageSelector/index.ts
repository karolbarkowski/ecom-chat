import type { ArrayField, UIField } from 'payload'

type MediaImageSelectorOptions = {
  name?: string
  label?: string
}

type MediaImagesField = (options?: MediaImageSelectorOptions) => [ArrayField, UIField]

export const mediaImagesField: MediaImagesField = (options = {}) => {
  const { name = 'mediaImages', label = 'Images' } = options

  const arrayField: ArrayField = {
    name,
    label,
    type: 'array',
    fields: [
      {
        name: 'url',
        type: 'text',
        required: true,
      },
      {
        name: 'order',
        type: 'number',
        required: true,
        defaultValue: 1,
      },
    ],
    admin: {
      hidden: true,
    },
  }

  const uiField: UIField = {
    name: `${name}`,
    type: 'ui',
    label: 'Images',
    admin: {
      components: {
        Field: {
          path: '@/payload/fields/mediaImageSelector/MediaImageSelectorComponent#MediaImageSelectorComponent',
        },
      },
    },
  }

  return [arrayField, uiField]
}
