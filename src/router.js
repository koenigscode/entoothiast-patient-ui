import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Home from './views/Home.vue';
import Settings from './views/Settings.vue';

const routes = [
  {
    path: '/',
    name: 'Home-page',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login-page',
    component: Login,
  },
  {
    path: '/settings',
    name: 'Settings-page',
    component: Settings,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
