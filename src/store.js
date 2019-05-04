import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    approvalCount: null,
    user: localStorage.getItem('user') ?  JSON.parse(localStorage.getItem('user')): {}
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setApprovalCount(state, approvalCount) {
      state.approvalCount = approvalCount || null;
    }
  }
})
