import './assets/main.css';
import 'vue-easy-dnd/dist/dnd.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import 'mosha-vue-toastify/dist/style.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { QuillEditor } from '@vueup/vue-quill';
import moshaToast from 'mosha-vue-toastify';


const pinia = createPinia();
const app = createApp(App);

app.component('QuillEditor', QuillEditor);
app.use(pinia);
app.use(router);

app.directive('focus', {  // When the bound element is inserted into the DOM...
    mounted(el, binding, vnode) {
        if(binding.value){ // Focus the element if the value is true
            el.focus();
        }else{
            el.blur();
        }
    }
  });
  
app.use(moshaToast);
app.mount('#app');
