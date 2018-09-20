import Vue from 'vue'
import 'bootstrap'
import 'daemonite-material'
import { sync } from 'vuex-router-sync'
import App from 'App'
import router from 'router'
import store from 'store'
import pagination from '@/services/pagination/pagination'
import { Auth, Bearer, HttpDriver, RouterDriver } from '@/services/auth'
import VueTinyLazyloadImg from 'vue-tiny-lazyload-img'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(VueTinyLazyloadImg)
// Setup auth
Vue.use(Auth, {
  auth: Bearer,
  http: HttpDriver,
  router: RouterDriver,
  fetchData: { url: 'api/user', method: 'GET', enabled: true },
  registerData: { url: 'api/register', method: 'POST', redirect: '/login' },
  loginData: {
    url: 'api/login_check', method: 'POST', redirect: { name: 'home', redirect: true }, fetchUser: true
  },
  logoutData: {
    url: 'api/logout', method: 'POST', redirect: '/', makeRequest: false
  },
  refreshData: {
    url: 'api/token/refresh',
    method: 'GET',
    enabled: true,
    interval: 30
  },
  parseUserData(data) {
    return data
  }
})

// Sync up!
sync(store, router)

// Import global modules
Vue.component('pagination', pagination)

// Stop! App Time
/* eslint-disable no-new */
new Vue({
  router,
  store,
  ...App
}).$mount('#app')

// Ship it!
// export { app, router, store }
