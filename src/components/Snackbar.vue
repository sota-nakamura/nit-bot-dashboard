<template>
  <v-snackbar
    v-model="visible"
    :color="color"
    :timeout="timeout"
  >
    {{ text }}

    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="visible = false"
      >
        閉じる
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const text = ref('')
const color = ref('success')
const timeout = ref(3000)

const showSnackbar = (message, type = 'success', duration = 3000) => {
  text.value = message
  color.value = type || 'success'
  timeout.value = duration

  visible.value = true
}

defineExpose({
  showSnackbar,
  visible
})
</script>