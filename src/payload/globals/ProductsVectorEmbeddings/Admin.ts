import { GlobalConfig } from 'payload'

export const EmbeddingsAdmin: GlobalConfig = {
  slug: 'product-vetor-embeddings',
  versions: false,
  label: {
    en: 'Vector Embeddings',
  },
  admin: {
    group: 'AI',
    components: {
      views: {
        edit: {
          root: {
            Component: '/payload/globals/ProductsVectorEmbeddings/DefaultUI',
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
