<template>
  <div class="d-flex justify-center align-center fill-height">
    <!-- ローディング中 -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="50"
    ></v-progress-circular>

    <!-- エラー時 -->
    <v-card
      v-else-if="errorMessage"
      color="error"
      variant="tonal"
      max-width="420"
      class="pa-4 text-center"
    >
      <v-icon icon="mdi-alert-circle-outline" size="48" class="mb-2"></v-icon>
      <h3 class="text-h6 mb-2">認証エラー</h3>
      <p class="text-body-2 mb-4">{{ errorMessage }}</p>
      <v-btn to="/" variant="outlined">トップへ戻る</v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const errorMessage = ref("")
const $cookies = inject('$cookies');

onMounted(async () => {
  const code = route.query.code
  if (!code) {
    errorMessage.value = "認証コードが見つかりませんでした。"
    loading.value = false
    return
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth?code=${code}`)
    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || "アクセストークンの取得に失敗しました。")
    }
    $cookies.set('access_token', data.access_token);
    $cookies.set('refresh_token', data.refresh_token);

    router.push('/profile');
  } catch (e) {
    console.error("[AuthView] error:", e)
    errorMessage.value = e.message || "エラーが発生しました。"
  } finally {
    loading.value = false
  }
})
</script>