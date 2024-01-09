import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Settings from './views/Settings.vue';

import SignUp from './views/SignUp.vue';
import Login from './views/Login.vue';
import AllDentists from './views/AllDentists.vue';
const routes = [
  {
    path: '/home',
    name: 'Home-page',
    component: Home,
  },
  {
    path: '/',
    name: 'Login-page',
    component: Login,
  },
  {
    path: '/settings',
    name: 'Settings-page',
    component: Settings,
  },
  {
    path: '/signup',
    name: 'SignUp-page',
    component: SignUp,
  },
  {
    path: '/dentists',
    name: 'AllDentists-page',
    component: AllDentists,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
