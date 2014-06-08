var express = require('express');



var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var passport = require('passport');

// New Code
var mongo = require('mongodb');
var monk = require('monk');

var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
var mongoUser = process.env.MONGO_USER || '';
var mongoPass = process.env.MONGO_PASSWORD || '';
var mongoDb = process.env.MONGO_DB || '';

var mongoString = '';
var app = express();
if (process.env.OPENSHIFT_MONGODB_DB_HOST) {
    mongoString = 'mongodb://' + mongoUser + ':' + mongoPass + '@' + mongoHost + ':' + mongoPort + '/' + mongoDb;

} else {
    mongoString = 'mongodb://' + mongoHost + ':' + mongoPort + '/' + mongoDb;
}

//connect to mongo
var db = monk(mongoString, function (err) {
    if (err) console.log(err);
});

var nodemailer = require("nodemailer");


var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
});


var routes = require('./routes/index');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'keyboard cat'
}))


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


require('./config/passport.js')(passport); // pass passport for configuration



var auth = function (req, res) {

    var map = {};
    map.isAuthenticated = req.isAuthenticated();
    map.user = req.user;

    return map;
}

// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    req.smtpTransport = smtpTransport;
    res.locals.auth = auth(req, res);
    next();
});

require('./config/routes.js')(app, passport);

app.use('/', routes);


/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});





module.exports = app;