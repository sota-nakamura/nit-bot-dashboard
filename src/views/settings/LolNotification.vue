<template>
    <Loader :loading="loading" :error="error" @retry="loadPrefs">
        <form class="w-100" style="max-width: 500px;">
            <v-text-field
                :loading="loading"
                append-inner-icon="mdi-magnify"
                v-model="state.summonerName"
                density="compact"
                label="Riot IDを入力"
                variant="solo"
                hide-details
                single-line
                required
                @click:append-inner="search"
                @blur="v$.channelName.$touch"
                @input="v$.channelName.$touch"
            ></v-text-field>
            <v-text-field
                v-model="state.summonerName"
                :counter="100"
                :error-messages="v$.summonerName.$errors.map(e => e.$message)"
                label="チャンネル名"
                required
                @blur="v$.channelName.$touch"
                @input="v$.channelName.$touch"
            ></v-text-field>
  
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
import Loader from "@/components/Loader.vue";
import Snackbar from "@/components/Snackbar.vue";
import { reactive, ref } from "vue";
const loading = ref(false);
const error = ref(null);
const state = reactive({
    summonerName: "",
    server: "jp",
});
</script>