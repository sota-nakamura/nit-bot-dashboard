import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import AuthView from '@/views/AuthView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/about', component: AboutView },
    { path: '/auth', component: AuthView }
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});