import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router configuration

// Import PrimeVue styles
import 'primevue/resources/primevue.min.css'; // core css
import 'primeicons/primeicons.css';

// Import PrimeVue components
import Button from 'primevue/button';

const app = createApp(App);

// Use PrimeVue components globally
// eslint-disable-next-line vue/multi-word-component-names
app.component('primeBtn', Button);

// Use Vue Router
app.use(router);

app.mount('#app');

