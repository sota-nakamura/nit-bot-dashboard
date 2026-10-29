<template>
  <Loader :loading="loading" :error="error" @retry="loadPrefs">
    <form class="w-100" style="max-width: 500px;">
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
        :items="tts"
        item-title="label"
        item-value="value"
        label="読み上げボイスの選択"
        required
        @blur="v$.select.$touch"
        @change="v$.select.$touch"
        :disabled="!state.readMessage && !state.notifyLog"
      ></v-select>

      <v-checkbox
        v-model="state.readMessage"
        :error-messages="v$.readMessage.$errors.map(e => e.$message)"
        label="メッセージの読み上げを有効化"
        indent-details
        required
        @blur="v$.readMessage.$touch"
        @change="v$.readMessage.$touch"
      ></v-checkbox>
      <v-checkbox
        v-model="state.notifyLog"
        :error-messages="v$.notifyLog.$errors.map(e => e.$message)"
        label="参加/退出通知の有効化"
        indent-details
        required
        @blur="v$.notifyLog.$touch"
        @change="v$.notifyLog.$touch"
      ></v-checkbox>

      <v-btn
        class="me-4"
        variant="flat"
        color="primary"
        :loading="loading"
        @click="submit"
      >
        保存
      </v-btn>
      <v-btn
        variant="outlined"
        @click="reset"
      >
        リセット
      </v-btn>
    </form>
  </Loader>
  <Snackbar ref="snackBar"></Snackbar>
</template>
<script setup>

import { reactive, computed, onMounted, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import Loader from '@/components/Loader.vue'
import Snackbar from '@/components/Snackbar.vue'

const userStore = useUserStore()
const route = useRoute()
const vcPrefs = ref(null)
const loading = ref(false)
const error = ref(null)
const tts = ref([])
const snackBar = ref(null)
const channelId = route.query.channelId

  const state = reactive({
    channelName: '',
    maxMember: 0,
    select: null,
    readMessage: false,
    notifyLog: false,
  })

  const loadPrefs = async () => {
    loading.value = true
    error.value = null
    let url = null;

    if (!userStore.user) {
      try {
        await userStore.fetchUser()
      } catch {}
    }

    if (channelId) {
      url = `${import.meta.env.VITE_API_URL}/api/vc/channels/${channelId}`
    } else {
      url = `${import.meta.env.VITE_API_URL}/api/vc/preferences/${userStore.user.id}`
    }

    try {
      const res = await fetch(url)
      const data = await res.json()
      console.log(data)
      if (!res.ok) {
        throw new Error(data.error)
      }
      vcPrefs.value = data
      tts.value = data.tts || []
      state.channelName = data.preferences?.name || "",
      state.maxMember = data.preferences?.member_limit || 0,
      state.select = data.preferences?.voice_type || "f1",
      state.readMessage = data.preferences?.read_message === 1
      state.notifyLog = data.preferences?.notify_log === 1
    } catch (err) {
      console.error("Failed to fetch VC prefs:", err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(loadPrefs);

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
    readMessage: {
      required,
    },
    notifyLog: {
      required,
    },
  }))

  const submit = async () => {
    v$.value.$validate();
    if (v$.value.$invalid) {
      return;
    }
    let url = "";
    if (!channelId) {
      url = `${import.meta.env.VITE_API_URL}/api/vc/preferences/`
    } else {
      url = `${import.meta.env.VITE_API_URL}/api/vc/channels/${channelId}`
    }
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userStore.user.id,
        name: state.channelName,
        memberLimit: state.maxMember,
        notifyLog: state.notifyLog,
        readMessage: state.readMessage,
        voiceType: state.select
      })
    });
    if (res.ok) {
      snackBar.value?.showSnackbar("設定を更新しました。", "success");
    } else {
      snackBar.value?.showSnackbar("設定の更新に失敗しました。", "error");
    }
  }

  const reset = () => {
    state.channelName = vcPrefs.value.preferences?.name || "",
    state.maxMember = vcPrefs.value.preferences?.member_limit || 0,
    state.select = vcPrefs.value.preferences?.voice_type || "f1",
    state.readMessage = vcPrefs.value.preferences?.read_message === 1
    state.notifyLog = vcPrefs.value.preferences?.notify_log === 1
  }

  const v$ = useVuelidate(rules, state)
</script>