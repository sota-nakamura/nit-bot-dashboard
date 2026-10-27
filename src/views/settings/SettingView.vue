<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

const route = useRoute();
const pageName = computed(() => route.meta.title || '');
</script>
<template>
    <h3>設定 - {{ pageName }}</h3>
    <RouterView />
</template>