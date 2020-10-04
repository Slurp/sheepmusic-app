export default {

  init: function () {
    if ( ! this.Vue.axios) {
      return 'axios.js : Vue.axios must be set.'
    }
  },

  interceptor: function (req, res) {
    var _this = this;

    if (req) {
      this.Vue.axios.interceptors.request.use(function (request) {
        req.call(_this, request);

        return request;
      }, function (error) {
        req.call(_this, error.request);

        return Promise.reject(error);
      });
    }

    if (res) {
      this.Vue.axios.interceptors.response.use(function (response) {
        res.call(_this, response);

        return response;
      }, function (error) {
        console.log(error)
        if (error && error.response) {
          res.call(_this, error.response);
        }

        return Promise.reject(error);
      });
    }
  },

  /**
   * Override to logout with wrong token
   */
  invalidToken(res) {
    if (res.status === 401 || res.status === 485) {
      this.logout({
            makeRequest: false,
            redirect: '/login',
          }).then(() => { console.log('logout')});
    }
  },

  httpData: function (res) {
    return res.data || {};
  },

  http: function (data) {
    return this.Vue.axios(data);
  },

  getHeaders: function (res) {
    return res.headers;
  },

  setHeaders: function (req, headers) {
    req.headers.common = Object.assign({}, req.headers.common, headers);
  }
}
