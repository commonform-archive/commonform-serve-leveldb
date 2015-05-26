var bole = require('bole');
var docopt = require('docopt');
var fs = require('fs');
var http = require('http');
var leveldown = require('leveldown');
var levelup = require('levelup');
var meta = require('../package');
var path = require('path');
var serve = require('commonform-serve');

var meta = require('../package.json');
var usage = fs.readFileSync(path.join(__dirname, 'usage.txt'))
  .toString();

module.exports = function(stdin, stdout, stderr, env, argv, callback) {
  var options;
  try {
    options = docopt.docopt(usage, {
      argv: argv,
      help: false,
      exit: false
    });
  } catch (error) {
    stderr.write(error.message + '\n');
    callback(1);
    return;
  }
  if (options['--version'] || options['-v']) {
    stdout.write(meta.name + ' ' + meta.version + '\n');
    callback(0);
  } else if (options['--help'] || options['-h']) {
    stdout.write(usage + '\n');
    callback(0);
  } else {
    var path = options['--data-path'];
    var port = options['--port'];
    var level = levelup(path, {db: leveldown});
    bole.output({level: 'debug', stream: process.stdout});
    var logger = bole(meta.name + ' ' + meta.version);
    http.createServer(serve(logger, level))
      .on('listening', function() {
        logger.info({port: this.address().port});
        logger.info({data: path});
      })
      .listen(port);
  }
};
