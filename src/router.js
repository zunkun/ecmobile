import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import store from './store';

Vue.use(Router)

const router =  new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: '出差申请',
        isAuth: true,
      }
    },
    {
      path: '/me',
      name: 'me',
      component: () => import('./views/Me.vue'),
      meta: {
        title: '我的出差',
        isAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.meta.title) {
    document.title = to.meta.title;
  }
  next()
})

export default router;
