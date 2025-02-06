<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-5xl mx-auto px-4 py-16">
        <div class="max-w-2xl">
          <h1 class="text-4xl font-medium text-gray-900">
            The Caffeine <br/>Database
          </h1>
          <p class="mt-4 text-lg text-gray-500">
            Compare caffeine content across products
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-12">
      <!-- Featured Product -->
      <div v-if="featuredProduct" class="mb-16">
        <div class="bg-white rounded-lg border border-gray-100">
          <div class="md:flex">
            <div class="md:w-1/3">
              <img 
                :src="featuredProduct.image_url" 
                :alt="featuredProduct.name"
                class="w-full h-[300px] object-cover"
              >
            </div>
            <div class="md:w-2/3 p-8">
              <div class="flex items-start justify-between">
                <div>
                  <h2 class="text-2xl font-medium text-gray-900">{{ featuredProduct.name }}</h2>
                  <p class="text-gray-500 mt-1">{{ featuredProduct.brand }}</p>
                </div>
                <div class="text-4xl font-medium tabular-nums">
                  {{ calculateCaffeinePer100ml(featuredProduct.caffeine_content, featuredProduct.serving_size) }}<span class="text-base text-gray-500">mg</span><span class="text-base text-gray-500">/{{ currentUnit === 'ml' ? '100ml' : '12 fl oz' }}</span>
                </div>
              </div>
              
              <p class="text-gray-600 mt-4 line-clamp-2">{{ featuredProduct.description }}</p>
              
              <div class="mt-6 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <span class="text-xl font-medium text-gray-900">${{ featuredProduct.price }}</span>
                  <span class="text-gray-500">{{ formatVolume(featuredProduct.serving_size) }}</span>
                </div>
                <NuxtLink 
                  :to="`/products/${featuredProduct.slug}`"
                  class="text-gray-900 hover:text-gray-600 font-medium"
                >
                  View Details →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest Products -->
      <div>
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-medium text-gray-900">Latest Additions</h2>
          <NuxtLink 
            to="/products" 
            class="text-gray-900 hover:text-gray-600 text-sm font-medium"
          >
            View all →
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <div 
            v-for="product in latestProducts" 
            :key="product.id" 
            class="bg-white border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <NuxtLink :to="`/products/${product.slug}`" class="flex p-4">
              <img 
                :src="product.image_url" 
                :alt="product.name"
                class="w-16 h-20 object-cover"
              >
              <div class="ml-4 flex-grow min-w-0">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-gray-900 font-medium truncate">{{ product.name }}</h3>
                    <p class="text-gray-500 text-sm">{{ product.brand }}</p>
                  </div>
                  <div class="text-xl font-medium tabular-nums">
                    {{ calculateCaffeinePer100ml(product.caffeine_content, product.serving_size) }}<span class="text-sm text-gray-500">mg</span><span class="text-sm text-gray-500">/{{ currentUnit === 'ml' ? '100ml' : '12 fl oz' }}</span>
                  </div>
                </div>
                <p class="text-gray-600 text-sm mt-2 line-clamp-1">{{ product.description }}</p>
                <div class="mt-2 flex items-center text-sm">
                  <span class="text-gray-900 font-medium">${{ product.price }}</span>
                  <span class="text-gray-300 mx-2">•</span>
                  <span class="text-gray-500">{{ formatDate(product.created_at) }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="mt-16">
        <h2 class="text-xl font-medium text-gray-900 mb-8">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink 
            v-for="category in categories" 
            :key="category.id"
            :to="`/categories/${category.slug}`"
            class="bg-white p-4 border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <h3 class="text-gray-900 font-medium">{{ category.name }}</h3>
            <p class="text-gray-500 text-sm mt-1">
              {{ getCategoryProductCount(category.id) }} products
            </p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: categories } = await useFetch('/api/categories')
const { data: products } = await useFetch('/api/products')
const { currentUnit, formatVolume, calculateCaffeinePer100ml } = useUnits()

// Get a random product as featured
const featuredProduct = computed(() => {
  if (!products.value?.length) return null
  return products.value[0]
})

// Get latest 5 products
const latestProducts = computed(() => {
  if (!products.value) return []
  return [...products.value]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
})

const getCategoryProductCount = (categoryId) => {
  if (!products.value) return 0
  return products.value.filter(p => p.category_id === categoryId).length
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(date)
}

useHead({
  title: 'Caffeine DB - The Caffeine Database',
  meta: [
    {
      name: 'description',
      content: 'Discover and compare caffeine products with detailed information about caffeine content, serving sizes, and more.'
    }
  ]
})
</script>
