var request = require('request');
var qs = require('querystring');

module.exports = {

  endpoint: 'https://www.cloudflare.com/api_json.html',
  email: '',
  token: '',

  auth: function(email, token) {
    this.email = email;
    this.token = token;
    return this;
  },

  send: function(endpoint, params, fn) {
    params.email = this.email;
    params.tkn = this.token;
    params.a = endpoint;

    request.post({
      url: this.endpoint + '?' + qs.stringify(params),
    }, fn);
  },

  handleError: function(response, exits) {

    switch (response.err_code) {

      case 'E_UNAUTH':
        return exits.notAuthorized(response.msg);

      case 'E_INVLDINPUT':
        return exits.invalidInput(response.msg);

      case 'E_MAXAPI':
        return exits.apiLimit(response.msg);

      default:
        return exits.error(response.msg);

    }

  }

};