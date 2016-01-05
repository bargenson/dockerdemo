module.exports = (function () {

  "use strict";

  var CONNECTION_EVENT = 'Connection';
  var DISCONNECTION_EVENT = 'Disconnection';

  var connectedUsersChannel = 'connectedUsersChannel';
  var express = require('express');
  var cookieParser = require('cookie-parser');
  var logger = require("./utils/logger");
  var config = require('./config');
  var redis = require('redis');
  var os = require("os");

  var app = express();

  logger.debug("Overriding 'Express' logger");
  app.use(require('morgan')("combined", { stream: logger.stream }));

  function createRedisClient() {
    return redis.createClient(config.redis);
  }

  app.get('/streams/users/connected', function (req, res) {
    req.socket.setTimeout(Number.MAX_SAFE_INTEGER);

    var connectedUsers;
    var subscriber = createRedisClient();
    var publisher = createRedisClient();
    
    subscriber.on('subscribe', function (err) {
      logger.debug(req.ip, 'Opening connection...');
      publisher.publish(connectedUsersChannel, CONNECTION_EVENT);
    });

    subscriber.on('error', function (err) {
      logger.debug(req.ip, 'Redis Error', err);
      res.end("Redis Error: " + err);
    });

    subscriber.on('message', function (channel, message) {
      if (connectedUsers) {
        logger.debug(req.ip, 'Updating subscribed users...');
        if (message === CONNECTION_EVENT) {
          connectedUsers += 1;
        } else if (message === DISCONNECTION_EVENT) {
          connectedUsers -= 1;
        }
        res.write('data: ' + connectedUsers + '\n\n');
      } else {
        logger.debug(req.ip, 'Getting subscribed users...');
        createRedisClient().pubsub('NUMSUB', connectedUsersChannel, function (err, replies) {
          if (err) {
            logger.debug(req.ip, 'Redis Error', err);
            res.end("Redis Error: " + err);
          } else {
            if (replies && replies.length >= 2) {
              connectedUsers = replies[1];
            } else {
              logger.debug(req.ip, 'Unknown channel', connectedUsersChannel);
              connectedUsers = 0;
            }
            res.write('data: ' + connectedUsers + '\n\n');
          }
        });
      }
    });

    subscriber.subscribe(connectedUsersChannel);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\ndata: ' + os.hostname() + '\n\n');

    req.on("close", function () {
      logger.debug(req.ip, 'Closing connection');
      subscriber.unsubscribe();
      subscriber.quit();
      publisher.publish(connectedUsersChannel, DISCONNECTION_EVENT);
      publisher.quit();
    });

  });

  return app;

}());
