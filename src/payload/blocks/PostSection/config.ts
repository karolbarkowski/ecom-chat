import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  InlineToolbarFeature,
  SubscriptFeature,
  SuperscriptFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import type { Block } from 'payload'
import { Code } from '../Code/config'
import { MediaBlock } from '../MediaBlock/config'

export const PostSection: Block = {
  slug: 'postSection',
  interfaceName: 'PostSection',
  fields: [
    {
      localized: true,
      name: 'title',
      type: 'text',
    },
    {
      localized: true,
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            AlignFeature(),
            IndentFeature(),
            ChecklistFeature(),
            BlockquoteFeature(),
            SubscriptFeature(),
            SuperscriptFeature(),
            // OrderedListFeature(),    <-- that thing throws error in admin editor
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Code, MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: false,
      required: true,
    },
  ],
}
