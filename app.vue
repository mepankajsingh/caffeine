<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex h-14 items-center justify-between">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-xl font-medium text-gray-900">Caffeine</span>
              <span class="text-xl font-medium text-gray-400">DB</span>
            </NuxtLink>
            <NuxtLink 
              to="/products" 
              class="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Browse
            </NuxtLink>
            <NuxtLink 
              to="/admin" 
              class="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Admin
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-6 flex-1 max-w-lg ml-8">
            <ClientOnly>
              <SearchBar />
            </ClientOnly>
          </div>
          
          <!-- Unit Toggle -->
          <button 
            @click="toggleUnit"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 ml-6"
          >
            Show in {{ currentUnit === 'ml' ? 'fl oz' : 'ml' }}
          </button>
        </div>
      </div>
    </nav>

    <main>
      <NuxtPage />
    </main>

    <footer class="bg-white border-t border-gray-100 mt-20">
      <div class="max-w-5xl mx-auto py-8 px-4">
        <div class="text-center text-gray-400 text-sm">
          © {{ new Date().getFullYear() }} CaffeineDB. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { currentUnit, toggleUnit } = useUnits()
</script>
