import { textToEmbedding } from '@/services/embedding'
import { extractFilters, ProductFilters } from '@/services/filter-extraction'
import { getDatabase } from '@/payload/utilities/mongo-client'
import { escapeRegex } from '@/payload/utilities/regex'

/**
 * Hybrid search configuration
 */
export interface HybridSearchConfig {
  indexName?: string // Vector search index name
  numCandidates?: number // Number of candidates for vector search
  limit?: number // Maximum results to return
}

const DEFAULT_CONFIG: Required<HybridSearchConfig> = {
  indexName: 'vector_index',
  numCandidates: 100,
  limit: 5,
}

/**
 * Product search result with similarity score
 */
export interface ProductSearchResult {
  _id: string
  title: string
  description: string
  price: number
  pricePrevious?: number
  category: string
  color: string
  manufacturer: string
  url: string
  mediaImages: string[]
  score: number // Vector search similarity score
  onSale?: boolean // Computed field
  discount?: number // Percentage discount if on sale
}

export async function performHybridSearch(
  query: string,
  config: HybridSearchConfig = {},
): Promise<ProductSearchResult[]> {
  const filters = await extractFilters(query)

  const queryEmbedding = await textToEmbedding(filters.semantic_query)
  const mongoFilters = buildFilterConditions(filters.filters)

  // Step 3: Execute vector search with filters
  const db = await getDatabase()
  const productsCollection = db.collection('products')
  const searchConfig = { ...DEFAULT_CONFIG, ...config }

  const pipeline: any[] = [
    {
      $vectorSearch: {
        index: searchConfig.indexName,
        path: 'embedding',
        queryVector: queryEmbedding,
        numCandidates: searchConfig.numCandidates,
        limit: searchConfig.limit,
        ...(mongoFilters.length > 0 && {
          filter: { $and: mongoFilters },
        }),
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        price: 1,
        pricePrevious: 1,
        category: 1,
        color: 1,
        manufacturer: 1,
        url: 1,
        mediaImages: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ]

  const results = await productsCollection.aggregate(pipeline).toArray()

  const products = results.map((doc) => enrichProductResult(doc))
  return products
}

/**
 * Build MongoDB filter conditions from extracted filters
 */
function buildFilterConditions(filters: ProductFilters): any[] {
  const conditions: any[] = []

  // Price filters
  if (filters.price_min !== undefined) {
    conditions.push({ price: { $gte: filters.price_min } })
  }

  if (filters.price_max !== undefined) {
    conditions.push({ price: { $lte: filters.price_max } })
  }

  // Category filter (case-insensitive)
  if (filters.category) {
    conditions.push({
      category: { $regex: new RegExp(`^${escapeRegex(filters.category)}$`, 'i') },
    })
  }

  // Color filter (case-insensitive)
  if (filters.color) {
    conditions.push({
      color: { $regex: new RegExp(`^${escapeRegex(filters.color)}$`, 'i') },
    })
  }

  // Manufacturer filter (case-insensitive)
  if (filters.manufacturer) {
    conditions.push({
      manufacturer: { $regex: new RegExp(`^${escapeRegex(filters.manufacturer)}$`, 'i') },
    })
  }

  // On sale filter
  if (filters.on_sale === true) {
    conditions.push({
      pricePrevious: { $exists: true },
      $expr: { $gt: ['$pricePrevious', '$price'] },
    })
  }

  return conditions
}

/**
 * Enrich product result with computed fields
 */
function enrichProductResult(doc: any): ProductSearchResult {
  const result: ProductSearchResult = {
    _id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    category: doc.category,
    color: doc.color,
    manufacturer: doc.manufacturer,
    url: doc.url,
    mediaImages: doc.mediaImages || [],
    score: doc.score,
  }

  // Add pricePrevious if it exists
  if (doc.pricePrevious !== undefined && doc.pricePrevious !== null) {
    result.pricePrevious = doc.pricePrevious
  }

  // Calculate if product is on sale and discount percentage
  if (result.pricePrevious && result.pricePrevious > result.price) {
    result.onSale = true
    result.discount = Math.round(
      ((result.pricePrevious - result.price) / result.pricePrevious) * 100,
    )
  }

  return result
}
