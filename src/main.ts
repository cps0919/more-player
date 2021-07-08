import { createApp } from 'vue'
import App from './App.vue'
import MorePlayer from 'more-player'
import 'more-player/more-player.css'

const app = createApp(App)
app.use(MorePlayer)
app.mount('#app')