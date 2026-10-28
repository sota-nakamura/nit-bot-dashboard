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
      <v-icon icon="error" size="48" class="mb-2"></v-icon>
      <h3 class="text-h6 mb-2">認証エラー</h3>
      <p class="text-body-2 mb-4">{{ errorMessage }}</p>
      <v-btn to="/" variant="outlined">トップへ戻る</v-btn>
    </v-card>
    <div v-else-if="user">
      <UserInfo :userData="user" />
      <v-card class="d-flex justify-center pb-5">
        <v-btn @click="userStore.logout()" color="error" variant="outlined">ログアウト</v-btn>
      </v-card>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue"
import { storeToRefs } from "pinia"
import UserInfo from "../components/UserInfo.vue"
import { useUserStore } from "@/stores/user"

const userStore = useUserStore()
const { loading, error: errorMessage, isLoggedIn, user } = storeToRefs(userStore)

onMounted(async () => {
  if (isLoggedIn.value && !user.value) {
    try {
      await userStore.fetchUser()
    } catch {
    }
  }
})
</script>