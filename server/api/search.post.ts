import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const query = body?.query?.trim()

    if (!query) {
      return []
    }

    const client = await serverSupabaseClient(event)
    
    // Get all products
    const { data: products, error: dbError } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('Database error:', dbError)
      return []
    }

    if (!products?.length) {
      return []
    }

    // Create a detailed prompt for the AI
    const prompt = `You are a product search expert for a caffeine products database. Analyze this search query: "${query}"

Available products with their details:
${products.map(p => `
Product: ${p.name}
Brand: ${p.brand}
Description: ${p.description}
Caffeine: ${p.caffeine_content}mg
Sugar: ${p.sugar_content}g
Calories: ${p.calories}
Certifications: ${p.certifications?.join(', ') || 'None'}
`).join('\n')}

Consider these search patterns:
1. Sugar content queries:
   - "sugar free", "no sugar", "zero sugar" → products with 0g sugar
   - "low sugar", "less sugar" → products with ≤5g sugar
   - "high sugar", "sweet", "sweetest" → products with highest sugar content

2. Caffeine content queries:
   - "low caffeine", "less caffeine" → products with ≤80mg caffeine
   - "high caffeine", "strong", "strongest" → products with ≥160mg caffeine

3. Health-focused queries:
   - "healthy", "health-conscious" → low sugar (≤5g), low calories (≤10), natural/organic certifications
   - "natural", "organic" → products with relevant certifications

4. Brand or name matches:
   - Direct matches in product names or brands
   - Semantic matches (e.g., "energy drink" matches products in that category)

Return only the names of the 5 most relevant products, one per line, ordered by relevance.
If no exact matches, use semantic understanding to find the closest matches.`

    try {
      // Call Deepseek API
      const response = await fetch('https://api.deepseek.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-0d195f3e22794b53a4b5d23fb4558fe1'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a product search expert. Analyze queries carefully and return only product names that best match the search criteria, considering both explicit and implicit requirements.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 150
        })
      })

      if (!response.ok) {
        console.error('Deepseek API error:', await response.text())
        // Fallback to basic search
        return performBasicSearch(products, query.toLowerCase())
      }

      const result = await response.json()
      const recommendedNames = result.choices[0].message.content
        .split('\n')
        .filter(line => line.trim())
        .map(name => name.replace(/^[0-9.-\s]+/, '').trim())

      // Get the full product details for recommended products
      const results = products
        .filter(p => recommendedNames.includes(p.name))
        .slice(0, 5)

      // If AI returns no results, fallback to basic search
      if (results.length === 0) {
        return performBasicSearch(products, query.toLowerCase())
      }

      return results

    } catch (error) {
      console.error('AI search error:', error)
      return performBasicSearch(products, query.toLowerCase())
    }
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
})

// Basic search function for fallback
function performBasicSearch(products: any[], query: string) {
  // Direct matches first
  const directMatches = products.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.brand.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  )

  if (directMatches.length > 0) {
    return directMatches.slice(0, 5)
  }

  // Keyword-based search
  const keywordResults = products.filter(product => {
    const {
      sugar_content = 0,
      caffeine_content = 0,
      calories = 0,
      certifications = []
    } = product

    // Sugar-related queries
    if (query.includes('sweet') || query.includes('sugar')) {
      if (query.match(/sugar[\s-]?free|no sugar|zero sugar|without sugar/)) {
        return sugar_content === 0
      }
      if (query.match(/low sugar|less sugar|reduced sugar/)) {
        return sugar_content <= 5
      }
      if (query.includes('sweetest') || query.includes('most sugar')) {
        return sugar_content >= 20
      }
      return sugar_content > 15
    }

    // Caffeine-related queries
    if (query.includes('strong') || query.includes('caffeine')) {
      if (query.match(/low caffeine|less caffeine|mild/)) {
        return caffeine_content <= 80
      }
      if (query.match(/strongest|most caffeine|high caffeine/)) {
        return caffeine_content >= 160
      }
      return caffeine_content >= 140
    }

    // Health-related queries
    if (query.match(/healthy|health|wellness/)) {
      return (
        sugar_content <= 5 && 
        calories <= 10 && 
        certifications?.some(c => 
          ['organic', 'natural', 'vitamin'].some(term => 
            c.toLowerCase().includes(term)
          )
        )
      )
    }

    // Certification queries
    if (query.includes('organic')) {
      return certifications?.some(c => 
        c.toLowerCase().includes('organic')
      )
    }

    if (query.includes('natural')) {
      return certifications?.some(c => 
        c.toLowerCase().includes('natural')
      )
    }

    return false
  })

  // Sort results appropriately
  if (keywordResults.length > 0) {
    if (query.includes('sweet') || query.includes('sugar')) {
      keywordResults.sort((a, b) => b.sugar_content - a.sugar_content)
    } else if (query.includes('strong') || query.includes('caffeine')) {
      keywordResults.sort((a, b) => b.caffeine_content - a.caffeine_content)
    }
  }

  return keywordResults.slice(0, 5)
}
