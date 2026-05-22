import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initAnalyticsDeferred, setupAnalytics } from './analytics'

const app = createApp(App)
app.use(router)

void initAnalyticsDeferred()
setupAnalytics(router)

app.mount('#app')
