export default {

  init: function () {
    if ( ! this.plugins.http) {
      return 'drivers/http/axios.js: http plugin has not been set.'
    }
  },

  interceptor: function (req, res) {
    var _this = this;

    if (req) {
      this.plugins.http.interceptors.request.use(function (request) {
        req.call(_this, request);

        return request;
      }, function (error) {
        req.call(_this, error.request);

        return Promise.reject(error);
      });
    }

    if (res) {
      this.plugins.http.interceptors.response.use(function (response) {
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
    return this.plugins.http(data);
  },

  getHeaders: function (res) {
    return res.headers;
  },

  setHeaders: function (req, headers) {
    req.headers.common = Object.assign({}, req.headers.common, headers);
  }
}
