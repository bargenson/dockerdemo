module.exports = (function () {

  "use strict";

  var debug = require('../config').debug;
  var winston = require('winston');
  winston.emitErrs = true;

  var logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        level: debug ? 'debug' : 'info',
        handleExceptions: true,
        json: false,
        colorize: true
      })
    ],
    exitOnError: false
  });

  logger.stream = {
    write: function (message) {
      logger.info(message);
    }
  };

  logger.debug("The application is in debug mode");

  return logger;

}());