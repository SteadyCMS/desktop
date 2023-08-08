import './assets/main.css'
import 'vue-easy-dnd/dist/dnd.css'
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { QuillEditor } from '@vueup/vue-quill'

const app = createApp(App)
app.component('QuillEditor', QuillEditor)
app.use(router)
app.mount('#app')
