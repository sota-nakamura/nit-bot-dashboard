<template>
    <h3 v-if="!route.query.code">認証に失敗しました</h3>
</template>
<script setup>
import { onMounted } from "vue"
import { useRoute } from "vue-router";
const route = useRoute();

onMounted(async () => {
    console.log(route.query.code);
    try {
        const response = await fetch(`http://localhost:3000/auth?code=${route.query.code}`);
        const data = await response.json();
        console.log(data);
    } catch (e) {
        console.log("error");
        console.log(e);
    }
})
</script>