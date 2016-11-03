'use strict';

/**
 * Send a custom analytics event to Google & Optimizely.
 *
 * @param category
 * @param action
 * @param label
 */
function analyze(category, action, label) {
    var stringified = [category, action, label]
      .filter(function(n) { return n; })
      .join(':');

    if (process.env.NODE_ENV !== 'production') {
        console.info('Sent an analytics event - ' + stringified)
    }

    // Send custom event to Google Analytics
    if (typeof window.ga !== 'undefined' && window.ga !== null) {
        ga('send', 'event', category, action, label);
    }

    // Send the event to Optimizely for tracking conversions.
    window.optimizely = window.optimizely || [];
    window.optimizely.push(["trackEvent", stringified]);
}

/**
 * Register our custom event handlers as delegated events on the body.
 */
function init(namespace, bindGlobal) {
    namespace = namespace !== undefined ? namespace : 'track';
    bindGlobal = bindGlobal !== undefined ? bindGlobal : true;

    if (bindGlobal) {
        window.analyze = analyze;
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
    })
}

module.exports = { init: init, analyze: analyze };

