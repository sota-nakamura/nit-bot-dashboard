<template>
  <div class="d-flex justify-center fill-height w-100 py-6">
    <!-- 1. ローディング中 -->
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      size="50"
    ></v-progress-circular>

    <!-- 2. エラー発生時 -->
    <v-card
      v-else-if="error"
      color="error"
      variant="tonal"
      max-width="420"
      class="pa-4 text-center mx-auto"
    >
      <v-icon icon="error" size="48" class="mb-2"></v-icon>
      <h3 class="text-h6 mb-2">{{ errorTitle || 'エラーが発生しました' }}</h3>
      <p class="text-body-2 mb-4">{{ error }}</p>
      
      <div class="d-flex justify-center gap-2">
        <v-btn v-if="showRetry" @click="$emit('retry')" variant="elevated" color="error" class="me-2">
          再試行
        </v-btn>
        <v-btn to="/" variant="outlined">トップへ戻る</v-btn>
      </div>
    </v-card>

    <!-- 3. 正常取得時（スロットに各ページのフォームや内容が入る） -->
    <div v-else class="w-100 d-flex justify-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean,
  error: String,
  errorTitle: String,
  showRetry: {
    type: Boolean,
    default: true
  }
})
defineEmits(['retry'])
</script>
