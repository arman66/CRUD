const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const passport=require('passport');
const session= require('express-session');

// load environment variables fromt eh .env file
require('dotenv').config();
//run thte code that sets up the mongoose database conection
require('./config/mongoose-setup');
require('./config/passport-setup');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Lets--Keep--Score';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(
  session({
    resave:true,
    saveUninitialized: true,
    secret: 'this string is to avoid errors'
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
  res.locals.currentUser= req.user;
  next();
});

//routers
const index = require('./routes/index');
app.use('/', index);


//routes
const myTeamRouter = require('./routes/team-router');

app.use(myTeamRouter);

const myMatchRouter= require('./routes/match-router');

app.use(myMatchRouter);




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
