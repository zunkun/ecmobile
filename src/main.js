import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import global from './global'
import * as dd from 'dingtalk-jsapi'
import 'vant/lib/index.css';

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
  Toast
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


Vue.config.productionTip = false;
Vue.prototype.GLOBAL = global;
Vue.prototype.$http = axios;
Vue.prototype.$dd = dd;


new Vue({
  render: h => h(App)
}).$mount('#app');

let localToken = localStorage.getItem('token');
let expire = Number(localStorage.getItem('expire')) || 0;

// 登录
if (!localToken || expire < Date.now()) {
  // dd.ready参数为回调函数，在环境准备就绪时触发，jsapi的调用需要保证在该回调函数触发后调用，否则无效。
  dd.ready(() => {
    dd.runtime.permission.requestAuthCode({
      corpId: global[process.env.NODE_ENV].corpId || 'dingcbcbb63d3edd5478',
      onSuccess: function (result) {
        axios.get(`/ec/api/auth/login?corpId=${global.corpId}&code=${result.code}`)
          .then(async res => {
            let resData = res.data;
            if (resData.errcode === 0) {
              let user = resData.data.user;
              let token = resData.data.token;
  
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('token', token);
              localStorage.setItem('expire', Date.now() + 24 * 60 * 60 * 1000)
  
              window.location.reload();
            }
          }).catch(() => {})
      },
      onFail: function (error) {
        alert(JSON.stringify(error))
        alert('获取用户信息失败')
      }
    });
  });

  if(process.env.NODE_ENV === 'development' && !localStorage.getItem('token')) {
    axios.get(`/ec/api/auth/login?userId=4508346521365159`)
    .then(async res => {
      let resData = res.data;
      if (resData.errcode === 0) {
        let user = resData.data.user;
        let token = resData.data.token;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        localStorage.setItem('expire', Date.now() + 24 * 60 * 60 * 1000)

        window.location.reload();
      }
    }).catch(() => {})
  }
} else {
  axios.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem('token');
    return config;
  }, err => {
    return Promise.reject(err);
  });
}

// 签名
dd.ready(() => {
  axios.get('/ec/api/auth/signature?platform=ecmobile&url=' + window.location.href.split("#")[0]).then(res => {
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

