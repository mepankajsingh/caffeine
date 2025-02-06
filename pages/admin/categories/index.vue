<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="bg-white">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Manage Categories</h1>
          <p class="mt-1 text-gray-600">{{ categories?.length || 0 }} categories available</p>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            @click="refreshData" 
            class="text-gray-600 hover:text-[#da552f]"
          >
            Refresh
          </button>
          <button
            @click="showAddForm = true"
            class="px-4 py-2 bg-[#da552f] text-white rounded-lg hover:bg-[#c73f1d]"
          >
            <PlusIcon class="w-5 h-5 mr-2 inline-block" />
            Add Category
          </button>
        </div>
      </div>

      <!-- Categories List -->
      <div class="space-y-4">
        <div 
          v-for="category in categories" 
          :key="category.id" 
          class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
              <p class="text-sm text-gray-500">{{ category.slug }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                {{ getProductCount(category.id) }} products
              </span>
              <button
                @click="editCategory(category)"
                class="text-gray-600 hover:text-[#da552f]"
              >
                <PencilIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Form Modal -->
      <Dialog :open="showAddForm" @close="closeForm" class="relative z-50">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="bg-white rounded-xl p-8 max-w-md w-full">
            <div class="flex justify-between items-center mb-6">
              <DialogTitle class="text-2xl font-bold">{{ editingCategory ? 'Edit' : 'Add' }} Category</DialogTitle>
              <button @click="closeForm" class="text-gray-500 hover:text-gray-700">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#da552f] focus:ring-[#da552f]"
                />
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  @click="closeForm"
                  class="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-[#da552f] text-white rounded-lg hover:bg-[#c73f1d] disabled:opacity-50"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Saving...' : 'Save Category' }}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { PlusIcon, PencilIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const client = useSupabaseClient()
const showAddForm = ref(false)
const isSubmitting = ref(false)
const editingCategory = ref(null)

const form = ref({
  name: ''
})

// Fetch data with refresh capability
const { data: categories, refresh: refreshCategories } = await useFetch('/api/categories', {
  key: 'admin-categories',
  watch: false
})
const { data: products, refresh: refreshProducts } = await useFetch('/api/products', {
  key: 'admin-products',
  watch: false
})

const editCategory = (category) => {
  editingCategory.value = category
  form.value = {
    name: category.name
  }
  showAddForm.value = true
}

const closeForm = () => {
  showAddForm.value = false
  editingCategory.value = null
  form.value = { name: '' }
}

// Get product count for a category
const getProductCount = (categoryId) => {
  if (!products.value) return 0
  return products.value.filter(p => p.category_id === categoryId).length
}

// Refresh all data
const refreshData = async () => {
  await Promise.all([
    refreshCategories(),
    refreshProducts()
  ])
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const client = useSupabaseClient()

    // Create slug from name
    const slug = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    if (editingCategory.value) {
      // Update existing category
      const { error } = await client
        .from('categories')
        .update({ name: form.value.name, slug })
        .eq('id', editingCategory.value.id)

      if (error) throw error
    } else {
      // Create new category
      const { error } = await client
        .from('categories')
        .insert({ name: form.value.name, slug })

      if (error) throw error
    }

    // Refresh categories list
    await refreshData()

    // Reset form and close modal
    closeForm()
  } catch (error) {
    console.error('Error saving category:', error)
    alert('Error saving category. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Set up real-time subscriptions
onMounted(() => {
  // Subscribe to categories changes
  const categoriesSubscription = client
    .channel('categories_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'categories' },
      () => refreshCategories()
    )
    .subscribe()

  // Subscribe to products changes (for product count)
  const productsSubscription = client
    .channel('products_changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => refreshProducts()
    )
    .subscribe()

  // Initial data load
  refreshData()

  // Cleanup subscriptions
  onUnmounted(() => {
    categoriesSubscription.unsubscribe()
    productsSubscription.unsubscribe()
  })
})
</script>
