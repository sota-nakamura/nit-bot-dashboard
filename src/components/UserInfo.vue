<script setup>
import Settings from './Settings.vue';

import { useUserStore } from "@/stores/user"

const userStore = useUserStore()
</script>

<template>
  <v-card
    class="mx-auto"
    :prepend-avatar="userStore.avatarUrl"
    :title="userStore.displayName"
    :subtitle="`@${userStore.user.username}`"
    width="420"
    elevation="4"
  >
    <template v-slot:title>
      <span class="font-weight-bold">{{ userStore.displayName }}</span>
    </template>

    <v-card-text class="pt-4">
      <v-list density="compact" lines="one">
        <v-list-item prepend-icon="badge" title="ユーザーID" :subtitle="userStore.user.id"></v-list-item>
        <v-list-item prepend-icon="person" title="ユーザー名" :subtitle="userStore.user.username"></v-list-item>
        <v-list-item v-if="userStore.user.email" prepend-icon="mail" title="メール" :subtitle="userStore.user.email"></v-list-item>
      </v-list>
      <Settings />
    </v-card-text>
  </v-card>
</template>