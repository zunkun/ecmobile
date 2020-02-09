import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import global from './global'
import * as dd from 'dingtalk-jsapi'
import router from './router'
import VueRouter from 'vue-router'
import 'vant/lib/index.css'
import 'vant/lib/icon/local.css';

import {
  Row,
  Col,
  Popup,
  Loading,
  Panel,
  Cell,
  CellGroup,
  Field,
  Button,
  Icon,
  Search,
  IndexBar,
  IndexAnchor,
  Picker,
  Dialog,
  Toast,
  Tabbar, 
  TabbarItem,
  Tab, 
  Tabs,
  Image,
  List,
  Step, 
  Steps,
  Collapse,
  CollapseItem
} from 'vant';
Vue.use(Popup);
Vue.use(Loading);
Vue.use(Panel)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Field)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Icon)
Vue.use(Search)
Vue.use(IndexBar)
Vue.use(IndexAnchor);
Vue.use(Picker)
Vue.use(Dialog);
Vue.use(Toast);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Image);
Vue.use(List);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Collapse);
Vue.use(CollapseItem)

Vue.config.productionTip = false;
Vue.prototype.GLOBAL = global;
Vue.prototype.$http = axios;
Vue.prototype.$dd = dd;
Vue.use(VueRouter)

let localToken = localStorage.getItem('token');
let expire = Number(localStorage.getItem('expire')) || 0;

if(localToken) {
    axios.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem('token');
    return config;
  }, err => {
    return Promise.reject(err);
  });
}

axios.get(`/ecapi/api/auth/login?userId=4508346521365159`)
.then(async res => {
  let resData = res.data;
  if (resData.errcode === 0) {
    let user = resData.data.user;
    let rule =resData.data.rule;
    let token = resData.data.token;

    if(localToken) {
      let localUser = JSON.parse(localStorage.getItem('user'))
      if(user.userId === localUser.userId) {
        return;
      }
    }

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('rule', JSON.stringify(rule));
    localStorage.setItem('token', token);
    localStorage.setItem('expire', Date.now() + 24 * 60 * 60 * 1000)

    axios.interceptors.request.use(config => {
      config.headers.Authorization = localStorage.getItem('token');
      return config;
    }, err => {
      return Promise.reject(err);
    });
  }
}).catch(() => {})

// alert(localToken)
// 登录
let corpId = 'ding9f71dd70c3adb557'
dd.ready(() => {
  dd.runtime.permission.requestAuthCode({
    corpId,
    onSuccess: function (result) {
      axios.get(`/ecapi/api/auth/login?corpId=${corpId}&code=${result.code}`)
        .then(async res => {
          let resData = res.data;
          if (resData.errcode === 0) {
            let user = resData.data.user;
            let token = resData.data.token;
            let rule = resData.data.rule;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('rule', JSON.stringify(rule));
            localStorage.setItem('token', token);
            localStorage.setItem('expire', Date.now() + 24 * 60 * 60 * 1000)

            axios.interceptors.request.use(config => {
              config.headers.Authorization = token;
              return config;
            }, err => {
              return Promise.reject(err);
            });
          }
        }).catch(() => {})
    },
    onFail: function (error) {
      alert(JSON.stringify(error))
    }
  });
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 签名
dd.ready(() => {
  axios.get('/ecapi/api/auth/signature?platform=ecmobile&url=' + window.location.href.split("#")[0]).then(res => {
    let resData = res.data;
    if (resData.errcode !== 0) return;
    let sig = resData.data;
    localStorage.setItem('config', JSON.stringify(resData.data));
    dd.config({
      agentId: sig.agentId, // 必填，微应用ID
      corpId: sig.corpId, //必填，企业ID
      timeStamp: sig.timeStamp, // 必填，生成签名的时间戳
      nonceStr: sig.nonceStr, // 必填，生成签名的随机串
      signature: sig.signature, // 必填，签名
      type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
      jsApiList: [
        'runtime.info',
        'biz.contact.choose',
        'biz.util.datepicker',
        'biz.contact.complexPicker'
      ] // 必填，需要使用的jsapi列表，注意：不要带dd。
    });
  })
});
