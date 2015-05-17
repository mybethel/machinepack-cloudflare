module.exports = {
  friendlyName: 'Edit DNS record',
  description: 'Edit a DNS record for a zone',
  moreInfoUrl: 'https://www.cloudflare.com/docs/client-api.html#s5.2',
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
    },
    type: {
      example: 'A',
      description: 'Type of DNS record.',
      extendedDescription: 'Values include: A/CNAME/MX/TXT/SPF/AAAA/NS/SRV/LOC',
      required: true
    },
    name: {
      example: 'sub',
      description: 'Name of the DNS record.',
      required: true
    },
    content: {
      example: '96.126.126.36',
      description: 'The content of the DNS record, will depend on the the type of record being added.',
      required: true
    },
    ttl: {
      example: '1',
      description: 'The TTL of record in seconds.',
      extendedDescription: '1 = Automatic, otherwise, value must in between 120 and 86400 seconds.',
      required: true
    },
    onCloudflare: {
      example: 1,
      description: 'Status of CloudFlare Proxy.',
      extendedDescription: 'Applies to A/AAAA/CNAME.',
      required: false
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
      description: 'Returns the created DNS record.',
      example: {
        'rec_id': '23734516',
        'rec_tag': 'b3db8b8ad50389eb4abae7522b22852f',
        'zone_name': 'example.com',
        'name': 'sub.example.com',
        'display_name': 'sub',
        'type': 'A',
        'prio': null,
        'content': '96.126.126.36',
        'display_content': '96.126.126.36',
        'ttl': '1',
        'ttl_ceil': 86400,
        'ssl_id': '12805',
        'ssl_status': 'V',
        'ssl_expires_on': null,
        'auto_ttl': 1,
        'service_mode': '0',
        'props': {
          'proxiable': 1,
          'cloud_on': 0,
          'cf_open': 1,
          'ssl': 1,
          'expired_ssl': 0,
          'expiring_ssl': 0,
          'pending_ssl': 0,
          'vanity_lock': 0
        }
      }
    }
  },
  fn: function (inputs, exits) {

    var Cloudflare = require('../cloudflare.js');
    var params = {
      z: inputs.domain,
      type: inputs.type,
      name: inputs.name,
      id: inputs.recordId,
      content: inputs.content,
      ttl: inputs.ttl,
      service_mode: inputs.onCloudflare
    };

    Cloudflare.auth(inputs.email, inputs.token).send('rec_edit', params, function (err, response, body) {
      if (err)
        return exits.error(err);

      if (response.statusCode > 299 || response.statusCode < 200)
        return exits.error(response.statusCode);

      response = JSON.parse(response.body);

      if (response.result === 'error')
        return Cloudflare.handleError(response, exits);

      return exits.success(response.response.rec.obj);
    });

  }
};
