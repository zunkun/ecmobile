import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store';
import axios from 'axios'

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
      path: '/manage',
      name: 'manage',
      component: () => import('./views/manage/Manage.vue'),
      meta: {
        title: '我的管理',
        isAuth: true
      }
    },
    {
      path: '/applylists',
      name: 'applylists',
      component: () => import('./views/approval/ApplyLists.vue'),
      meta: {
        title: '我的出差',
        isAuth: true
      }
    },
    {
      path: '/apply',
      name: 'apply',
      component: () => import('./views/approval/Apply.vue'),
      meta: {
        title: '申请单明细',
        isAuth: true
      }
    },
    {
      path: '/approvals',
      name: 'approvals',
      component: () => import('./views/approval/Approvals.vue'),
      meta: {
        title: '出差审批',
        isAuth: true
      }
    },
    {
      path: '/approval',
      name: 'approval',
      component: () => import('./views/approval/Approval.vue'),
      meta: {
        title: '出差审批',
        isAuth: true
      }
    },
    {
      path: '/approvaledit',
      name: 'approvaledit',
      component: () => import('./views/approval/ApprovalEdit.vue'),
      meta: {
        title: '出差修改',
        isAuth: true
      }
    },
    {
      path: '/applybudget',
      name: 'applybudget',
      component: () => import('./views/application/ApplyBudget.vue'),
      meta: {
        title: '预算申请',
        isAuth: true
      }
    },
    {
      path: '/applybudgetdetil',
      name: 'applybudgetdetil',
      component: () => import('./views/application/ApplyBudgetDetail.vue'),
      meta: {
        title: '预算申请',
        isAuth: true
      }
    },
    {
      path: '/budgetlists',
      name: 'budgetlists',
      component: () => import('./views/application/ApplyBudgetLists.vue'),
      meta: {
        title: '预算申请列表',
        isAuth: true
      }
    },
    {
      path: '/budget',
      name: 'budget',
      component: () => import('./views/application/Budget.vue'),
      meta: {
        title: '预算审批',
        isAuth: true
      }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  let expire = Number(localStorage.getItem('expire')) ||0;
  
  if(to.meta.title) {
    document.title = to.meta.title;
  }

  if (to.matched.some(record => record.meta.isAuth)) {
    let token = store.state.token || localStorage.getItem('token');
    if(!token || expire < Date.now()) {
      if(to.query.userId) {
        let res = await axios.get(`/ec/api/auth/login?userId=${to.query.userId}`)
        let resData = res.data;
        if (resData.errcode === 0) {
          let user = resData.data.user;
          let token = resData.data.token;
  
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          localStorage.setItem('expire', Date.now() + 24 * 60 * 60 * 1000)

          store.commit('setUser', user);
          window.location.reload()
        }
      }
    }
  }
  next()
})

export default router;
