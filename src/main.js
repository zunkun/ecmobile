import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import global from './global'
import * as dd from 'dingtalk-jsapi'
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
Vue.config.productionTip = false;
Vue.prototype.GLOBAL = global;
Vue.prototype.$http = axios;

let localToken = localStorage.getItem('token');

if (!localToken) {
  dd.ready(function () {
    // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
    dd.runtime.permission.requestAuthCode({
      corpId: global.corpId,
      onSuccess: function (result) {
        alert(JSON.stringify(result))
        axios.get(`/ec/api/auth/login?corpId=${global.corpId}&code=${result.code}`).then(async res => {
          let resData = res.data;
          if (resData.errcode === 0) {
            let user = resData.data.user;
            let token = resData.data.token;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            store.commit('setUser', user)
          }
        })
      },
      onFail: function () {
        alert('获取用户信息失败')
      }
    });
  });
}


axios.get(`/ec/api/auth/login2`).then(async res => {
  let resData = res.data;
  if (resData.errcode === 0) {
    let user = resData.data.user;
    let token = resData.data.token;

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);

    store.commit('setUser', user)
  }
})

axios.interceptors.request.use(config => {
  config.headers.Authorization = localToken;
  return config;
}, err => {
  return Promise.reject(err);
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')