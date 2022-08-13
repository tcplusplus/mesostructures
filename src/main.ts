import { createApp } from 'vue';
import Camera from 'simple-vue-camera';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

createApp(App).component('camera', Camera)
  .use(store)
  .use(router)
  .mount('#app');
