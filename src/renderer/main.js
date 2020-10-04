import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
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
Vue.use(AsyncComputed)


// Sync up!
sync(store, router)

// Import global modules
Vue.component('Pagination', pagination)

// Stop! App Time
/* eslint-disable no-new */
new Vue({
  router,
  store,
  ...App
}).$mount('#app')

// Ship it!
// export { app, router, store }
