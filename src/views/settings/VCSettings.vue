<template>
  <v-card
      v-if="!route.query.channelId"
      color="error"
      variant="tonal"
      max-width="420"
      class="pa-4 text-center"
    >
      <v-icon icon="error" size="48" class="mb-2"></v-icon>
      <h3 class="text-h6 mb-2">チャンネルIDが見つかりません。</h3>
      <p class="text-body-2 mb-4">チャンネルIDがURLに含まれていません。</p>
      <v-btn to="/" variant="outlined">トップへ戻る</v-btn>
    </v-card>
  <form>
    <v-text-field
      v-model="state.channelName"
      :counter="100"
      :error-messages="v$.channelName.$errors.map(e => e.$message)"
      label="チャンネル名"
      required
      @blur="v$.channelName.$touch"
      @input="v$.channelName.$touch"
    ></v-text-field>

    <v-number-input
      v-model="state.maxMember"
      label="チャンネルの最大人数(0で無制限)"
      :min="0"
      :max="99"
      :error-messages="v$.maxMember.$errors.map(e => e.$message)"
      @blur="v$.maxMember.$touch"
      @input="v$.maxMember.$touch"
    ></v-number-input>

    <v-select
      v-model="state.select"
      :error-messages="v$.select.$errors.map(e => e.$message)"
      :items="items"
      label="読み上げボイスの選択"
      required
      @blur="v$.select.$touch"
      @change="v$.select.$touch"
      :disabled="!state.checkbox"
    ></v-select>

    <v-checkbox
      v-model="state.checkbox"
      :error-messages="v$.checkbox.$errors.map(e => e.$message)"
      label="Do you agree?"
      indent-details
      required
      @blur="v$.checkbox.$touch"
      @change="v$.checkbox.$touch"
    ></v-checkbox>

    <v-btn
      class="me-4"
      @click="v$.$validate"
    >
      submit
    </v-btn>
    <v-btn @click="clear">
      clear
    </v-btn>
  </form>
</template>
<script setup>

import { reactive, computed, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()

  const state = reactive({
    channelName: '',
    maxMember: 0,
    select: null,
    checkbox: null,
  })

  onMounted(async () => {
  if (!userStore.user) {
    try {
      await userStore.fetchUser()
    } catch {
    }
  }
    if (!route.query.channelId) {
      console.warn("channelId is missing in URL query parameters.")
      return
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vc/getprefs/${route.query.channelId}`)
    if (!res.ok) {
      console.error(`Failed to fetch VC prefs: ${res.status} ${res.statusText}`)
      return
    }
    const vcPrefs = await res.json()
    console.log(vcPrefs)
  });

  const items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
  ]

  const rules = computed(() => ({
    channelName: {
      required,
      $autoAliases: {
        $anyWord: helpers.regex('anyWord', /^\w\s]+$/)
      }
    },
    maxMember: {
      required,
    },
    select: {
      required,
    },
    checkbox: {
      checked: (v) => v || 'You must agree to continue',
    },
  }))

  const v$ = useVuelidate(rules, state)

  function clear () {
    v$.value.$reset()
    state.channelName = ''
    state.maxMember = ''
    state.select = null
    state.checkbox = null
  }
</script>