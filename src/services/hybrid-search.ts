import { generateEmbedding } from './embedding'
import { ProductFilters } from './filter-extraction'
import { getDatabase } from './mongo-client'

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
 * Perform hybrid search combining vector similarity and structured filters
 * @param semanticQuery - Text query for vector search
 * @param filters - Structured filters from filter extraction
 * @param config - Search configuration
 * @returns Array of matching products with scores
 */
export async function hybridSearch(
  semanticQuery: string,
  filters: ProductFilters,
  config: HybridSearchConfig = {},
): Promise<ProductSearchResult[]> {
  const searchConfig = { ...DEFAULT_CONFIG, ...config }

  // Step 1: Generate embedding for the semantic query
  const queryEmbedding = await generateEmbedding(semanticQuery)

  // Step 2: Build filter conditions for MongoDB
  const filterConditions = buildFilterConditions(filters)

  // Step 3: Execute vector search with filters
  const db = await getDatabase()
  const productsCollection = db.collection('products')

  const pipeline: any[] = [
    {
      $vectorSearch: {
        index: searchConfig.indexName,
        path: 'embedding',
        queryVector: queryEmbedding,
        numCandidates: searchConfig.numCandidates,
        limit: searchConfig.limit,
        ...(filterConditions.length > 0 && {
          filter: { $and: filterConditions },
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

  // Step 4: Enrich results with computed fields
  return results.map((doc) => enrichProductResult(doc))
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
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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

/**
 * Get product statistics for debugging
 */
export async function getProductStats() {
  const db = await getDatabase()
  const productsCollection = db.collection('products')

  const totalProducts = await productsCollection.countDocuments()
  const withEmbeddings = await productsCollection.countDocuments({
    embedding: { $exists: true, $ne: null },
  })

  const categories = await productsCollection
    .aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }])
    .toArray()

  const manufacturers = await productsCollection
    .aggregate([
      { $group: { _id: '$manufacturer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])
    .toArray()

  return {
    totalProducts,
    withEmbeddings,
    embeddingCoverage: ((withEmbeddings / totalProducts) * 100).toFixed(1) + '%',
    topCategories: categories.slice(0, 5),
    topManufacturers: manufacturers,
  }
}
