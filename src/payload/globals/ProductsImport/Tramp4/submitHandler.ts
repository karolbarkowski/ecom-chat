'use server'

import { Product } from '@/payload-types'
import { Tramp4Import } from './types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { parseFile } from '@/payload/utilities/xml'

type ProductUpsert = Omit<Product, 'createdAt' | 'updatedAt' | 'id' | 'slug'>

const xmlFileName = 'Tramp4'

export async function submitData() {
  const payload = await getPayload({ config })

  const xmlData = (await parseFile(xmlFileName)) as unknown as Tramp4Import
  const products = xmlData.nokaut.offers.offer

  const dataToUpsert = await Promise.all(
    products.map(async (p) => {
      const _erpId = `${xmlFileName}_${p.id}`
      const props = getProps(p.property)
      const categoryName = p.category.split('>')[0].trim()

      return {
        updateOne: {
          upsert: true,
          filter: { erpId: _erpId },
          update: {
            erpId: _erpId,
            title: p.name,
            description: p.description,
            quantity: parseFloat(p.availability),
            url: props.url,
            color: props.color,
            pricePrevious: props.previousPrice,
            price: parseFloat(p.price),
            manufacturer: props.manufacturer,
            category: categoryName,
            _status: 'published',
            mediaImages: [
              {
                isMain: true,
                url: p.image,
              },
            ],
            version: 1,
            slug: slugify(p.name),
          } as ProductUpsert,
        },
      }
    }),
  )

  await payload.db.collections['products'].bulkWrite(dataToUpsert)
  return true
}

function getProps(props: { name: string; '#text'?: string }[]): {
  url?: string
  previousPrice?: number
  color?: string
  manufacturer?: string
} {
  return props.reduce(
    (acc, { name, '#text': txt }) => {
      if (!txt) return acc
      switch (name) {
        case 'ProductUrl':
          acc.url = txt
          break
        case 'PreviousPrice':
          acc.previousPrice = parseFloat(txt)
          break
        case 'Kolor':
          acc.color = txt
          break
        case 'Producent':
          acc.manufacturer = txt
          break
      }
      return acc
    },
    {} as {
      url?: string
      previousPrice?: number
      color?: string
      manufacturer?: string
    },
  )
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}
