import ollama from 'ollama'

const LLM_MODEL = 'deepseek-r1:1.5b'

/**
 * Extracted filters from user query
 */
export interface ProductFilters {
  price_min?: number
  price_max?: number
  category?: string
  color?: string
  manufacturer?: string
  on_sale?: boolean
}

/**
 * Result from filter extraction
 */
export interface FilterExtractionResult {
  filters: ProductFilters
  semantic_query: string
}

/**
 * Extract structured filters from natural language query using Llama
 * @param userQuery - Natural language product search query
 * @returns Extracted filters and refined semantic query
 */
export async function extractFilters(userQuery: string): Promise<FilterExtractionResult> {
  const prompt = `Extract product filters from the user query. Return ONLY valid JSON, no additional text or explanation.

        Available filters:
        - price_min: number (minimum price in dollars)
        - price_max: number (maximum price in dollars)
        - category: string (e.g., "sneakers", "dress", "shirt", "pants", "shoes")
        - color: string (e.g., "blue", "red", "black", "white")
        - manufacturer: string (brand name like "Nike", "Adidas", "Zara")
        - on_sale: boolean (true if user mentions "sale", "discount", "clearance", "deal")

        Rules:
        - Only include filters that are explicitly mentioned or strongly implied
        - For price terms like "cheap", "affordable", "budget" use price_max: 50
        - For price terms like "expensive", "luxury", "premium" use price_min: 200
        - For "under $X" or "less than $X" use price_max: X
        - For "over $X" or "more than $X" use price_min: X
        - Create a semantic_query by removing price/filter terms and keeping product descriptors
        - If no filters apply, return empty filters object

        User query: "${userQuery}"

        Return JSON format:
        {
            "filters": {},
            "semantic_query": "refined search terms"
        }`

  try {
    const response = await ollama.chat({
      model: LLM_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a specialized filter extraction system. Return only valid JSON, nothing else.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: false,
      options: {
        temperature: 0.1, // Low temperature for consistent, deterministic output
        top_p: 0.9,
      },
    })

    const content = response.message.content.trim()

    // Extract JSON from response (handle cases where LLM adds extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('No JSON found in LLM response:', content)
      return {
        filters: {},
        semantic_query: userQuery,
      }
    }

    const parsed = JSON.parse(jsonMatch[0]) as FilterExtractionResult

    // Validate and sanitize the result
    return sanitizeFilterResult(parsed, userQuery)
  } catch (error) {
    console.error('Filter extraction error:', error)
    // Fallback: return empty filters and use original query
    return {
      filters: {},
      semantic_query: userQuery,
    }
  }
}

/**
 * Validate and sanitize filter extraction result
 * Ensures data types are correct and values are reasonable
 */
function sanitizeFilterResult(result: any, originalQuery: string): FilterExtractionResult {
  const filters: ProductFilters = {}

  // Validate price_min
  if (result.filters?.price_min !== undefined) {
    const priceMin = Number(result.filters.price_min)
    if (!isNaN(priceMin) && priceMin >= 0 && priceMin <= 10000) {
      filters.price_min = priceMin
    }
  }

  // Validate price_max
  if (result.filters?.price_max !== undefined) {
    const priceMax = Number(result.filters.price_max)
    if (!isNaN(priceMax) && priceMax >= 0 && priceMax <= 10000) {
      filters.price_max = priceMax
    }
  }

  // Ensure price_min <= price_max
  if (filters.price_min && filters.price_max && filters.price_min > filters.price_max) {
    ;[filters.price_min, filters.price_max] = [filters.price_max, filters.price_min]
  }

  // Validate category (convert to lowercase)
  if (result.filters?.category && typeof result.filters.category === 'string') {
    filters.category = result.filters.category.toLowerCase().trim()
  }

  // Validate color (convert to lowercase)
  if (result.filters?.color && typeof result.filters.color === 'string') {
    filters.color = result.filters.color.toLowerCase().trim()
  }

  // Validate manufacturer (keep original case for brand names)
  if (result.filters?.manufacturer && typeof result.filters.manufacturer === 'string') {
    filters.manufacturer = result.filters.manufacturer.trim()
  }

  // Validate on_sale
  if (result.filters?.on_sale !== undefined) {
    filters.on_sale = Boolean(result.filters.on_sale)
  }

  // Validate semantic_query
  let semantic_query = originalQuery
  if (result.semantic_query && typeof result.semantic_query === 'string') {
    const cleaned = result.semantic_query.trim()
    if (cleaned.length > 0) {
      semantic_query = cleaned
    }
  }

  return {
    filters,
    semantic_query,
  }
}
