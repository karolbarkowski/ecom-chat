'use server'

import { Product } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { parseCSV } from '@/payload/utilities/csv'

type ProductUpsert = Omit<Product, 'createdAt' | 'updatedAt' | 'id' | 'slug'>

interface SheinCSVRow {
  product_name: string
  description: string
  initial_price: string
  final_price: string
  url: string
  color: string
  category: string
  brand: string
  image_urls: string
  main_image: string
}

export async function submitData() {
  const payload = await getPayload({ config })

  try {
    console.log('Starting Shein product import...')

    // Parse CSV file
    const csvData = (await parseCSV('shein-products.csv')) as SheinCSVRow[]
    console.log(`Found ${csvData.length} products to import`)

    let successCount = 0
    let errorCount = 0

    // Process each product
    for (const row of csvData) {
      try {
        // Parse image URLs from JSON array string
        let imageUrls: string[] = []
        try {
          imageUrls = JSON.parse(row.image_urls)
        } catch (e) {
          console.warn(`Failed to parse image_urls for product: ${row.product_name}`)
          imageUrls = []
        }

        // Create mediaImages array with isMain flag
        const mediaImages = imageUrls.map((url) => ({
          url: url,
          isMain: url === row.main_image,
        }))

        // Create product data
        const productData: ProductUpsert = {
          title: row.product_name,
          url: row.url,
          color: row.color,
          price: parseFloat(row.final_price) || 0,
          pricePrevious: parseFloat(row.initial_price) || undefined,
          description: row.description,
          mediaImages: mediaImages,
          category: row.category,
          manufacturer: row.brand,
        }

        // Upsert product using URL as unique identifier
        // First check if product exists
        const existing = await payload.find({
          collection: 'products',
          where: {
            url: {
              equals: row.url,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          // Update existing product
          await payload.update({
            collection: 'products',
            id: existing.docs[0].id,
            data: productData,
          })
        } else {
          // Create new product
          await payload.create({
            collection: 'products',
            data: productData,
          })
        }

        successCount++
        if (successCount % 10 === 0) {
          console.log(`Processed ${successCount} products...`)
        }
      } catch (error) {
        errorCount++
        console.error(`Error processing product ${row.product_name}:`, error)
      }
    }

    console.log(
      `Import completed! Success: ${successCount}, Errors: ${errorCount}, Total: ${csvData.length}`,
    )

    return {
      success: true,
      message: `Imported ${successCount} products successfully. ${errorCount} errors.`,
    }
  } catch (error) {
    console.error('Error importing Shein products:', error)
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
