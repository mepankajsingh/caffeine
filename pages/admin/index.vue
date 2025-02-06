<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">Admin Dashboard</h1>
          <p class="mt-1 text-gray-500">Manage your products and categories</p>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            @click="refreshData" 
            class="text-gray-600 hover:text-gray-900"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Products Card -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Products</h2>
            <p class="text-sm text-gray-500 mt-1">{{ products?.length || 0 }} total products</p>
          </div>
          <NuxtLink
            to="/admin/products"
            class="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:text-gray-600"
          >
            Manage →
          </NuxtLink>
        </div>

        <!-- Recent Products -->
        <div class="space-y-4">
          <div v-for="product in recentProducts" :key="product.id" class="flex items-center space-x-4">
            <img 
              :src="product.image_url" 
              :alt="product.name"
              class="w-12 h-12 rounded object-cover flex-shrink-0"
            >
            <div class="min-w-0 flex-1">
              <h3 class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</h3>
              <div class="flex items-center text-sm text-gray-500">
                <span>${{ product.price }}</span>
                <span class="mx-2">•</span>
                <span>{{ product.caffeine_content }}mg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Card -->
      <div class="bg-white border border-gray-200 rounded-lg p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Categories</h2>
            <p class="text-sm text-gray-500 mt-1">{{ categories?.length || 0 }} total categories</p>
          </div>
          <NuxtLink
            to="/admin/categories"
            class="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:text-gray-600"
          >
            Manage →
          </NuxtLink>
        </div>

        <!-- Categories List -->
        <div class="space-y-3">
          <div 
            v-for="category in categories" 
            :key="category.id" 
            class="flex justify-between items-center p-3 bg-gray-50 rounded"
          >
            <div>
              <h3 class="text-sm font-medium text-gray-900">{{ category.name }}</h3>
              <p class="text-xs text-gray-500">{{ getProductCount(category.id) }} products</p>
            </div>
            <NuxtLink
              :to="`/categories/${category.slug}`"
              class="text-sm text-gray-600 hover:text-gray-900"
            >
              View →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()

// Fetch data with refresh capability
const { data: products, refresh: refreshProducts } = await useFetch('/api/products', {
  key: 'admin-products',
  watch: false // Prevent auto-refresh on route changes
})
const { data: categories, refresh: refreshCategories } = await useFetch('/api/categories', {
  key: 'admin-categories',
  watch: false // Prevent auto-refresh on route changes
})

// Get 5 most recent products
const recentProducts = computed(() => {
  if (!products.value) return []
  return [...products.value]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
})

// Get product count for a category
const getProductCount = (categoryId) => {
  if (!products.value) return 0
  return products.value.filter(p => p.category_id === categoryId).length
}

// Refresh all data
const refreshData = async () => {
  await Promise.all([
    refreshProducts(),
    refreshCategories()
  ])
}

// Set up real-time subscriptions
onMounted(() => {
  // Subscribe to products changes
  const productsSubscription = client
    .channel('products_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'products' },
      () => refreshProducts()
    )
    .subscribe()

  // Subscribe to categories changes
  const categoriesSubscription = client
    .channel('categories_changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'categories' },
      () => refreshCategories()
    )
    .subscribe()

  // Initial data load
  refreshData()

  // Cleanup subscriptions
  onUnmounted(() => {
    productsSubscription.unsubscribe()
    categoriesSubscription.unsubscribe()
  })
})
</script>
