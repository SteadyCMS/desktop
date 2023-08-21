import './assets/main.css'
import 'vue-easy-dnd/dist/dnd.css'
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import 'mosha-vue-toastify/dist/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { QuillEditor } from '@vueup/vue-quill'
import moshaToast from 'mosha-vue-toastify'

const app = createApp(App)
app.component('QuillEditor', QuillEditor)
app.use(router)
app.use(moshaToast)
app.mount('#app')
