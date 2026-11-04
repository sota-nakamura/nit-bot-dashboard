<template>
    <Loader :loading="loading" :error="error" @retry="loadLolAccount">
        <form class="w-100" style="max-width: 500px;">
            <v-text-field
                :loading="loading"
                :error-messages="v$.summonerName.$errors.map(e => e.$message)"
                append-inner-icon="mdi-magnify"
                v-model="state.summonerName"
                density="compact"
                label="Riot IDを入力"
                variant="solo"
                single-line
                required
                @blur="v$.summonerName.$touch"
                @input="v$.summonerName.$touch"
                @click:append-inner="search"
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
        </form>
    </Loader>
    <Snackbar ref="snackBar"></Snackbar>
</template>
<script setup>
import Loader from "@/components/Loader.vue";
import Snackbar from "@/components/Snackbar.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { useUserStore } from "@/stores/user";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const userStore = useUserStore();
const loading = ref(false);
const error = ref(null);

const state = reactive({
    summonerName: ""
});

const rules = computed(() => ({
    summonerName: {
        required,
        riotIdFormat: helpers.withMessage(
            "「ユーザー名#1〜5文字のタグライン」の形式で入力してください",
            helpers.regex(/^[^#]+#[^#]{1,5}$/)
        ),
    },
    server: {
        required,
    },
}));

const v$ = useVuelidate(rules, state);
const loadLolAccount = async () => {
    loading.value = true;
    if(!userStore.user) {
        try {
            await userStore.fetchUser();
        } catch {}
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lolaccount/${userStore.user.id}`);
    const data = await res.json();
    state.summonerName = data.summonerName;
    loading.value = false;

};

onMounted(loadLolAccount);
</script>
