<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div class="bg-white">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Manage Products</h1>
          <p class="mt-1 text-gray-600">{{ products?.length || 0 }} products in catalog</p>
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
            Add Product
          </button>
        </div>
      </div>

      <!-- Products List -->
      <div class="space-y-4">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex space-x-4">
            <img 
              :src="product.image_url" 
              :alt="product.name"
              class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            >
            <div class="flex-grow">
              <div class="flex justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500">{{ product.brand }}</p>
                </div>
                <button
                  @click="editProduct(product)"
                  class="text-gray-600 hover:text-[#da552f]"
                >
                  <PencilIcon class="w-5 h-5" />
                </button>
              </div>
              <div class="mt-2 flex items-center space-x-4">
                <span class="text-[#da552f] font-medium">${{ product.price }}</span>
                <span class="text-sm text-gray-500">{{ product.caffeine_content }}mg caffeine</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Form Modal -->
      <Dialog :open="showAddForm" @close="closeForm" class="relative z-50">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel class="bg-white rounded-xl p-8 max-w-2xl w-full my-8 overflow-y-auto max-h-[90vh]">
            <div class="flex justify-between items-center mb-6">
              <DialogTitle class="text-2xl font-bold">{{ editingProduct ? 'Edit' : 'Add' }} Product</DialogTitle>
              <button @click="closeForm" class="text-gray-500 hover:text-gray-700">
                <XMarkIcon class="w-6 h-6" />
              </button>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Basic Info -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    v-model="form.brand"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Image Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Product Image</label>
                <div class="mt-1 flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleImageChange"
                    :required="!editingProduct"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div v-if="imagePreview || (editingProduct && form.image_url)" class="flex-shrink-0">
                    <img 
                      :src="imagePreview || form.image_url" 
                      alt="Preview" 
                      class="h-16 w-16 object-cover rounded-lg"
                    >
                  </div>
                </div>
              </div>

              <!-- Price and Category -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    v-model="form.price"
                    type="number"
                    step="0.01"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    v-model="form.category_id"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>

              <!-- Caffeine Content and Serving Size -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Caffeine Content (mg)</label>
                  <input
                    v-model="form.caffeine_content"
                    type="number"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Serving Size</label>
                  <input
                    v-model="form.serving_size"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
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
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Saving...' : 'Save Product' }}
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
import { uploadImage } from '~/utils/storage'

const client = useSupabaseClient()
const showAddForm = ref(false)
const isSubmitting = ref(false)
const imagePreview = ref(null)
const selectedImage = ref(null)
const editingProduct = ref(null)

const form = ref({
  name: '',
  brand: '',
  description: '',
  price: '',
  category_id: '',
  image_url: '',
  caffeine_content: '',
  serving_size: '',
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

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedImage.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const editProduct = (product) => {
  editingProduct.value = product
  form.value = { ...product }
  showAddForm.value = true
}

const closeForm = () => {
  showAddForm.value = false
  editingProduct.value = null
  imagePreview.value = null
  selectedImage.value = null
  form.value = {
    name: '',
    brand: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    caffeine_content: '',
    serving_size: '',
  }
}

// Refresh all data
const refreshData = async () => {
  await Promise.all([
    refreshProducts(),
    refreshCategories()
  ])
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    const client = useSupabaseClient()

    // Upload image if new one is selected
    let imageUrl = form.value.image_url
    if (selectedImage.value) {
      imageUrl = await uploadImage(selectedImage.value)
    }

    // Create slug from name
    const slug = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const productData = {
      ...form.value,
      slug,
      image_url: imageUrl,
    }

    if (editingProduct.value) {
      // Update existing product
      const { error } = await client
        .from('products')
        .update(productData)
        .eq('id', editingProduct.value.id)

      if (error) throw error
    } else {
      // Create new product
      const { error } = await client
        .from('products')
        .insert(productData)

      if (error) throw error
    }

    // Refresh products list
    await refreshData()

    // Reset form and close modal
    closeForm()
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Error saving product. Please try again.')
  } finally {
    isSubmitting.value = false
  }
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
