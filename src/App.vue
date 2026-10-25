<template>
  <v-layout class="rounded rounded-md border">
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>TFEI端末 (日駒Discord専属Bot)</v-app-bar-title>

      <template v-slot:append v-if="!$vuetify.display.smAndDown">
        <v-btn icon="mdi-info" variant="text"></v-btn>
        <v-btn icon="mdi-login" variant="text" :href="`https://discord.com/oauth2/authorize?client_id=1507675267609526473&response_type=code&redirect_uri=${encodeURIComponent(import.meta.env.VITE_REDIRECT_URI)}&scope=identify`"></v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item title="このサイトについて" link to="/about"></v-list-item>
        <v-list-item title="Discordでログイン" link :href="`https://discord.com/oauth2/authorize?client_id=1507675267609526473&response_type=code&redirect_uri=${encodeURIComponent(import.meta.env.VITE_REDIRECT_URI)}&scope=identify`"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center" height="300">
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(null)
</script>

