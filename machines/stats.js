module.exports = {
  friendlyName: 'Stats',
  description: 'Retrieve domain statistics for a given time frame',
  moreInfoUrl: 'https://www.cloudflare.com/docs/client-api.html#s3.1',
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
    interval: {
      example: 20,
      description: 'The The time interval for the statistics.',
      extendedDescription: 'For these values, the latest data is from one day ago: 20 = Past 30 days, 30 = Past 7 days, 40 = Past day. These values are for Pro accounts: 100 = 24 hours ago, 110 = 12 hours ago, 120 = 6 hours ago.',
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
      description: 'Returns the current stats and settings for a particular website.',
      example: {
        'timeZero': 1333051372000,
        'timeEnd': 1335643372000,
        'count': 1,
        'has_more': false,
        'objs': [
          {
            'cachedServerTime': 1335816172000,
            'cachedExpryTime': 1335859372000,
            'trafficBreakdown': {
                'pageviews': {
                'regular': 2640,
                'threat': 27,
                'crawler': 4
              },
              'uniques': {
                'regular': 223,
                'threat': 16,
                'crawler': 4
              }
            },
            'bandwidthServed': {
              'cloudflare': 78278.706054688,
              'user': 58909.374023438
            },
            'requestsServed': {
              'cloudflare': 4173,
              'user': 3697
            },
            'pro_zone': false,
            'pageLoadTime': null,
            'currentServerTime': 1335824051000,
            'interval': 20,
            'zoneCDate': 1307574643000,
            'userSecuritySetting': 'Medium',
            'dev_mode': 0,
            'ipv46': 5,
            'ob': 0,
            'cache_lvl': 'agg'
          }
        ]
      }
    }
  },
  fn: function (inputs, exits) {

    var Cloudflare = require('../cloudflare.js');
    var params = {
      z: inputs.domain,
      interval: inputs.interval
    };

    Cloudflare.auth(inputs.email, inputs.token).send('stats', params, function (err, response, body) {
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
