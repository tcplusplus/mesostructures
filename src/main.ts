import { createApp } from 'vue';
import Camera from 'simple-vue-camera';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

createApp(App).component('camera', Camera)
  .use(store)
  .use(router)
  .mount('#app');
