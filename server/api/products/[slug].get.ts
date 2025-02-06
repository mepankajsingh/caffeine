import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug
  const client = await serverSupabaseClient(event)
  
  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }

  return data
})
