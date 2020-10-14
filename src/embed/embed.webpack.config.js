const webpack = require('webpack')
const path = require('path');

webpack({
  mode: process.env.NODE_ENV || 'production',
  entry: './src/embed/embed.js',
  output: {
    filename: 'embed.js',
    path: path.resolve(__dirname, '..', '..', 'build'),
  },
}, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    process.exit(1);
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
    process.exit(1);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
    process.exit(1);
  }
});
