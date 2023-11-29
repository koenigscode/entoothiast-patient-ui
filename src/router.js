import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import SignUp from './views/SignUp.vue';
import Login from './views/Login.vue';
import AllDentists from './views/AllDentists.vue';
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
