module.exports = {
  friendlyName: 'Delete DNS record',
  description: 'Delete a record for a domain.',
  inputs: {
    token: {
      example: '8afbe6dea02407989af4dd4c97bb6e25',
      description: 'The API key made available on your Cloudflare account page.',
      required: true,
      whereToGet: {
        url: 'https://www.cloudflare.com/my-account',
        description: 'The API key is found at the bottom of your Account page.',
      }
    },
    email: {
      example: 'sample@example.com',
      description: 'The e-mail address associated with your Cloudflare account.',
      required: true,
    },
    domain: {
      example: 'example.com',
      description: 'The target domain.',
      required: true
    },
    recordId: {
      example: '9001',
      description: 'The DNS record ID.',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    notAuthorized: {
      description: 'Authentication could not be completed.'
    },
    invalidInput: {
      description: 'Some other input was not valid.'
    },
    apiLimit: {
      description: 'You have exceeded your allowed number of API calls.'
    },
    error: {
      description: 'An unexpected error occurred.',
    },
    success: {
      description: 'The DNS record was deleted.',
    }
  },

  fn: function (inputs,exits) {

    var Cloudflare = require('../cloudflare.js');
    var params = {
      z: inputs.domain,
      id: inputs.recordId
    };

    Cloudflare.auth(inputs.email, inputs.token).send('rec_delete', params, function (err, response, body) {
      if (err)
        return exits.error(err);

      if (response.statusCode > 299 || response.statusCode < 200)
        return exits.error(response.statusCode);

      response = JSON.parse(response.body);

      if (response.result === 'error')
        return Cloudflare.handleError(response, exits);

      return exits.success();
    });

  }
};
