'use server'

import { Product } from '@/payload-types'
import config from '@payload-config'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { parseCSV } from '@/payload/utilities/csv'

type ProductUpsert = Omit<Product, 'createdAt' | 'updatedAt' | 'id' | 'slug'>

interface ExistingProduct {
  id: string
  url: string
}

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

const BATCH_SIZE = 50

// Helper function to process a single row into product data
function parseProductRow(row: SheinCSVRow): ProductUpsert | null {
  try {
    // Parse image URLs from JSON array string
    let imageUrls: string[] = []
    try {
      imageUrls = JSON.parse(row.image_urls)
    } catch {
      console.warn(`Failed to parse image_urls for product: ${row.product_name}`)
      imageUrls = []
    }

    // Create mediaImages array with isMain flag
    const mediaImages = imageUrls.map((url) => ({
      url: url,
      isMain: url === row.main_image,
    }))

    // Create product data
    return {
      title: row.product_name,
      url: row.url,
      color: row.color,
      price: parseFloat(row.final_price) || 0,
      pricePrevious: parseFloat(row.initial_price) || undefined,
      description: row.description
        .replace('Free Returns', '')
        .replace('Free Shipping', '')
        .replace('✓.', '')
        .replace('✓', '')
        .trim(),
      mediaImages: mediaImages,
      category: row.category,
      manufacturer: row.brand,
    }
  } catch (error) {
    console.error(`Error parsing product ${row.product_name}:`, error)
    return null
  }
}

// Helper function to process a batch of products
async function processBatch(
  payload: Payload,
  batch: SheinCSVRow[],
): Promise<{ success: number; errors: number }> {
  let successCount = 0
  let errorCount = 0

  // Parse all products in the batch
  const parsedProducts = batch
    .map((row) => ({ row, data: parseProductRow(row) }))
    .filter((item) => item.data !== null) as { row: SheinCSVRow; data: ProductUpsert }[]

  if (parsedProducts.length === 0) {
    return { success: 0, errors: batch.length }
  }

  // Get all URLs in this batch
  const batchUrls = parsedProducts.map((item) => item.data.url)

  // Fetch all existing products with matching URLs in a single query
  const existingProducts = await payload.find({
    collection: 'products',
    where: {
      url: {
        in: batchUrls,
      },
    },
    limit: BATCH_SIZE,
  })

  // Create a map of URL -> existing product for quick lookup
  const existingMap = new Map<string, ExistingProduct>(
    existingProducts.docs.map((doc) => [doc.url as string, doc as ExistingProduct]),
  )

  // Separate products into updates and creates
  const toUpdate: { id: string; data: ProductUpsert }[] = []
  const toCreate: ProductUpsert[] = []

  for (const { data } of parsedProducts) {
    if (!data.url) continue // Skip if URL is missing

    const existing = existingMap.get(data.url)
    if (existing) {
      toUpdate.push({ id: existing.id, data })
    } else {
      toCreate.push(data)
    }
  }

  // Process updates
  for (const { id, data } of toUpdate) {
    try {
      await payload.update({
        collection: 'products',
        id,
        data,
      })
      successCount++
    } catch (error) {
      console.error(`Error updating product ${data.title}:`, error)
      errorCount++
    }
  }

  // Process creates
  for (const data of toCreate) {
    try {
      await payload.create({
        collection: 'products',
        data,
      })
      successCount++
    } catch (error) {
      console.error(`Error creating product ${data.title}:`, error)
      errorCount++
    }
  }

  // Account for parsing errors
  errorCount += batch.length - parsedProducts.length

  return { success: successCount, errors: errorCount }
}

export async function submitData() {
  const payload = await getPayload({ config })

  try {
    console.log('Starting Shein product import...')

    // Parse CSV file
    const csvData = (await parseCSV('shein-products.csv')) as SheinCSVRow[]
    console.log(`Found ${csvData.length} products to import`)

    let totalSuccessCount = 0
    let totalErrorCount = 0

    // Process products in batches
    for (let i = 0; i < csvData.length; i += BATCH_SIZE) {
      const batch = csvData.slice(i, i + BATCH_SIZE)
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1
      const totalBatches = Math.ceil(csvData.length / BATCH_SIZE)

      console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} products)...`)

      const { success, errors } = await processBatch(payload, batch)
      totalSuccessCount += success
      totalErrorCount += errors

      console.log(
        `Batch ${batchNumber} completed: ${success} success, ${errors} errors (Total: ${totalSuccessCount}/${csvData.length})`,
      )
    }

    console.log(
      `Import completed! Success: ${totalSuccessCount}, Errors: ${totalErrorCount}, Total: ${csvData.length}`,
    )

    return {
      success: true,
      message: `Imported ${totalSuccessCount} products successfully. ${totalErrorCount} errors.`,
    }
  } catch (error) {
    console.error('Error importing Shein products:', error)
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
