var meta = require('../package')

module.exports = function() {
  throw new Error(meta.name + ' has only a command-line interface.') }
