'use strict';

var keenClient = null;

/**
 * Read a cookie from the browser based on the given cookie name.
 * @see: https://stackoverflow.com/a/44582793/2129670
 *
 * @param name
 * @return cookie
 */
function getCookie(name) {
  const match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  return match ? match[1] : '';
}

/**
 * Check if Google Analytics is safe for use.
 *
 * @return Boolean
 */
function isGoogleAnalyticsSafe() {
  return typeof window.ga !== 'undefined' && window.ga !== null;
}

/**
 * Send a custom analytics event to Google, Optimizely & Keen.io.
 *
 * @param category
 * @param action
 * @param label
 */
function analyze(identifier, data) {
  var identifiers = identifier.split(':');

  var category = identifiers[0];

  // Log analytics events to the console for developers.
  if (process.env.NODE_ENV !== 'production') {
      console.groupCollapsed('%c Analytics: %c Triggered event "%s"',
        'background-color: #FFFBCC; display: block; font-weight: bold; line-height: 1.5;',
        'background-color: transparent; font-weight: normal; line-height: 1.5;',
        identifier
      );
      console.log('Parsed Identifiers:', {category: category, action: identifiers[1], label: identifiers[2]});
      if (data) {
        console.log('Keen.io Payload:', data);
      }
      console.groupEnd();
  }

  // Send custom event to Google Analytics
  if (isGoogleAnalyticsSafe()) {
    ga('send', 'event', category, identifiers[1], identifiers[2]);
  }

  // Send the event to Optimizely for tracking conversions.
  if (window.optimizely) {
    window.optimizely.push(["trackEvent", identifier]);
  }

  // Send the data to keen.io
  if (data && keenClient) {
    keenClient.addEvent(category, data);
  }
}

/**
 * Send a custom page view event to Google.
 *
 * @param category
 * @param action
 * @param label
 */
function pageview(url) {
    // Log analytics events to the console for developers.
    if (process.env.NODE_ENV !== 'production') {
        console.log('%c Analytics: %c Visited page "%s"',
          'background-color: #FFFBCC; display: block; font-weight: bold; line-height: 1.5;',
          'background-color: transparent; font-weight: normal; line-height: 1.5;',
          url
        );
    }

    // Send custom event to Google Analytics
    if (isGoogleAnalyticsSafe()) {
        ga('send', 'pageview', url);
    }
}

/**
 * Set a custom dimension for future page views and events
 * @param name
 * @param cookieId
 */
function dimension(name, value) {
  if (value) {
    console.log('%c Analytics: %c Set dimension "%s"',
      'background-color: #FFFBCC; display: block; font-weight: bold; line-height: 1.5;',
      'background-color: transparent; font-weight: normal; line-height: 1.5;',
      name
    );

    if (isGoogleAnalyticsSafe()) {
      ga('set', name, value);
    }
  }
}

/**
 * Set a custom dimension for future page views and events based on a users cookie
 *
 * @param name
 * @param cookieId
 */
function dimensionByCookie(cookieId) {
  dimension(cookieId, getCookie(cookieId))
}

/**
 * Register our custom event handlers as delegated events on the body.
 */
function init(namespace, bindGlobal, keenAuth) {
  namespace = namespace || 'track';
  bindGlobal = bindGlobal || true;

  if (bindGlobal) {
    window.analyze = analyze;
  }

  if (keenAuth) {
    keenClient = new Keen(keenAuth);
  }

  document.body.addEventListener('click', function(event) {
    if (event.target && event.target.getAttribute('data-' + namespace + '-category') !== null) {
      var el = event.target;
      analyze(
        el.getAttribute('data-' + namespace + '-category'),
        el.getAttribute('data-' + namespace + '-action'),
        el.getAttribute('data-' + namespace + '-label')
      );
    }
  });
}

module.exports = {
  init: init, analyze: analyze, pageview: pageview,
  dimension: dimension, dimensionByCookie: dimensionByCookie,
};
