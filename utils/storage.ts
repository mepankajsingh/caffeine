export const uploadImage = async (file: File): Promise<string> => {
  try {
    const client = useSupabaseClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `products/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await client.storage
      .from('products')
      .upload(filePath, file)

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = client.storage
      .from('products')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}
