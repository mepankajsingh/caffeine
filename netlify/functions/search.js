const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  'https://vigifbomwvywkyffzlvl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZ2lmYm9td3Z5d2t5ZmZ6bHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTUwMDMsImV4cCI6MjA1MzU3MTAwM30.ihr8oafs0iXoonQcGLk2U9ujmob4aYBACXVe8jJyP9I'
)

// Basic search function for fallback
function performBasicSearch(products, query) {
  // Direct matches
  const directMatches = products.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.brand.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  )

  if (directMatches.length > 0) {
    return directMatches.slice(0, 5)
  }

  // Keyword-based search
  return products.filter(product => {
    const {
      sugar_content = 0,
      caffeine_content = 0,
      calories = 0,
      certifications = []
    } = product

    if (query.includes('sweet') || query.includes('sugar')) {
      if (query.includes('sugar free')) return sugar_content === 0
      if (query.includes('low sugar')) return sugar_content <= 5
      if (query.includes('sweetest')) return sugar_content >= 20
      return sugar_content > 15
    }

    if (query.includes('strong') || query.includes('caffeine')) {
      if (query.includes('low caffeine')) return caffeine_content <= 80
      if (query.includes('strongest')) return caffeine_content >= 160
      return caffeine_content >= 140
    }

    if (query.includes('healthy')) {
      return (
        sugar_content <= 5 && 
        calories <= 10 && 
        certifications.some(c => 
          ['organic', 'natural', 'vitamin-enriched'].includes(c.toLowerCase())
        )
      )
    }

    if (query.includes('organic')) {
      return certifications.includes('Organic')
    }

    if (query.includes('natural')) {
      return certifications.some(c => 
        ['Natural Flavors', 'Natural Caffeine'].includes(c)
      )
    }

    return false
  }).slice(0, 5)
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { query } = JSON.parse(event.body)
    
    if (!query?.trim()) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify([])
      }
    }

    // Get all products
    const { data: allProducts, error: dbError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('Database error:', dbError)
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ error: 'Failed to fetch products' })
      }
    }

    // Create prompt for the AI
    const prompt = `Given a search query "${query}" for a caffeine products database, analyze these products and rank them by relevance. Consider factors like name matches, description relevance, and semantic similarity:

${allProducts.map(p => `
Name: ${p.name}
Brand: ${p.brand}
Description: ${p.description}
Caffeine: ${p.caffeine_content}mg
Sugar: ${p.sugar_content}g
Price: $${p.price}
`).join('\n')}

Return only the names of the 5 most relevant products, one per line.`

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
              content: 'You are a product search system. Analyze the query intent and return only product names that best match the search criteria, one per line.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 100
        })
      })

      if (!response.ok) {
        console.error('Deepseek API error:', await response.text())
        // Fallback to basic search if AI fails
        const results = performBasicSearch(allProducts, query.toLowerCase())
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
          body: JSON.stringify(results)
        }
      }

      const result = await response.json()
      const recommendedNames = result.choices[0].message.content
        .split('\n')
        .filter(line => line.trim())
        .map(name => name.replace(/^[0-9.-\s]+/, '').trim())

      // Get the full product details for recommended products
      const results = allProducts
        .filter(p => recommendedNames.includes(p.name))
        .slice(0, 5)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify(results)
      }

    } catch (error) {
      console.error('AI search error:', error)
      // Fallback to basic search
      const results = performBasicSearch(allProducts, query.toLowerCase())
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify(results)
      }
    }
  } catch (error) {
    console.error('Search error:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Search failed' })
    }
  }
}
