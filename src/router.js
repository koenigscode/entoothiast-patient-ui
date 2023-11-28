import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import SignUp from './views/SignUp.vue';
const routes = [
  {
    path: '/',
    name: 'Home-page',
    component: Home,
  },
  {
    path: '/signup',
    name: 'SignUp-page',
    component: SignUp,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
