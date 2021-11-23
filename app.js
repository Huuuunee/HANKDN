// var createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/login');
const app = express();
const passport = require('./controller/passport');
require('passport')
const expressSession = require('express-session');
const fileStore = require('session-file-store')(expressSession);
const flash = require('connect-flash');
const post = require('./routes/post')
const recipe = require('./routes/recipe')

const email = require('./routes/email2')
const hostname = '10.120.74.70'

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


app.use(express.static('images'));
app.use(logger('dev'));
app.use(express.json({
  limit: '1mb'
}));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(cookieParser());

app.use(expressSession({
  secret: 'wdadwdsad',
  resave: false,
  saveUninitialized: false,
  store : new fileStore()
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

app.use('/', indexRouter);
app.use('/', email);
app.use('/', post);
app.use('/', recipe);



app.listen(3000, hostname, () => {
    console.log('서버 3000번 포트')
})