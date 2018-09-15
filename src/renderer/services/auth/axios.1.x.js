export default {
  _init() {
    if (!this.options.Vue.axios) {
      return 'axios.js : Vue.axios must be set.'
    }
  },

  _interceptor(req, res) {
    const _this = this

    if (req) {
      this.options.Vue.axios.interceptors.request.use(request => {
        req.call(_this, request)
        return request
      }, error => {
        req.call(_this, error.request)
        return Promise.reject(error)
      })
    }

    if (res) {
      this.options.Vue.axios.interceptors.response.use(response => {
        res.call(_this, response)
        return response
      }, error => {
        if (error && error.response) {
          res.call(_this, error.response)
        }

        return Promise.reject(error)
      })
    }
  },

  /**
   * Override to logout with wrong token
   */
  _invalidToken(res) {
    if (res.status === 401 && res.data.message === 'Bad credentials') {
      this.options.logoutProcess.call(this, res, { redirect: this.options.authRedirect })
    }
  },

  _httpData(res) {
    return res.data || {}
  },

  _http(data) {
    this.options.Vue.axios(data).then(data.success, data.error)
  },

  _getHeaders(res) {
    return res.headers
  },

  _setHeaders(req, headers) {
    req.headers.common = Object.assign(req.headers.common, headers)
  }
}
