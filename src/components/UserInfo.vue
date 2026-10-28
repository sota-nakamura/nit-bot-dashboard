<script setup>
import Settings from './Settings.vue';

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

import { useUserStore } from "@/stores/user"

const userStore = useUserStore()
</script>

<template>
  <v-card
    class="mx-auto"
    :prepend-avatar="userStore.avatarUrl"
    :title="userStore.displayName"
    :subtitle="`@${userStore.username}`"
    width="420"
    elevation="4"
  >
    <template v-slot:title>
      <span class="font-weight-bold">{{ userStore.displayName }}</span>
    </template>

    <v-card-text class="pt-4">
      <v-list density="compact" lines="one">
        <v-list-item prepend-icon="badge" title="ユーザーID" :subtitle="userData.id"></v-list-item>
        <v-list-item prepend-icon="person" title="ユーザー名" :subtitle="userData.username"></v-list-item>
        <v-list-item v-if="userData.email" prepend-icon="mail" title="メール" :subtitle="userData.email"></v-list-item>
      </v-list>
      <Settings />
    </v-card-text>
  </v-card>
</template>