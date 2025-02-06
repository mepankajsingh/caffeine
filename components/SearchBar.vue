<template>
  <div ref="searchContainer" class="search-container relative w-full">
    <!-- Search Input -->
    <div class="relative">
      <MagnifyingGlassIcon 
        class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
        aria-hidden="true" 
      />
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        @focus="showResults = true"
        placeholder="Search products (e.g., 'sweetest energy drink')"
        class="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#da552f] focus:ring-[#da552f]"
      />
      <div v-if="isLoading" class="absolute right-3 top-2.5">
        <div class="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#da552f]"></div>
      </div>
    </div>

    <!-- Search Results -->
    <div 
      v-show="showResults && searchQuery"
      class="absolute mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <!-- Loading State -->
      <div v-if="isLoading" class="p-4 text-center">
        <p class="text-sm text-gray-500">Searching...</p>
      </div>

      <!-- No Results -->
      <div v-else-if="!isLoading && searchResults.length === 0" class="p-4 text-center">
        <p class="text-sm text-gray-500">No products found matching your search</p>
      </div>

      <!-- Results List -->
      <div v-else-if="searchResults.length > 0" class="p-2">
        <NuxtLink
          v-for="product in searchResults"
          :key="product.id"
          :to="`/products/${product.slug}`"
          class="group flex items-center space-x-4 rounded-lg p-3 hover:bg-gray-50"
          @click="showResults = false"
        >
          <img 
            :src="product.image_url" 
            :alt="product.name"
            class="h-12 w-12 flex-shrink-0 rounded object-cover"
          >
          <div class="min-w-0 flex-1">
            <p class="font-medium text-gray-900 group-hover:text-[#da552f]">
              {{ product.name }}
            </p>
            <p class="text-sm text-gray-500">{{ product.brand }}</p>
          </div>
          <div class="text-right text-sm">
            <p class="tabular-nums font-medium text-gray-900">${{ product.price }}</p>
            <p class="text-gray-500">{{ product.caffeine_content }}mg</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import debounce from 'lodash/debounce'

const searchQuery = ref('')
const searchResults = ref([])
const isLoading = ref(false)
const showResults = ref(false)
const searchContainer = ref(null)

// Create debounced search function
const debouncedSearch = debounce(async (query) => {
  if (!query.trim()) {
    searchResults.value = []
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    searchResults.value = []
    
    const client = useSupabaseClient()
    
    // Get all products first
    const { data: products, error: dbError } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('Database error:', dbError)
      return
    }

    if (!products?.length) {
      return
    }

    // Direct matches first
    const directMatches = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    )

    if (directMatches.length > 0) {
      searchResults.value = directMatches.slice(0, 5)
      return
    }

    // Keyword-based search
    const keywordResults = products.filter(product => {
      const {
        sugar_content = 0,
        caffeine_content = 0,
        calories = 0,
        certifications = []
      } = product

      const q = query.toLowerCase()

      // Sugar-related queries
      if (q.includes('sweet') || q.includes('sugar')) {
        // Sugar-free variations
        if (q.includes('sugar free') || q.includes('no sugar') || q.includes('sugarfree')) {
          return sugar_content === 0
        }
        // Low sugar variations
        if (q.includes('low sugar') || q.includes('less sugar')) {
          return sugar_content <= 5
        }
        // High sugar / sweetest variations
        if (q.includes('sweetest') || q.includes('most sugar')) {
          return sugar_content >= 20
        }
        return sugar_content > 15
      }

      // Caffeine-related queries
      if (q.includes('strong') || q.includes('caffeine')) {
        if (q.includes('low caffeine') || q.includes('less caffeine')) {
          return caffeine_content <= 80
        }
        if (q.includes('strongest') || q.includes('most caffeine')) {
          return caffeine_content >= 160
        }
        return caffeine_content >= 140
      }

      // Health-related queries
      if (q.includes('healthy') || q.includes('health')) {
        return (
          sugar_content <= 5 && 
          calories <= 10 && 
          certifications?.some(c => 
            ['organic', 'natural', 'vitamin-enriched'].includes(c.toLowerCase())
          )
        )
      }

      // Certification queries
      if (q.includes('organic')) {
        return certifications?.some(c => 
          c.toLowerCase().includes('organic')
        )
      }

      if (q.includes('natural')) {
        return certifications?.some(c => 
          c.toLowerCase().includes('natural')
        )
      }

      return false
    })

    if (keywordResults.length > 0) {
      // Sort results appropriately
      if (query.includes('sweet') || query.includes('sugar')) {
        keywordResults.sort((a, b) => b.sugar_content - a.sugar_content)
      } else if (query.includes('strong') || query.includes('caffeine')) {
        keywordResults.sort((a, b) => b.caffeine_content - a.caffeine_content)
      }

      searchResults.value = keywordResults.slice(0, 5)
    }
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}, 300)

// Handle search input
const handleSearch = () => {
  debouncedSearch(searchQuery.value)
}

// Handle click outside to close results
const handleClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})
</script>
