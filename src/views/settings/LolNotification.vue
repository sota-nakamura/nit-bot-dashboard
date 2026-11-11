<template>
    <Loader :loading="loading" :error="error" @retry="loadLolAccount">
        <div class="w-100" style="max-width: 500px;">
            <form class="w-100 mb-6" @submit.prevent="submit" :disabled="loading">
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
                    登録
                </v-btn>
            </form>

            <v-card class="mx-auto" width="100%">
                <v-card-title class="text-subtitle-1">登録済みLoLアカウント</v-card-title>
                <v-card-text>
                    <v-list
                        v-if="accounts.length > 0"
                        density="compact"
                        lines="one"
                        :items="accounts"
                    ></v-list>
                    <p v-else class="text-body-2 text-medium-emphasis">
                        登録されているアカウントはありません。
                    </p>
                </v-card-text>
            </v-card>
        </div>
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
const snackBar = ref(null);

const state = reactive({
    summonerName: ""
});

const accounts = ref([]);

const rules = computed(() => ({
    summonerName: {
        required: helpers.withMessage("Riot IDを入力してください", required),
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
    error.value = null;
    if (!userStore.user) {
        try {
            await userStore.fetchUser();
        } catch {}
    }
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lolaccount/get/${userStore.user.id}`);
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || data.error || "アカウント情報の取得に失敗しました。");
        }
        const accountList = (Array.isArray(data) ? data : []).map((el, i) => ({
            title: `${el.riot_id_name}#${el.riot_id_tag}`,
            value: i + 1,
            props: {
                prependIcon: "account_circle",
            },
        }));
        accounts.value = accountList;
    } catch (err) {
        console.error("Failed to fetch LoL accounts:", err);
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

onMounted(loadLolAccount);

const submit = async () => {
    loading.value = true;
    v$.value.$validate();
    if (v$.value.$invalid) {
        return;
    }
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lolaccounts/save`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userStore.user.id,
                    riotId: state.summonerName
                })
            }
        );
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
            snackBar.value?.showSnackbar("Riot IDを登録しました。", "success");
        } else {
            snackBar.value?.showSnackbar(data.message || "Riot IDの登録に失敗しました。", "error");
        }
    } catch (e) {
        console.error("Failed to save riot id:", err);
        snackBar.value?.showSnackbar("Riot IDの登録に失敗しました。", "error");
    }

};
</script>
