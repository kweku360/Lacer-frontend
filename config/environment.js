/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'lacer',
    environment: environment,
    baseURL: '/',
    "liveReload": false,
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    contentSecurityPolicyHeader: 'Content-Security-Policy',
    contentSecurityPolicy: {
      // ... other stuff here
      'connect-src': "'self' http://localhost:8888 https://www.googleapis.com/urlshortener/v1/url http://41.77.66.36/bulksms/api/sendsms",
      'default-src': "'self'"
      //'object-src': "'self' http://localhost:8888/lacerapi/uploads/"
      //'connect-src': "'self' http://104.131.190.2:8009"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }


  return ENV;
};
