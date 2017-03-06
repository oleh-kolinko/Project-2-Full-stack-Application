const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
// const passport     = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const FbStrategy    = require('passport-facebook').Strategy;
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const bcrypt        = require('bcrypt');
// const flash         = require('connect-flash');
// const dotenv        = require('dotenv');

const User          = require('./models/user-model.js');

mongoose.connect('mongodb://localhost/beekeeping-inspection-app');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
// app.locals.title = 'Express - Generated with IronGenerator';
app.locals.title = 'God save the Bees';


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(session({
  // secret is key of encryption. It is different in every session
  secret: 'Sessions are hard dude',
  // idle time in mili seconds, can be set to null
  cookie: { maxAge: 6000},
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}));

const index = require('./routes/index');
const authRoutes = require('./routes/auth-routes');
const siteRoutes = require('./routes/site-routes');
app.use('/', index);
app.use('/', authRoutes);
app.use('/', siteRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
