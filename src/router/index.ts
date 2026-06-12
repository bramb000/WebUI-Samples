import { createRouter, createWebHistory, type RouteLocationGeneric } from 'vue-router'
import { INDEXABLE_PATHS } from '../seo/indexablePaths'
import { ROUTE_SEO } from '../seo/routeMeta'
import type { RouteMetaSeo } from '../seo/types'

export { INDEXABLE_PATHS }

function seo(name: keyof typeof ROUTE_SEO): { seo: RouteMetaSeo } {
  return { seo: ROUTE_SEO[name] }
}

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { ...seo('Home'), sitemap: true, prerender: true },
    },
    {
        path: '/work',
        name: 'Work',
        component: () => import('../views/ProjectSelect.vue'),
        meta: { ...seo('Work'), sitemap: true, prerender: true },
    },
    {
        path: '/work/select/:projectId',
        redirect: (to: RouteLocationGeneric) => ({
            path: '/work',
            query: { project: String(to.params.projectId ?? '') },
        }),
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue'),
        meta: { ...seo('About'), sitemap: true, prerender: true },
    },
    {
        path: '/micro-projects',
        redirect: '/work',
    },
    {
        path: '/work/list',
        name: 'WorkList',
        component: () => import('../views/Projects.vue'),
        meta: { ...seo('WorkList'), sitemap: true, prerender: true },
    },
    {
        path: '/micro-projects/list',
        redirect: '/work/list',
    },
    {
        path: '/work/guild-of-guardians',
        name: 'ProjectGuild',
        component: () => import('../views/ProjectGuild.vue'),
        meta: { ...seo('ProjectGuild'), sitemap: true, prerender: true },
    },
    {
        path: '/work/rocksmith',
        name: 'ProjectRocksmith',
        component: () => import('../views/ProjectRocksmith.vue'),
        meta: { ...seo('ProjectRocksmith'), sitemap: true, prerender: true },
    },
    {
        path: '/login-interaction-1',
        name: 'LoginInteraction1',
        component: () => import('../views/LoginInteraction.vue'),
        meta: seo('LoginInteraction1'),
    },
    {
        path: '/work/art-book',
        name: 'ArtBook',
        component: () => import('../views/ArtBookInteraction.vue'),
        meta: seo('ArtBook'),
    },
    {
        path: '/node-graph',
        name: 'NodeGraph',
        component: () => import('../views/NodeGraphView.vue'),
        meta: seo('NodeGraph'),
    },
    {
        path: '/experiment/patapon',
        name: 'ExperimentPatapon',
        component: () => import('../views/ExperimentPatapon.vue'),
        meta: seo('ExperimentPatapon'),
    },
    {
        path: '/experiment/helldivers',
        name: 'ExperimentHelldivers',
        component: () => import('../views/ExperimentHelldivers.vue'),
        meta: seo('ExperimentHelldivers'),
    },
    {
        path: '/experiment/jedi',
        name: 'ExperimentJedi',
        component: () => import('../views/ExperimentJedi.vue'),
        meta: seo('ExperimentJedi'),
    },
    {
        path: '/work/sales-modal',
        name: 'SalesModal',
        component: () => import('../views/SalesModalView.vue'),
        meta: seo('SalesModal'),
    },
    {
        path: '/work/account-tray',
        name: 'AccountTray',
        component: () => import('../views/AccountTrayView.vue'),
        meta: seo('AccountTray'),
    },
    {
        path: '/work/voice-chat',
        name: 'VoiceChatSimulation',
        component: () => import('../views/VoiceChatSimulation.vue'),
        meta: seo('VoiceChatSimulation'),
    },
    {
        path: '/work/cozy-corner',
        name: 'ProjectCozyCorner',
        component: () => import('../views/ProjectCozyCorner.vue'),
        meta: { ...seo('ProjectCozyCorner'), sitemap: true, prerender: true },
    },
    {
        path: '/work/online-dice-simulator',
        name: 'ProjectDiceSimulator',
        component: () => import('../views/ProjectDiceSimulator.vue'),
        meta: { ...seo('ProjectDiceSimulator'), sitemap: true, prerender: true },
    },
    {
        path: '/micro-projects/sales-modal',
        redirect: '/work/sales-modal',
    },
    {
        path: '/micro-projects/account-tray',
        redirect: '/work/account-tray',
    },
    {
        path: '/micro-projects/voice-chat',
        redirect: '/work/voice-chat',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
