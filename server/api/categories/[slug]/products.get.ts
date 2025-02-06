import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug
  const client = await serverSupabaseClient(event)
  
  // First get the category id
  const { data: category } = await client
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!category) {
    throw createError({
      statusCode: 404,
      message: 'Category not found'
    })
  }

  // Then get all products in that category
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }

  return data
})
