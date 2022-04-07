var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// backen api

app.use('/api', (err, req, res, next) => {

  if (!err) {
      err = new Error('Unkown error');
  }

  if (req.app.get('env') !== 'production') {
      // eslint-disable-next-line no-console
      console.error(err);
  }

  let statusCode = err.errorCode ||
      err.statusCode ||
      err.status ||
      res.statusCode ||
      500;

  res.status(statusCode).json({
      statusCode: statusCode,
      name: err.name || 'Error',
      message: err.message || 'Unkown error'
  });
});
app.use((err, req, res, next) => {

  res.render('error', {
      title: 'The Movie DB'
  });
});


module.exports = app;
