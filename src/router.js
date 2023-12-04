import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Settings from './views/Settings.vue';

import SignUp from './views/SignUp.vue';
import Login from './views/Login.vue';
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
