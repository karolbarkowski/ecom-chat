import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { defaultLexical } from '@/fields/lexicalEditor/defaultLexical'
// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { Media } from './payload/collections/Media'
import { Posts } from './payload/collections/Posts'
import { Products } from './payload/collections/Products/Products'
import { Reviews } from './payload/collections/Products/Reviews'
import { Users } from './payload/collections/Users'
import { ProductImportsAdmin } from './payload/globals/ProductsImport/ProductImportsAdmin'
import { EmbeddingsAdmin } from './payload/globals/ProductsVectorEmbeddings/Admin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    autoLogin: {
      email: 'karol.barkowski@gmail.com',
      password: 'MKB1983!!',
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  localization: {
    locales: ['en', 'pl', 'no'],
    defaultLocale: 'en',
  },
  collections: [Users, Products, Reviews, Media, Posts],
  globals: [ProductImportsAdmin, EmbeddingsAdmin],
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
