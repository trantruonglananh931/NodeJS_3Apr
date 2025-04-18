var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var {CreateErrorRes} = require('./utils/ResHandler')
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRoutes = require('./routes/upload');
var session = require('express-session');

var app = express();
app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
  
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'ban-co-the-dat-chuoi-bi-mat-o-day',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // session sống 1 tiếng
}));

app.use('/', indexRouter);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/users', usersRouter);
app.use('/roles', require('./routes/roles'));
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));
app.use('/cart', require('./routes/cart'));
app.use('/order', require('./routes/order'));
//
mongoose.connect('mongodb://localhost:27017/C5');
mongoose.connection.on('connected',function(){
  console.log("connected");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  CreateErrorRes(res,err.status||500,err)
});


module.exports = app;
