import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from 'router'

import auth from '@websanova/vue-auth/src/v2.js';
import bearer from '@/services/auth/response'
import httpDriver from '@/services/auth/axios.1.x.js'
import routerDriver from '@websanova/vue-auth/src/drivers/router/vue-router.2.x.js';
import config from 'config'
// Use stuff
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = config.baseUrl

Vue.router = router



// Setup auth
Vue.use(auth, {
  plugins: {
    http: Vue.axios, // Axios
    // http: Vue.http, // Vue Resource
    router: Vue.router,
  },
  drivers: {
    auth: bearer,
    http: httpDriver, // Axios
    // http: driverHttpVueResource, // Vue Resource
    router: routerDriver
  },
  options: {
    fetchData:    { url: 'api/user', method: 'GET', enabled: true },
    registerData: { url: 'api/register', method: 'POST', redirect: '/login' },
    loginData:    {
      url:      'api/login_check',
      method:   'POST',
      redirect: { name: 'home', redirect: true }, fetchUser: true
    },
    logoutData:   {
      url: 'api/logout', method: 'POST', redirect: '/', makeRequest: false
    },
    refreshData:  {
      url:      'api/token/refresh',
      method:   'GET',
      enabled:  true,
      interval: 30
    },
    parseUserData(data)
    {
      return data
    }
  }
})

export const Auth = auth
export const Bearer = bearer
export const HttpDriver = httpDriver
export const RouterDriver = routerDriver
