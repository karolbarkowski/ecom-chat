import type { UIField } from 'payload'

type TranslationManagerOptions = {
  name?: string
  label?: string
}

type TranslationManagerField = (options?: TranslationManagerOptions) => UIField

export const translationManagerField: TranslationManagerField = (options = {}) => {
  const { name = 'translationManager', label = 'Translation Manager' } = options

  const uiField: UIField = {
    name,
    type: 'ui',
    label,
    admin: {
      position: 'sidebar',
      components: {
        Field: {
          path: '@/payload/fields/translationManager/TranslationManagerComponent#TranslationManagerComponent',
        },
      },
    },
  }

  return uiField
}
