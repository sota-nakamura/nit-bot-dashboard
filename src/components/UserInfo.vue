<script setup>
import { computed } from 'vue'
import Settings from './Settings.vue';

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

const avatarUrl = computed(() => {
  if (props.userData?.avatar && props.userData?.id) {
    const isGif = props.userData.avatar.startsWith('a_')
    const ext = isGif ? 'gif' : 'png'
    return `https://cdn.discordapp.com/avatars/${props.userData.id}/${props.userData.avatar}.${ext}`
  }
  if (props.userData?.id) {
    const defaultIndex = (BigInt(props.userData.id) >> 22n) % 6n
    return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`
  }
  return ''
})

const displayName = computed(() => {
  return props.userData?.global_name || props.userData?.username || ''
})
</script>

<template>
  <v-card
    class="mx-auto"
    :prepend-avatar="avatarUrl"
    :title="displayName"
    :subtitle="`@${userData.username}`"
    width="420"
    elevation="4"
  >
    <template v-slot:title>
      <span class="font-weight-bold">{{ displayName }}</span>
    </template>

    <v-card-text class="pt-4">
      <v-list density="compact" lines="one">
        <v-list-item prepend-icon="mdi-identifier" title="ユーザーID" :subtitle="userData.id"></v-list-item>
        <v-list-item prepend-icon="mdi-account" title="ユーザー名" :subtitle="userData.username"></v-list-item>
        <v-list-item v-if="userData.email" prepend-icon="mdi-email" title="メール" :subtitle="userData.email"></v-list-item>
      </v-list>
      <Settings />
    </v-card-text>
  </v-card>
</template>