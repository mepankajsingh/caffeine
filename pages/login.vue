<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div class="mt-8">
        <div
          @click="handleGoogleLogin"
          class="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:text-blue-600 cursor-pointer"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            class="h-5 w-5 mr-2"
          />
          Sign in with Google
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const handleGoogleLogin = async () => {
  try {
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          client_id: '465428512012-s137tvkdn54m46ajbherhqmn91hfqkn2.apps.googleusercontent.com'
        }
      }
    })
    if (error) throw error
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// If user is already logged in, redirect to homepage
watchEffect(() => {
  if (user.value) {
    router.push('/')
  }
})
</script>
