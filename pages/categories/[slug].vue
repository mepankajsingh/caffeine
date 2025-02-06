<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-3xl font-medium text-gray-900">{{ category?.name }}</h1>
      <p class="mt-2 text-lg text-gray-500">Explore our selection of caffeine products in this category</p>
    </div>

    <!-- Products List -->
    <div v-if="products && products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="product in products" 
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
        No products available in this category.
      </p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: category } = await useFetch(`/api/categories/${route.params.slug}`)
const { data: products } = await useFetch(`/api/categories/${route.params.slug}/products`)

useHead({
  title: `${category.value?.name} - Caffeine Store`,
  meta: [
    {
      name: 'description',
      content: `Browse our selection of ${category.value?.name?.toLowerCase()} products.`
    }
  ]
})
</script>
