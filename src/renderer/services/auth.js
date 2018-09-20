import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from 'router'
import auth from '@websanova/vue-auth'
import bearer from '@/services/auth/response'
import httpDriver from '@/services/auth/axios.1.x.js'
import routerDriver from '@websanova/vue-auth/drivers/router/vue-router.2.x.js'
import config from 'config'
// Use stuff
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = config.baseUrl
Vue.router = router

export const Auth = auth
export const Bearer = bearer
export const HttpDriver = httpDriver
export const RouterDriver = routerDriver
