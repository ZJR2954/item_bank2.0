import Vue from 'vue'
import Vuex from 'vuex'

import user from './user.js'
import menu from './menu.js'
import option from  './option.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    removeAll(context) {
      context.commit('setUser', {});
      context.commit('setUserType', {});
      context.commit('setMenu', []);
      context.commit('setOption', []);
    }
  },
  modules: {
    user,
    menu,
    option
  }
})

export default store