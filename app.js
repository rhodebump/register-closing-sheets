var express = require('express');



var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');



require('./config/passport.js')(passport); // pass passport for configuration


// New Code
var mongo = require('mongodb');
var monk = require('monk');





var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
var mongoUser =  process.env.MONGO_USER|| '';
var mongoPass =  process.env.MONGO_PASSWORD|| '';
var mongoDb   =  process.env.MONGO_DB|| '';

var mongoString = 'mongodb://' + mongoUser + ':' + mongoPass + '@' + mongoHost + ':' + mongoPort + '/' + mongoDb;

//connect to mongo
var db= monk(mongoString, function(err){
  if (err) console.log(err);
});


var nodemailer = require("nodemailer");


var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user:  process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
});


var routes = require('./routes/index');
var daysheet = require('./routes/daysheet');



var app = express();


app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1")
 
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    req.smtpTransport = smtpTransport;
    next();
});

require('./config/routes.js')(app, passport);

app.use('/', routes);
//app.use('/users', users);
app.use('/daysheet', daysheet);





app.get('/api/daysheet/search', function (req, res) {

    var db = req.db;
    var startdate = req.param('startdate');
    var enddate = req.param('enddate');

    var store = req.param('store');
    console.log('store', req.params);
    var query = {};
    if (store) {
        query["store"] = store;
    }

    if (startdate && enddate) {

        query["processdate"] = {
            "$gte": startdate,
            "$lt": enddate
        };

    } else if (startdate) {
        query["processdate"] = {
            "$gte": startdate
        };

    } else if (enddate) {
        query["processdate"] = {
            "$lt": enddate
        };

    }
    console.log("query=", query);

    var collection = db.get('daysheetcollection');
    collection.find(query, {}, function (e, docs) {
        res.json(docs);
    });



})


app.get('/api/daysheet/:id', function (req, res) {

    var db = req.db;
    var id = req.params.id;
    var collection = db.get('daysheetcollection');
    collection.findOne({
        _id: id
    }, function (err, doc) {
        //s.json(doc);
        res.json(doc);
    });

})




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