// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './payload/collections/Users'
import { Products } from './payload/collections/Products'
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
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Products],
  globals: [ProductImportsAdmin, EmbeddingsAdmin],
  editor: lexicalEditor(),
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
