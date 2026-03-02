import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import posthog from 'posthog-js'

// Initialize PostHog for analytics
posthog.init(import.meta.env.VITE_POSTHOG_KEY || 'phc_placeholder', {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false // We capture manually via Vue Router for SPA tracking
})

// Expose posthog to the window for debugging
// @ts-ignore
window.posthog = posthog

const app = createApp(App)
app.use(router)
app.mount('#app')
