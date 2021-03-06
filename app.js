var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var jade = require('jade');
var override = require('method-override');

var app = express();

var Firebase = require('firebase');
var firebase = new Firebase('https://hackenstance.firebaseio.com/');

var geoFire = new GeoFire(firebase);

geoFire.get('users').then(function(users) {
    users.forEach(function(user) {
        if(user.location === null) {
            console.log('Key not in GeoFire');
        } else {
            console.log('location is: ' + location);
        }
    });
}, function(error) {
    console.log('Error! ' + error);
});

//var config = require('./config/config.json');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(override('X-HTTP-Method-Override'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/facebook', function(req, res) {
    firebase.child('users/' + req.query.id + '/facebook/accessToken').on('value', function(data) {
      res.send(data.val());
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

app.set('port', (process.env.PORT || 5000));
var server = app.listen(app.get('port'), function () {

  var host = server.address().address
  var port = server.address().port

  console.log('app listening at http://localhost:', app.get('port'))

})
