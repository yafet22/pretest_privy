import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import vuetify from './plugins/vuetify'
import './css/main.scss'

Vue.prototype.$http = Axios
Vue.prototype.$apiurl = 'https://cors-anywhere.herokuapp.com/http://pretest-qa.dcidev.id/api/v1'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
