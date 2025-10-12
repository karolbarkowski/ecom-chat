import { extractFilters, checkOllamaHealth } from './filter-extraction'

async function testFilterExtraction() {
  console.log('🧪 Testing Filter Extraction Service\n')

  // Check if Ollama is running
  console.log('Checking Ollama health...')
  const isHealthy = await checkOllamaHealth()
  if (!isHealthy) {
    console.error('❌ Ollama is not ready. Please ensure:')
    console.error('   1. Ollama is running: ollama serve')
    console.error('   2. Model is installed: ollama pull llama3.1:8b')
    return
  }
  console.log('✅ Ollama is ready\n')

  // Test cases covering different query types
  const testQueries = [
    // Basic product search
    'blue Nike running shoes',

    // With price constraint
    'red dress under $100',

    // Budget/affordable terms
    'cheap Adidas sneakers',

    // Luxury/premium terms
    'luxury leather handbag',

    // On sale queries
    'black shoes on sale',

    // Multiple constraints
    'Nike running shoes under $150',

    // Color + category
    'white summer dress',

    // Price range
    'shoes between $50 and $200',

    // Manufacturer specific
    'Zara formal shirts',

    // Discount terms
    'clearance winter jackets',

    // Complex query
    'affordable blue Nike sneakers on sale under $80',
  ]

  console.log('Running test queries...\n')
  console.log('='.repeat(80) + '\n')

  for (const query of testQueries) {
    console.log(`Query: "${query}"`)
    console.log('-'.repeat(80))

    try {
      const startTime = Date.now()
      const result = await extractFilters(query)
      const duration = Date.now() - startTime

      console.log('Extracted Filters:')
      if (Object.keys(result.filters).length === 0) {
        console.log('  (no filters)')
      } else {
        Object.entries(result.filters).forEach(([key, value]) => {
          console.log(`  ${key}: ${JSON.stringify(value)}`)
        })
      }

      console.log(`\nSemantic Query: "${result.semantic_query}"`)
      console.log(`⏱️  Duration: ${duration}ms`)
      console.log('\n' + '='.repeat(80) + '\n')
    } catch (error) {
      console.error('❌ Error:', error)
      console.log('\n' + '='.repeat(80) + '\n')
    }
  }

  // Validate extraction quality
  console.log('\n📊 Quality Check Examples:\n')

  const qualityTests = [
    {
      query: 'blue Nike shoes under $100',
      expected: {
        filters: {
          color: 'blue',
          manufacturer: 'Nike',
          price_max: 100,
        },
      },
    },
    {
      query: 'red dresses on sale',
      expected: {
        filters: {
          color: 'red',
          category: 'dresses',
          on_sale: true,
        },
      },
    },
  ]

  for (const test of qualityTests) {
    console.log(`Query: "${test.query}"`)
    const result = await extractFilters(test.query)

    console.log('Expected filters:', JSON.stringify(test.expected.filters, null, 2))
    console.log('Actual filters:  ', JSON.stringify(result.filters, null, 2))

    const matches = JSON.stringify(result.filters) === JSON.stringify(test.expected.filters)
    console.log(matches ? '✅ Match!' : '⚠️  Different (may still be valid)')
    console.log('')
  }

  console.log('✅ All tests completed!')
}

// Run tests
testFilterExtraction().catch(console.error)
