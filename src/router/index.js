import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import AuthView from '@/views/AuthView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/settings/SettingView.vue'
import VCSettings from '@/views/settings/VCSettings.vue'
import LolNotification from '@/views/settings/LolNotification.vue'
import ReminderSettings from '@/views/settings/Reminder.vue'
import { useUserStore } from '@/stores/user'

const routes = [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    { path: '/auth', component: AuthView },
    { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
    {
        path: '/settings',
        component: SettingsView,
        meta: {
            requiresAuth: true
        },
        children: [
            { path: 'vc', component: VCSettings, meta: { title: 'VC設定' } },
            { path: 'lol', component: LolNotification, meta: { title: 'LoL通知設定' } },
            { path: 'reminder', component: ReminderSettings, meta: { title: 'リマインダー設定' } }
        ]
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
        next('/auth');
    } else {
        next();
    }
});