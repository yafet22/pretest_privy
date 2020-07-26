  
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem('token'),
    isAlreadyRegister: false
  },
  mutations: {
    loginUser (state) {
      state.isLoggedIn = true
    },
    logoutUser (state) {
      state.isLoggedIn = false
    },
    storeRegister (state) {
      state.isAlreadyRegister = true
    },
    deleteRegister (state) {
      state.isAlreadyRegister = false
    }
  },
  actions: {
  },
  modules: {
  }
})