import { createRouter, createWebHashHistory } from 'vue-router'
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
        path: '/work/guild-of-guardians',
        name: 'ProjectGuild',
        component: () => import('../views/ProjectGuild.vue')
    },
    {
        path: '/work/rocksmith',
        name: 'ProjectRocksmith',
        component: () => import('../views/ProjectRocksmith.vue')
    },
    {
        path: '/login-interaction-1',
        name: 'LoginInteraction1',
        component: () => import('../views/LoginInteraction.vue'),

    },
    {
        path: '/node-graph',
        name: 'NodeGraph',
        component: () => import('../views/NodeGraphView.vue'),

    }
]

const router = createRouter({
    history: createWebHashHistory('/WebUI-Samples/'),
    routes
})

export default router
