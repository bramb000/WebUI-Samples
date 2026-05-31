import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import './style.css'
import App from './App.vue'
import router from './router'
import { initAnalyticsDeferred, setupAnalytics } from './analytics'

const app = createApp(App)
const head = createHead()
app.use(head)
app.use(router)

void initAnalyticsDeferred()
setupAnalytics(router)

void router.isReady().then(() => {
  app.mount('#app')
})
