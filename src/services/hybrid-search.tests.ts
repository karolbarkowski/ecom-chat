// scripts/test-hybrid-search.ts

import { extractFilters } from './filter-extraction'
import { getProductStats, hybridSearch } from './hybrid-search'

async function testHybridSearch() {
  console.log('🧪 Testing Hybrid Search\n')

  // First, check product statistics
  console.log('📊 Database Statistics:')
  console.log('='.repeat(80))
  try {
    const stats = await getProductStats()
    console.log(`Total Products: ${stats.totalProducts}`)
    console.log(`Products with Embeddings: ${stats.withEmbeddings}`)
    console.log(`Embedding Coverage: ${stats.embeddingCoverage}`)
    console.log('\nTop Categories:')
    stats.topCategories.forEach((cat: any) => {
      console.log(`  - ${cat._id}: ${cat.count} products`)
    })
    console.log('\nTop Manufacturers:')
    stats.topManufacturers.forEach((mfr: any) => {
      console.log(`  - ${mfr._id}: ${mfr.count} products`)
    })
    console.log('='.repeat(80) + '\n')
  } catch (error) {
    console.error('❌ Error fetching stats:', error)
    console.log('Make sure MONGODB_URI is set in .env.local\n')
    return
  }

  // Test queries
  const testQueries = [
    'męskie budy do biegania',
    'zimowe buty trekkingowe',
    'damsie, czerwone trampki',
  ]

  for (const query of testQueries) {
    console.log(`\n${'='.repeat(80)}`)
    console.log(`Query: "${query}"`)
    console.log('='.repeat(80))

    try {
      // Step 1: Extract filters
      console.log('\n1️⃣  Extracting filters...')
      const startExtract = Date.now()
      const { filters, semantic_query } = await extractFilters(query)
      const extractTime = Date.now() - startExtract

      console.log(`   Filters: ${JSON.stringify(filters)}`)
      console.log(`   Semantic Query: "${semantic_query}"`)
      console.log(`   ⏱️  ${extractTime}ms`)

      // Step 2: Perform hybrid search
      console.log('\n2️⃣  Performing hybrid search...')
      const startSearch = Date.now()
      const results = await hybridSearch(semantic_query, filters, {
        limit: 5,
      })
      const searchTime = Date.now() - startSearch

      console.log(`   Found ${results.length} results`)
      console.log(`   ⏱️  ${searchTime}ms`)

      // Step 3: Display results
      if (results.length > 0) {
        console.log('\n3️⃣  Top Results:')
        console.log('-'.repeat(80))
        results.forEach((product, idx) => {
          console.log(`\n   ${idx + 1}. ${product.title}`)
          console.log(`      Manufacturer: ${product.manufacturer}`)
          console.log(`      Category: ${product.category}`)
          console.log(`      Color: ${product.color}`)
          console.log(`      Price: $${product.price.toFixed(2)}`)

          if (product.onSale) {
            console.log(
              `      🏷️  ON SALE! Was $${product.pricePrevious?.toFixed(2)} (${product.discount}% off)`,
            )
          }

          console.log(`      Relevance Score: ${product.score.toFixed(4)}`)
          console.log(`      URL: ${product.url}`)
        })
      } else {
        console.log('\n   ⚠️  No results found')
      }

      // Total time
      const totalTime = extractTime + searchTime
      console.log(
        `\n⏱️  Total Time: ${totalTime}ms (Extract: ${extractTime}ms + Search: ${searchTime}ms)`,
      )
    } catch (error) {
      console.error('❌ Error:', error)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ All tests completed!')
  process.exit(0)
}

// Run tests
testHybridSearch().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
