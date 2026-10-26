<template>
  <v-app>
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>TFEI端末 (日駒Discord専属Bot)</v-app-bar-title>

      <template v-slot:append v-if="!$vuetify.display.smAndDown">
        <v-btn icon="mdi-info" variant="text"></v-btn>
        <v-btn icon="mdi-login" variant="text" :href="loginUrl"></v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list nav>
        <v-list-item title="このサイトについて" link to="/about"></v-list-item>
        <v-list-item title="Discordでログイン" link :href="loginUrl"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="py-6">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(null)

const redirectUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI || '')
const loginUrl = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=identify`
</script>

