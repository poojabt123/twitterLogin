var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'Login',
//   password: 'root',
//   port: 5432,
//   })
/**
 * Add consumer key, secret, call back url. require passport, passport-twitter and express-session
 */
var TWITTER_CONSUMER_KEY    = "4qW8kQyRPi4x4jKJGkB4DFKai";
var TWITTER_CONSUMER_SECRET = "8eLyqOhIhmMgdcnhKD1yKHb2EeV29GqYVqTKVQJcADGAcASKc2";
var callbackURL             = "https://localhost:3000/auth/twitter/callback";

var passport = require('passport');
var TwitterStrategy   = require('passport-twitter').Strategy;
var sess              = require('express-session');
var BetterMemoryStore = require('session-memory-store')(sess);

passport.use(new TwitterStrategy({
  consumerKey:    TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL:    callbackURL
},
  function(token, tokenSecret, profile, done) {
    done(null, profile);
  }
));

// Serialize and deserialize user information
passport.serializeUser(function(user, callback){
  callback(null, user);
});
passport.deserializeUser(function(object, callback){
  callback(null, object);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* add session cofig */
var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
app.use(sess({
  name: 'JSESSION',
  secret: 'MYSECRETISVERYSECRET',
  store:  store,
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Add route '/'

app.get('/', function(req, res){
  res.render('index', {user: req.user, title: "Nodejs Twitter Login with PassportJs and ExpressJs"});
});


/** Add twitter login and return methoods */
app.get('/twitter/login', passport.authenticate('twitter'));

app.get('/twitter/callback', passport.authenticate('twitter', {
  failureRedirect : '/'
}), 
  function(req, res){
    res.redirect('/')
  });

  // post request
  // app.post('/login',(req ,res)=>{
  //   const user = req.body;
  //   client.query(`insert into register (email , password ) values ('${user.email}', '${user.password}')`,(err, result) => {
  //   console.log(err, result)
  //   res.send(result)
  //   client.end()
  //   // res.send(result)
  //   })
  //   })


module.exports = app;