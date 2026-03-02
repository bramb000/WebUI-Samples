import { createRouter, createWebHistory } from 'vue-router'
import posthog from 'posthog-js'
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
        path: '/micro-projects/voice-chat',
        name: 'VoiceChatSimulation',
        component: () => import('../views/VoiceChatSimulation.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Capture pageviews manually for SPA routing
router.afterEach((to, _from, failure) => {
    if (!failure) {
        posthog.capture('$pageview', {
            $current_url: window.location.origin + to.fullPath
        })
    }
})

export default router
