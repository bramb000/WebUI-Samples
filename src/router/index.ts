import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/projects',
        name: 'Projects',
        component: () => import('../views/Projects.vue')
    },
    {
        path: '/login-interaction-1',
        name: 'LoginInteraction1',
        component: () => import('../views/LoginInteraction.vue'),
        meta: { layout: 'blank' }
    }
]

const router = createRouter({
    history: createWebHistory('/WebUI-Samples/'),
    routes
})

export default router
