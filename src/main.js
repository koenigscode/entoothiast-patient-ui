import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router configuration
import PrimeVue from 'primevue/config';

// Import PrimeVue styles
import 'primevue/resources/primevue.min.css'; // core css
import 'primeicons/primeicons.css';

// Import PrimeVue components
import Button from 'primevue/button';
import Rating from 'primevue/rating';

const app = createApp(App);

// Use Vue Router
app.use(router);

// Use PrimeVue
app.use(PrimeVue);

// Use PrimeVue components globally
// eslint-disable-next-line vue/multi-word-component-names
app.component('primeBtn', Button);

// Use Vue Router
app.use(router);

// Use PrimeVue
app.use(PrimeVue);

// Use PrimeVue components globally
// eslint-disable-next-line vue/multi-word-component-names
app.component('Button', Button);
// eslint-disable-next-line
app.component('Rating', Rating);

app.mount('#app');
