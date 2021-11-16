export default {

  request: function (req, token) {
    token = token.split(';')
    if (req.url === this.options.refreshData.url && token[1] !== 'undefined') {
      req.url += `?refresh_token=${token[1]}`
    }
    this.drivers.http.setHeaders.call(this, req, { Authorization: `Bearer ${token[0]}` })
  },

  response(res) {
    const headers =  this.drivers.http.getHeaders.call(this, res)
    let token = headers.Authorization || headers.authorization
    const data = this.drivers.http.httpData.call(this, res)
    if (token) {
      token = token.split(/Bearer:?\s?/i)
      return token[token.length > 1 ? 1 : 0].trim()
    } else if (data.token && data.refresh_token) {
      return `${data.token};${data.refresh_token}`
    }
  }
}
