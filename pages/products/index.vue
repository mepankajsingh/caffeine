<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-3xl font-medium text-gray-900">All Products</h1>
      <p class="mt-2 text-lg text-gray-500">Compare caffeine content across products</p>
    </div>

    <!-- Filters -->
    <div class="mb-8 flex flex-wrap items-center gap-4">
      <!-- Categories -->
      <div class="flex items-center space-x-2 overflow-x-auto pb-2">
        <button 
          @click="selectedCategory = null"
          :class="[
            'px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
            !selectedCategory 
              ? 'text-gray-900 bg-gray-100' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          All Products
        </button>
        <button 
          v-for="category in categories" 
          :key="category.id"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
            selectedCategory?.id === category.id
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          {{ category?.name }}
        </button>
      </div>

      <!-- Sort -->
      <div class="flex-grow"></div>
      <select
        v-model="sortBy"
        class="px-4 py-2 bg-white border border-gray-200 rounded text-sm text-gray-700"
      >
        <option value="caffeine-desc">Most Caffeine</option>
        <option value="caffeine-asc">Least Caffeine</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest First</option>
      </select>
    </div>

    <!-- Products List -->
    <div v-if="sortedProducts && sortedProducts.length > 0" class="space-y-3">
      <div 
        v-for="product in sortedProducts" 
        :key="product.id" 
        class="bg-white border border-gray-100 hover:border-gray-200 transition-colors"
      >
        <NuxtLink :to="`/products/${product.slug}`" class="flex p-6">
          <img 
            :src="product.image_url" 
            :alt="product.name"
            class="w-20 h-24 object-cover"
          >
          <div class="ml-6 flex-grow min-w-0">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
                <p class="text-gray-500">{{ product.brand }}</p>
              </div>
              <div class="text-right">
                <div class="text-3xl font-medium tabular-nums">
                  {{ calculateCaffeinePer100ml(product.caffeine_content, product.serving_size) }}<span class="text-sm text-gray-500">mg</span><span class="text-sm text-gray-500">/{{ currentUnit === 'ml' ? '100ml' : '12 fl oz' }}</span>
                </div>
                <div class="text-sm text-gray-500">
                  {{ product.caffeine_content }}mg per serving
                </div>
              </div>
            </div>
            <p class="text-gray-600 mt-2 line-clamp-2">{{ product.description }}</p>
            <div class="mt-4 flex items-center space-x-4">
              <span class="text-gray-900 font-medium">${{ product.price }}</span>
              <span class="text-gray-500">{{ formatVolume(product.serving_size) }}</span>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="cert in product.certifications?.slice(0, 2)" 
                  :key="cert"
                  class="px-2 py-1 bg-gray-100 text-xs text-gray-600"
                >
                  {{ cert }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-else
      class="text-center py-16 bg-white border border-gray-100"
    >
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No products found</h3>
      <p class="mt-2 text-gray-500">
        {{ selectedCategory 
          ? `No products available in ${selectedCategory.name}` 
          : 'No products available' }}
      </p>
    </div>
  </div>
</template>

<script setup>
const { data: products } = await useFetch('/api/products')
const { data: categories } = await useFetch('/api/categories')
const { currentUnit, formatVolume, calculateCaffeinePer100ml } = useUnits()

const selectedCategory = ref(null)
const sortBy = ref('caffeine-desc') // Default sort by caffeine content

const sortedProducts = computed(() => {
  let filteredProducts = products.value || []

  // Apply category filter
  if (selectedCategory.value) {
    filteredProducts = filteredProducts.filter(
      p => p.category_id === selectedCategory.value.id
    )
  }

  // Apply sorting
  return [...filteredProducts].sort((a, b) => {
    switch (sortBy.value) {
      case 'caffeine-desc':
        return b.caffeine_content - a.caffeine_content
      case 'caffeine-asc':
        return a.caffeine_content - b.caffeine_content
      case 'price-asc':
        return parseFloat(a.price) - parseFloat(b.price)
      case 'price-desc':
        return parseFloat(b.price) - parseFloat(a.price)
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at)
      default:
        return 0
    }
  })
})

useHead({
  title: 'All Products - Caffeine Store',
  meta: [
    {
      name: 'description',
      content: 'Browse our complete collection of premium caffeine products.'
    }
  ]
})
</script>
