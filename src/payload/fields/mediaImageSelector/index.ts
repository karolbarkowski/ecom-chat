import type { ArrayField, UIField } from 'payload'

type MediaImageSelectorOptions = {
  name?: string
  label?: string
  arrayOverrides?: Partial<ArrayField>
}

type MediaImagesField = (options?: MediaImageSelectorOptions) => [ArrayField, UIField]

export const mediaImagesField: MediaImagesField = (options = {}) => {
  const { name = 'mediaImages', label = 'Images', arrayOverrides = {} } = options

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
    ...arrayOverrides,
  }

  const uiField: UIField = {
    name: `${name}Selector`,
    type: 'ui',
    admin: {
      components: {
        Field: {
          path: '@/payload/fields/mediaImageSelector/MediaImageSelectorComponent#MediaImageSelectorComponent',
          clientProps: {
            arrayFieldPath: name,
          },
        },
      },
    },
  }

  return [arrayField, uiField]
}
