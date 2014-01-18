
/**
 * Module dependencies.
 */

var express = require('express');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var config = require('./config.js');
var auth = require('./helpers/auth.js');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('secret', config.secret);
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(auth(app.get.bind(app, 'secret')));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', user.list);
app.post('/', user.push);
app.del('/', user.clearAll);

if(!module.parent) {
  app.listen(app.get('port'), function () {
      console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
  });
}

module.exports = app;