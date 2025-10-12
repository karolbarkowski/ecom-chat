// scripts/test-embeddings.ts
import { Product } from '@/payload-types'
import { generateEmbedding, cosineSimilarity, productToEmbeddingText } from './embedding'

async function testEmbeddings() {
  console.log('🧪 Testing Embedding Service\n')

  // Test 1: Basic embedding generation
  console.log('Test 1: Generating embedding for simple text...')
  const text1 = 'blue Nike running shoes'
  const embedding1 = await generateEmbedding(text1)
  console.log(`✅ Generated ${embedding1.length}-dimensional embedding`)
  console.log(
    `   First 5 values: [${embedding1
      .slice(0, 5)
      .map((v) => v.toFixed(4))
      .join(', ')}]\n`,
  )

  // Test 2: Product text conversion
  console.log('Test 2: Converting product to embedding text...')
  const sampleProduct: Product = {
    title: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air cushioning',
    category: 'sneakers',
    manufacturer: 'Nike',
    color: 'blue',
    id: 'test-product-1',
    price: 150,
    pricePrevious: 180,
    updatedAt: '',
    createdAt: '',
  }
  const productText = productToEmbeddingText(sampleProduct)
  console.log(`✅ Product text: "${productText}"\n`)

  // Test 3: Similarity testing
  console.log('Test 3: Testing semantic similarity...\n')

  const queries = [
    'blue Nike athletic shoes',
    'red Adidas dress shoes',
    'black dress elegant formal',
  ]

  const productEmbed = await generateEmbedding(productText)

  for (const query of queries) {
    const queryEmbed = await generateEmbedding(query)
    const similarity = cosineSimilarity(productEmbed, queryEmbed)
    console.log(`   Query: "${query}"`)
    console.log(
      `   Similarity: ${similarity.toFixed(4)} ${similarity > 0.7 ? '✅ High match!' : similarity > 0.5 ? '⚠️  Medium' : '❌ Low'}\n`,
    )
  }

  // Test 4: Compare similar products
  console.log('Test 4: Comparing similar products...\n')

  const products = [
    {
      title: 'Nike Air Max 270',
      description: 'Running shoes with air cushioning',
      category: 'sneakers',
      manufacturer: 'Nike',
      color: 'blue',
      id: 'test-product-1',
      price: 150,
      pricePrevious: 180,
      updatedAt: '',
      createdAt: '',
    },
    {
      title: 'Adidas Ultraboost',
      description: 'Premium running sneakers',
      category: 'sneakers',
      manufacturer: 'Adidas',
      color: 'blue',
      id: 'test-product-2',
      price: 250,
      pricePrevious: 280,
      updatedAt: '',
      createdAt: '',
    },
    {
      title: 'Evening Dress',
      description: 'Elegant formal dress for special occasions',
      category: 'dresses',
      manufacturer: 'Zara',
      color: 'red',
      id: 'test-product-3',
      price: 200,
      pricePrevious: 200,
      updatedAt: '',
      createdAt: '',
    },
  ]

  const userQuery = 'blue running shoes Nike'
  const queryEmbed = await generateEmbedding(userQuery)

  console.log(`User query: "${userQuery}"\n`)
  console.log('Product rankings:')

  const results = await Promise.all(
    products.map(async (product, idx) => {
      const prodText = productToEmbeddingText(product)
      const prodEmbed = await generateEmbedding(prodText)
      const score = cosineSimilarity(queryEmbed, prodEmbed)
      return { product, score, idx: idx + 1 }
    }),
  )

  // Sort by score descending
  results.sort((a, b) => b.score - a.score)

  results.forEach(({ product, score, idx }) => {
    console.log(`   ${idx}. ${product.title} (${product.manufacturer})`)
    console.log(`      Score: ${score.toFixed(4)}`)
    console.log(
      `      ${score > 0.7 ? '✅ Strong match' : score > 0.5 ? '⚠️  Moderate match' : '❌ Weak match'}\n`,
    )
  })

  console.log('✅ All tests completed!')
}

// Run tests
testEmbeddings().catch(console.error)
