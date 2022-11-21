const path = require('path')

module.exports = {
    entry: './script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    watch: true,
    watchOptions: {
      aggregateTimeout: 500,
      poll: 1000 // порверяем измемения раз в секунду
  }
}