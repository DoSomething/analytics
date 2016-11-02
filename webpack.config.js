var configure = require('@dosomething/webpack-config');

var config = configure({
  entry: { Analytics: './index.js' },
});

// Attach the pre-built library to `window.Analytics`.
config.output.library = 'Analytics';

module.exports = config;
