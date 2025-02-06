<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
    <div v-if="pending" class="py-4 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    <div v-else-if="error" class="py-4 text-center text-red-600">
      Error loading categories
    </div>
    <div v-else class="space-y-2">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/categories/${category.slug}`"
        class="block px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-blue-600"
      >
        {{ category.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { data: categories, pending, error } = await useFetch('/api/categories')
</script>
