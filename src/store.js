import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('user') ?  JSON.parse(localStorage.getItem('user')): {}
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  }
})
