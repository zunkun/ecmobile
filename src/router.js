import Vue from 'vue'
import Router from 'vue-router'
import TripApply from './views/TripApply.vue'
import axios from 'axios'

Vue.use(Router)

const router =  new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: TripApply,
      meta: {
        title: '预算列表',
        isAuth: true,
      }
    },
    {
      path: '/approvals',
      name: 'approvals',
      component: () => import('./views/Approvals.vue'),
      meta: {
        title: '审批',
        isAuth: true,
      }
    },
    {
      path: '/approvals/:tripId',
      name: 'approvaldetail',
      component: () => import('./views/ApprovalDetail.vue'),
      meta: {
        title: '审批',
        isAuth: true,
      }
    },
    {
      path: '/trips',
      name: 'trips',
      component: () => import('./views/Trips.vue'),
      meta: {
        title: '我的出行',
        isAuth: true,
      }
    },
    {
      path: '/trips/:tripId',
      name: 'tripdetail',
      component: () => import('./views/TripDetail.vue'),
      meta: {
        title: '出差申請',
        isAuth: true,
      }
    },
    {
      path: '/tripedit/:tripId',
      name: 'tripedit',
      component: () => import('./views/TripEdit.vue'),
      meta: {
        title: '出差申请',
        isAuth: true,
      }
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  let expire = Number(localStorage.getItem('expire')) ||0;
  
  if(to.meta.title) {
    document.title = to.meta.title;
  }

  if (to.matched.some(record => record.meta.isAuth)) {
    let token = localStorage.getItem('token');
    if(!token || expire < Date.now()) {
      if(to.query.userId) {
        let res = await axios.get(`/ecapi/api/auth/login?userId=${to.query.userId}`)
        let resData = res.data;
        if (resData.errcode === 0) {
          let user = resData.data.user;
          let token = resData.data.token;
          let rule = resData.data.rule;
 
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('rule', JSON.stringify(rule));
          localStorage.setItem('token', token);
          localStorage.setItem('expire', Date.now() + 24 * 60 * 60 * 1000)
        }
      }
    }
  }
  next()
})

export default router;
