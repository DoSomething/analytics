'use strict';

let keenClient = null;

/**
 * Send a custom analytics event to Google & Optimizely.
 *
 * @param category
 * @param action
 * @param label
 */
function analyze(identifier, data) {
  const identifiers = identifier.split(':');

  const category = identifiers[0];
  const action = identifiers[1];
  const label = identifiers[2];

  if (process.env.NODE_ENV !== 'production') {
    console.info('Sent an analytics event - ' + stringified)
  }

  // Send custom event to Google Analytics
  if (typeof window.ga !== 'undefined' && window.ga !== null) {
    ga('send', 'event', category, action, label);
  }

  // Send the event to Optimizely for tracking conversions.
  if (window.optimizely) {
    window.optimizely.push(["trackEvent", stringified]);
  }

  // Send the data to keen.io
  if (data && keenClient) {
    keenClient.addEvent(category, data);
  }
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
      const el = event.target;
      analyze(
        el.getAttribute('data-' + namespace + '-category'),
        el.getAttribute('data-' + namespace + '-action'),
        el.getAttribute('data-' + namespace + '-label')
      );
    }
  });
}

module.exports = { init: init, analyze: analyze };
