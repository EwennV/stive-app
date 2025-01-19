
import './assets/output.css'
import './assets/main.css'
import router from './router/router.js';

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

app.use(router); // Intégration de Vue Router
app.mount('#app');

//createApp(App).mount('#app')
