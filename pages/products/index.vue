<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <div class="flex">
      <!-- Filters Sidebar -->
      <aside class="w-1/4 pr-8">
        <div class="bg-white rounded-lg border border-gray-100 p-6 mb-8">
          <h2 class="text-xl font-medium text-gray-900 mb-4">Filters</h2>

          <!-- Price Range -->
          <div class="mb-6">
            <h3 class="text-base font-medium text-gray-900 mb-2">Price Range</h3>
            <input
              type="range"
              v-model="priceRange"
              min="0"
              max="10"
              step="0.5"
              class="w-full"
            />
            <div class="flex justify-between text-sm text-gray-500">
              <span>$0</span>
              <span>${{ priceRange }}</span>
            </div>
          </div>

          <!-- Caffeine Content -->
          <div class="mb-6">
            <h3 class="text-base font-medium text-gray-900 mb-2">Caffeine (mg)</h3>
            <input
              type="range"
              v-model="caffeineLevel"
              min="0"
              max="200"
              step="10"
              class="w-full"
            />
            <div class="flex justify-between text-sm text-gray-500">
              <span>0mg</span>
              <span>{{ caffeineLevel }}mg</span>
            </div>
          </div>

          <!-- Categories -->
          <div class="mb-6">
            <h3 class="text-base font-medium text-gray-900 mb-2">Categories</h3>
            <div class="space-y-2">
              <label class="flex items-center text-sm">
                <input type="checkbox" value="" @change="selectedCategory = null" :checked="!selectedCategory" class="mr-2 rounded border-gray-300 focus:ring-[#da552f]">
                All Products
              </label>
              <label v-for="category in categories" :key="category.id" class="flex items-center text-sm">
                <input type="checkbox" :value="category" @change="selectedCategory = category" :checked="selectedCategory?.id === category.id" class="mr-2 rounded border-gray-300 focus:ring-[#da552f]">
                {{ category.name }}
              </label>
            </div>
          </div>

          <!-- Brand -->
          <div class="mb-6">
            <h3 class="text-base font-medium text-gray-900 mb-2">Brand</h3>
            <select v-model="selectedBrand" class="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-[#da552f] focus:ring-[#da552f]">
              <option value="">All Brands</option>
              <option v-for="brand in uniqueBrands" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </div>

          <!-- Serving Size -->
          <div class="mb-6">
            <h3 class="text-base font-medium text-gray-900 mb-2">Serving Size</h3>
            <select v-model="selectedServingSize" class="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-[#da552f] focus:ring-[#da552f]">
              <option value="">All Sizes</option>
              <option v-for="size in uniqueServingSizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>

          <!-- Packaging Type -->
          <div class="mb-6">
            <h3 class="text-base font-medium text-gray-900 mb-2">Packaging Type</h3>
            <select v-model="selectedPackagingType" class="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-[#da552f] focus:ring-[#da552f]">
              <option value="">All Types</option>
              <option v-for="type in uniquePackagingTypes" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>

          <!-- Sugar Content -->
          <div class="mb-6">
            <h3 class="text-base font-medium text-gray-900 mb-2">Sugar Content</h3>
            <select v-model="selectedSugarContent" class="w-full border border-gray-300 rounded-md p-2 text-sm focus:border-[#da552f] focus:ring-[#da552f]">
              <option value="">Any</option>
              <option value="sugar-free">Sugar-Free</option>
            </select>
          </div>

          <!-- Calories -->
          <div class="mb-6">
            <h3 class="text-base font-medium text-gray-900 mb-2">Calories</h3>
            <input
              type="range"
              v-model="calorieLevel"
              min="0"
              max="300"
              step="10"
              class="w-full"
            />
            <div class="flex justify-between text-sm text-gray-500">
              <span>0</span>
              <span>{{ calorieLevel }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Products List -->
      <div class="w-3/4">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-3xl font-medium text-gray-900">All Products</h1>
          <p class="mt-2 text-lg text-gray-500">Compare caffeine content across products</p>
        </div>

        <!-- Sort -->
        <div class="mb-8 flex items-center">
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

        <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id" 
            class="bg-white border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <NuxtLink :to="`/products/${product.slug}`" class="block">
              <img 
                :src="product.image_url" 
                :alt="product.name"
                class="w-full h-48 object-cover"
              >
              <div class="p-4">
                <h2 class="text-xl font-medium text-gray-900">{{ product.name }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ product.brand }}</p>
                <p class="text-gray-600 mt-2 line-clamp-2">{{ product.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-gray-900 font-medium">${{ product.price }}</span>
                  <span class="text-sm text-gray-500">{{ product.caffeine_content }}mg caffeine</span>
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
            No products match your selected filters.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: products } = await useFetch('/api/products')
const { data: categories } = await useFetch('/api/categories')

const selectedCategory = ref(null)
const sortBy = ref('caffeine-desc')

// Filter variables
const priceRange = ref(10)
const caffeineLevel = ref(200)
const calorieLevel = ref(300)
const selectedBrand = ref('')
const selectedServingSize = ref('')
const selectedPackagingType = ref('')
const selectedSugarContent = ref('')

// Computed properties for unique filter options
const uniqueBrands = computed(() => {
  if (!products.value) return []
  return [...new Set(products.value.map(p => p.brand))]
})

const uniqueServingSizes = computed(() => {
  if (!products.value) return []
  return [...new Set(products.value.map(p => p.serving_size))]
})

const uniquePackagingTypes = computed(() => {
  if (!products.value) return []
  return [...new Set(products.value.map(p => p.packaging_type))]
})

const filteredProducts = computed(() => {
  if (!products.value) return []

  let filtered = [...products.value]

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category_id === selectedCategory.value.id)
  }

  // Price filter
  filtered = filtered.filter(p => parseFloat(p.price) <= priceRange.value)

  // Caffeine filter
  filtered = filtered.filter(p => p.caffeine_content <= caffeineLevel.value)

  // Calorie filter
  filtered = filtered.filter(p => p.calories <= calorieLevel.value)

  // Brand filter
  if (selectedBrand.value) {
    filtered = filtered.filter(p => p.brand === selectedBrand.value)
  }

  // Serving Size filter
  if (selectedServingSize.value) {
    filtered = filtered.filter(p => p.serving_size === selectedServingSize.value)
  }

  // Packaging Type filter
  if (selectedPackagingType.value) {
    filtered = filtered.filter(p => p.packaging_type === selectedPackagingType.value)
  }

  // Sugar Content filter
  if (selectedSugarContent.value === 'sugar-free') {
    filtered = filtered.filter(p => p.sugar_content === 0)
  }

  // Sorting
  return [...filtered].sort((a, b) => {
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
