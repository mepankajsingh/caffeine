<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h2 class="text-xl font-semibold text-gray-900">Confirming login...</h2>
      <p class="mt-2 text-gray-600">Please wait while we complete your sign in.</p>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
const router = useRouter()

// Redirect to home page after successful authentication
watchEffect(() => {
  if (user.value) {
    router.push('/')
  }
})
</script>
