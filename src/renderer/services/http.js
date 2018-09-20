import axios from 'axios'
import config from '@/config/index'

export const HTTP = axios.create({
  baseURL: config.baseUrl,
  auth: false
})
