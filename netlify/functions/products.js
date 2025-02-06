const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  'https://vigifbomwvywkyffzlvl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZ2lmYm9td3Z5d2t5ZmZ6bHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTUwMDMsImV4cCI6MjA1MzU3MTAwM30.ihr8oafs0iXoonQcGLk2U9ujmob4aYBACXVe8jJyP9I'
)

exports.handler = async (event) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(data)
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: error.message })
    }
  }
}
