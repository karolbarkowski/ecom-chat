import { GlobalConfig } from 'payload'

export const ProductImportsAdmin: GlobalConfig = {
  slug: 'product-imports',
  versions: false,

  admin: {
    group: 'Integrations',
    components: {
      views: {
        edit: {
          root: {
            Component: '/payload/globals/ProductsImport/ImportsDefaultUI',
          },
        },
      },
    },
    hideAPIURL: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
