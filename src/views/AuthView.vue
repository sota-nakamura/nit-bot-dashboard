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
      <v-icon icon="error" size="48" class="mb-2"></v-icon>
      <h3 class="text-h6 mb-2">認証エラー</h3>
      <p class="text-body-2 mb-4">{{ errorMessage }}</p>
      <v-btn to="/" variant="outlined">トップへ戻る</v-btn>
    </v-card>

    <!-- 未ログイン時（codeがなく未ログインの場合） -->
    <v-card
      v-else-if="!isLoggedIn"
      variant="tonal"
      max-width="420"
      class="pa-4 text-center"
    >
      <v-icon icon="account_circle_off" size="48" class="mb-2"></v-icon>
      <h3 class="text-h6 mb-2">未ログインです</h3>
      <p class="text-body-2 mb-4">下のボタンからDiscordアカウントでログインして下さい。</p>
      <v-btn :href="loginUrl" variant="outlined" prepend-icon="fa:fab fa-discord" color="#5865F2">ログイン</v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { storeToRefs } from "pinia"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { isLoggedIn } = storeToRefs(userStore)

const loading = ref(false)
const errorMessage = ref("")

const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI || '')
const loginUrl = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=identify`

onMounted(async () => {
  const code = route.query.code

  // 既にログイン済みで、認証コードがない場合はプロフィールへ
  if (isLoggedIn.value && !code) {
    router.push("/profile")
    return
  }

  // 認証コードがない場合は未ログイン表示にする
  if (!code) {
    return
  }

  // 認証コードがある場合はアクセストークンを取得
  loading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth?code=${code}`)
    const data = await response.json()

    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || "アクセストークンの取得に失敗しました。")
    }

    userStore.setTokens(data.access_token, data.refresh_token)
    // 成功時のみプロフィール画面へ遷移
    router.push('/profile')
  } catch (e) {
    console.error("[AuthView] error:", e)
    errorMessage.value = e.message || "エラーが発生しました。"
  } finally {
    loading.value = false
  }
})
</script>