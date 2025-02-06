<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div v-if="product" class="bg-white border border-gray-100">
      <!-- Header with Caffeine Focus -->
      <div class="border-b border-gray-200 p-8">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-medium text-gray-900">{{ product.name }}</h1>
            <p class="mt-1 text-gray-500">{{ product.brand }}</p>
          </div>
          <div class="text-right">
            <div class="text-5xl font-bold tabular-nums text-gray-900">
              {{ caffeinePer100ml }}<span class="text-base text-gray-500">mg</span><span class="text-base text-gray-500">/{{ currentUnit === 'ml' ? '100ml' : '12 fl oz' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-8 p-8">
        <!-- Product Image -->
        <div class="col-span-3">
          <img 
            :src="product.image_url" 
            :alt="product.name"
            class="w-full aspect-square object-cover border border-gray-200"
          >
        </div>

        <!-- Product Information -->
        <div class="col-span-9 space-y-8">
          <!-- Key Stats -->
          <div class="grid grid-cols-3 gap-4 pb-6 border-b border-gray-200">
            <div>
              <div class="flex items-center text-sm text-gray-500">
                <CurrencyDollarIcon class="h-5 w-5 mr-1.5" />
                Price
              </div>
              <div class="mt-1 text-xl font-medium">${{ product.price }}</div>
            </div>
            <div>
              <div class="flex items-center text-sm text-gray-500">
                <BeakerIcon class="h-5 w-5 mr-1.5" />
                Serving Size
              </div>
              <div class="mt-1 text-xl font-medium">{{ formattedServingSize }}</div>
            </div>
            <div>
              <div class="flex items-center text-sm text-gray-500">
                <BoltIcon class="h-5 w-5 mr-1.5" />
                Caffeine per Serving
              </div>
              <div class="mt-1 text-xl font-medium">{{ product.caffeine_content }}mg</div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <div class="flex items-center mb-2 text-sm font-medium text-gray-900">
              <DocumentTextIcon class="h-5 w-5 mr-1.5 text-gray-400" />
              Description
            </div>
            <p class="text-gray-600">{{ product.description }}</p>
          </div>

          <!-- Product Details -->
          <div>
            <div class="flex items-center mb-4 text-sm font-medium text-gray-900">
              <ClipboardDocumentListIcon class="h-5 w-5 mr-1.5 text-gray-400" />
              Product Details
            </div>
            <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="flex items-center text-gray-500">
                  <GlobeAmericasIcon class="h-4 w-4 mr-1.5" />
                  Origin
                </span>
                <span class="text-gray-900">{{ product.country_of_origin }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="flex items-center text-gray-500">
                  <ArchiveBoxIcon class="h-4 w-4 mr-1.5" />
                  Packaging
                </span>
                <span class="text-gray-900">{{ product.packaging_type }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="flex items-center text-gray-500">
                  <ClockIcon class="h-4 w-4 mr-1.5" />
                  Shelf Life
                </span>
                <span class="text-gray-900">{{ product.shelf_life }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="flex items-center text-gray-500">
                  <FireIcon class="h-4 w-4 mr-1.5" />
                  Calories
                </span>
                <span class="text-gray-900">{{ product.calories }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="flex items-center text-gray-500">
                  <CakeIcon class="h-4 w-4 mr-1.5" />
                  Sugar Content
                </span>
                <span class="text-gray-900">{{ product.sugar_content }}g</span>
              </div>
            </div>
          </div>

          <!-- Nutrition Information -->
          <div v-if="product.nutrition_info" class="border-t border-gray-200 pt-6">
            <div class="flex items-center mb-4 text-sm font-medium text-gray-900">
              <ListBulletIcon class="h-5 w-5 mr-1.5 text-gray-400" />
              Nutrition Information
            </div>
            <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <template v-for="(value, key) in product.nutrition_info" :key="key">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="flex items-center text-gray-500">
                    <ChartBarIcon class="h-4 w-4 mr-1.5" />
                    {{ formatNutritionKey(key) }}
                  </span>
                  <span class="text-gray-900">{{ value }}</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Certifications -->
          <div v-if="product.certifications?.length" class="border-t border-gray-200 pt-6">
            <div class="flex items-center mb-4 text-sm font-medium text-gray-900">
              <CheckBadgeIcon class="h-5 w-5 mr-1.5 text-gray-400" />
              Certifications
            </div>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="cert in product.certifications" 
                :key="cert"
                class="inline-flex items-center px-3 py-1 border border-gray-200 rounded-full text-xs"
              >
                <CheckCircleIcon class="h-4 w-4 mr-1 text-green-500" />
                {{ cert }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations Section -->
      <div v-if="recommendations?.length" class="border-t border-gray-200 p-8">
        <div class="flex items-center mb-6 text-sm font-medium text-gray-900">
          <SparklesIcon class="h-5 w-5 mr-1.5 text-gray-400" />
          Recommended Products
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink 
            v-for="rec in recommendations" 
            :key="rec.id"
            :to="`/products/${rec.slug}`"
            class="group flex items-start space-x-4"
          >
            <div class="w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-100 rounded">
              <img 
                :src="rec.image_url" 
                :alt="rec.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              >
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 group-hover:text-[#da552f] truncate">{{ rec.name }}</h3>
              <p class="text-sm text-gray-500 truncate">{{ rec.brand }}</p>
              <div class="mt-1 text-sm">
                <span class="text-gray-900 font-medium">${{ rec.price }}</span>
                <span class="mx-2 text-gray-300">•</span>
                <span class="text-gray-500">{{ rec.caffeine_content }}mg</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  BoltIcon,
  BeakerIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  GlobeAmericasIcon,
  ArchiveBoxIcon,
  ClockIcon,
  FireIcon,
  CakeIcon,
  ListBulletIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const route = useRoute();
const { data: product } = await useFetch(`/api/products/${route.params.slug}`);
const { data: recommendations } = await useFetch(`/api/recommendations/${route.params.slug}`);
const { currentUnit, formatVolume, calculateCaffeinePer100ml, REFERENCE_FL_OZ } = useUnits();

// Format serving size based on selected unit
const formattedServingSize = computed(() => {
  if (!product.value?.serving_size) return '';
  return formatVolume(product.value.serving_size);
});

// Calculate caffeine per 100ml/fl oz
const caffeinePer100ml = computed(() => {
  if (!product.value) return null;
  return calculateCaffeinePer100ml(product.value.caffeine_content, product.value.serving_size);
});

// Format nutrition key names for display
const formatNutritionKey = (key) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

useHead({
  title: `${product.value?.name} - Caffeine DB`,
  meta: [
    {
      name: 'description',
      content: product.value?.description?.substring(0, 155)
    }
  ]
});
</script>
