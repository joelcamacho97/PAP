var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');
var compression = require('compression');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs-extra');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var configDB = require('./config/database.js');

// Configuração ===============================================================

mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport, app); // pass passport for configuration

// set up our express application
app.use(compression()); //use compression 
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch'
    , resave: true
    , saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));

require('./app/routes.js')(app, passport, fs);
require('./config/upload.js')(app, fs);

app.use(function(req, res, next) {
  res.status(404).redirect('../');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).redirect('../');
});

app.listen(port);
console.log('Cloud ligada e conectada ha porta numero :' + port);
