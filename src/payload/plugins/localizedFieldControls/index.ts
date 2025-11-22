import type { Config, Field, Plugin } from 'payload'

/**
 * Plugin that adds custom UI controls below every localized field
 */
export const localizedFieldControlsPlugin = (): Plugin => {
  return (incomingConfig: Config): Config => {
    // Process collections
    const modifiedCollections = incomingConfig.collections?.map((collection) => ({
      ...collection,
      fields: processFields(collection.fields),
    }))

    // Process globals
    const modifiedGlobals = incomingConfig.globals?.map((global) => ({
      ...global,
      fields: processFields(global.fields),
    }))

    return {
      ...incomingConfig,
      collections: modifiedCollections,
      globals: modifiedGlobals,
    }
  }
}

/**
 * Recursively process fields to add custom components to localized fields
 */
function processFields(fields: Field[]): Field[] {
  return fields.map((field) => {
    // Check if this field is localized
    if ('localized' in field && field.localized === true) {
      return {
        ...field,
        admin: {
          ...field.admin,
          components: {
            ...field.admin?.components,
            Description: {
              path: '@/payload/plugins/localizedFieldControls/FieldDescription#LocalizedFieldDescription',
              clientProps: {
                fieldName: field.name,
                fieldType: field.type,
              },
            },
          },
        },
      }
    }

    // Recursively process nested fields
    if ('fields' in field && Array.isArray(field.fields)) {
      return {
        ...field,
        fields: processFields(field.fields),
      }
    }

    // Process tabs
    if (field.type === 'tabs' && 'tabs' in field) {
      return {
        ...field,
        tabs: field.tabs.map((tab) => ({
          ...tab,
          fields: processFields(tab.fields),
        })),
      }
    }

    // Process blocks
    if (field.type === 'blocks' && 'blocks' in field) {
      return {
        ...field,
        blocks: field.blocks.map((block) => ({
          ...block,
          fields: processFields(block.fields),
        })),
      }
    }

    return field
  })
}
