import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/work',
        name: 'Work',
        component: () => import('../views/Work.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/micro-projects',
        name: 'Projects',
        component: () => import('../views/DeadlockHeroSelect.vue')
    },
    {
        path: '/micro-projects/list',
        name: 'ProjectsList',
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

    },
    {
        path: '/experiment/patapon',
        name: 'ExperimentPatapon',
        component: () => import('../views/ExperimentPatapon.vue')
    },
    {
        path: '/experiment/helldivers',
        name: 'ExperimentHelldivers',
        component: () => import('../views/ExperimentHelldivers.vue')
    },
    {
        path: '/experiment/jedi',
        name: 'ExperimentJedi',
        component: () => import('../views/ExperimentJedi.vue')
    },
    {
        path: '/micro-projects/sales-modal',
        name: 'SalesModal',
        component: () => import('../views/SalesModalView.vue')
    },
    {
        path: '/micro-projects/account-tray',
        name: 'AccountTray',
        component: () => import('../views/AccountTrayView.vue')
    },
    {
        path: '/micro-projects/voice-chat',
        name: 'VoiceChatSimulation',
        component: () => import('../views/VoiceChatSimulation.vue')
    },
    {
        path: '/micro-projects/deadlock-hero-select',
        name: 'DeadlockHeroSelect',
        component: () => import('../views/DeadlockHeroSelect.vue')
    }
]

import { setupAnalytics } from '../analytics'

const router = createRouter({
    history: createWebHistory(),
    routes
})

setupAnalytics(router)

export default router
