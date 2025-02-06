import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug
  const client = await serverSupabaseClient(event)
  
  // First get the current product
  const { data: product } = await client
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) {
    throw createError({
      statusCode: 404,
      message: 'Product not found'
    })
  }

  // Get all products except the current one
  const { data: allProducts } = await client
    .from('products')
    .select('*')
    .neq('id', product.id)

  if (!allProducts) return []

  // Create prompt for the AI
  const prompt = `Given a caffeine product with the following details:
Name: ${product.name}
Brand: ${product.brand}
Description: ${product.description}
Caffeine Content: ${product.caffeine_content}mg
Category: ${product.category_id}

Please analyze these similar products and rank them by relevance (most similar first):
${allProducts.map(p => `
- Name: ${p.name}
  Brand: ${p.brand}
  Description: ${p.description}
  Caffeine Content: ${p.caffeine_content}mg
  Category: ${p.category_id}`).join('\n')}

Return only the top 3 most relevant product names, considering factors like:
1. Similar caffeine content
2. Similar category
3. Similar brand style
4. Complementary product types

Format your response as a simple list with just the names, one per line.`

  try {
    // Call Deepseek API
    const response = await fetch('https://api.deepseek.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || 'sk-b70b1b18d3fa4bfa9cc125e673181881'}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a product recommendation system. Respond only with product names, one per line.'
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
      // Fallback to simple recommendations if AI fails
      return allProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
    }

    const result = await response.json()
    const recommendations = result.choices[0].message.content
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3)
      .map(name => name.replace(/^[0-9.-\s]+/, '').trim())

    // Get the recommended products' details
    const { data: recommendedProducts } = await client
      .from('products')
      .select('*')
      .in('name', recommendations)

    // If no AI recommendations found, fallback to random products
    if (!recommendedProducts?.length) {
      return allProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
    }

    return recommendedProducts
  } catch (error) {
    console.error('Error getting recommendations:', error)
    // Fallback to random recommendations on error
    return allProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
  }
})
