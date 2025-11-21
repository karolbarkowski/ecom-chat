import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { defaultLexical } from '@/fields/lexicalEditor/defaultLexical'
// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { Media } from './payload/collections/Media'
import { Posts } from './payload/collections/Posts/Posts'
import { Products } from './payload/collections/Products/Products'
import { ProductReviews } from './payload/collections/Products/ProductReviews'
import { Users } from './payload/collections/Users'
import { ProductImportsAdmin } from './payload/globals/ProductsImport/ProductImportsAdmin'
import { EmbeddingsAdmin } from './payload/globals/ProductsVectorEmbeddings/Admin'
import { PostComments } from './payload/collections/Posts/PostComments'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

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
  email: nodemailerAdapter({
    defaultFromAddress: 'info@payloadcms.com',
    defaultFromName: 'Payload',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  collections: [Users, Products, ProductReviews, Media, Posts, PostComments],
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
