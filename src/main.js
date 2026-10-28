import 'unfonts.css'
import '@/assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'

import vuetify from './plugins/vuetify'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(vuetify)
    .use(router)
    .use(VueCookies, {
        expire: 60 * 60,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax"
    }).mount('#app');
