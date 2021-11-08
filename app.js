// var createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const app = express();
const passport = require('./passport');
require('passport')
const expressSession = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv')
const email = require('./routes/email')

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

dotenv.config({ path: path.join(__dirname, 'path/to/.env') })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
app.use(expressSession({
  secret: 'wdadwdsad',
  resave: false,
  saveUninitialized: true
}))

app.use('/', indexRouter);



app.listen(3000, () => {
    console.log('서버 3000번 포트')
})