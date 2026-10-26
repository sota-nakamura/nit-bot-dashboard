import 'unfonts.css'
import '@/assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import { router } from './router'
import VueCookies from 'vue-cookies'

const vuetify = createVuetify({
    components,
    directives,
})

createApp(App)
    .use(vuetify)
    .use(router)
    .use(VueCookies, {
        expire: 60 * 60,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax"
    }).mount('#app');
