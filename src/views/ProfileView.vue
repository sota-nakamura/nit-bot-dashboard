<template>
  <div class="d-flex justify-center">
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
    <div v-else-if="userData">
      <UserInfo :userData="userData" />
    </div>
  </div>
</template>
<script setup>
    import { onMounted, ref, inject } from "vue"
    import UserInfo from "../components/UserInfo.vue"

    const loading = ref(true)
    const errorMessage = ref("")
    const userData = ref(null)
    const $cookies = inject('$cookies')

    const access_token = $cookies.get("access_token")

    if (!access_token) {
      errorMessage.value = "トークンの取得に失敗しました"
    }
    
// Discord APIからユーザー情報取得
onMounted(async () => {
try{
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    const userInfo = await userResponse.json();
    console.log("[AuthView] user info:", userInfo)

    if (!userResponse.ok) {
      throw new Error(userInfo.message || "ユーザー情報の取得に失敗しました。")
    }

    userData.value = userInfo
  }catch(e){
    console.error("[AuthView] error:", e)
    errorMessage.value = e.message || "エラーが発生しました。"
  }finally{
    loading.value = false
  }
})
</script>