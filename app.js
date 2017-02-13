var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var multer = require('multer');
var fs = require('fs');

mongoose.connect('mongodb://filaurfan:rawaton123@ds131109.mlab.com:31109/rawaton');  //---> loginapp
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var seller = require('./routes/seller');
var cart = require('./routes/cart');
var chat = require('./routes/chat');

// Init App
var app = express();

app.use(favicon(__dirname + '/public/images/favicon.ico'));
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

// Connect Flash
app.use(flash());

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// users = [];
// app.io.on('connection', function(socket){
//   console.log('A user connected');
//   socket.on('setUsername', function(data){
//     console.log(data);
//     if(users.indexOf(data) > -1){
//       socket.emit('userExists', data + ' username is taken! Try some other username.');
//     }
//     else{
//       users.push(data);
//       socket.emit('userSet', {username: data});
//     }
//   });
//   socket.on('msg', function(data){
//       //Send message to everyone
//       io.sockets.emit('newmsg', data);
//   })
// });

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//cuma tambah komnetar untuk branch ajaaaaa

app.use('/', routes);
app.use('/users', users);
app.use('/seller', seller);
app.use('/cart', cart);
app.use('/chat', chat);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
