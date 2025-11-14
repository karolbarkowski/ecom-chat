import { Config, TextFieldSingleValidation } from 'payload'
import { Code } from '@/payload/blocks/Code/config'
import { MediaBlock } from '@/payload/blocks/MediaBlock/config'
import {
  BlocksFeature,
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  LinkFields,
  ParagraphFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'

export const defaultLexical: Config['editor'] = lexicalEditor({
  features: () => {
    return [
      ParagraphFeature(),
      UnderlineFeature(),
      BoldFeature(),
      ItalicFeature(),
      BlocksFeature({ blocks: [Code, MediaBlock] }),
      LinkFeature({
        enabledCollections: ['posts'],
        fields: ({ defaultFields }) => {
          const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
            if ('name' in field && field.name === 'url') return false
            return true
          })

          return [
            ...defaultFieldsWithoutUrl,
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
              },
              label: ({ t }) => t('fields:enterURL'),
              required: true,
              validate: ((value, options) => {
                if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                  return true // no validation needed, as no url should exist for internal links
                }
                return value ? true : 'URL is required'
              }) as TextFieldSingleValidation,
            },
          ]
        },
      }),
    ]
  },
})
