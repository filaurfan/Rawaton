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

// var users{};
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

// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(app);



//Whenever someone connects this gets executed
// io.on('connection', function(socket){
//   socket.on('new user', function(data, callback){
//     if (data in users) {
//       callback(false);
//     } else{
//       callback(true);
//       socket.nickname = data;
//       users[socket.nickname] = socket;
//       updateNicknames();
//     }
//   });

//   function updateNicknames(){
//     io.socket.emit('usernames', Object.key[users]);
//   }

//   socket.on('send message', function(data, callback){
//     var msg  = data.trim();
//     if (msg.substr(0, 3) === '/w') {
//       msg=msg.substr(3);
//       var ind = msg.indexOf(' ');
//       if (ind !== -1) {
//         var name = msg.substring(0, ind);
//         var msg = msg.substring(ind + 1);
//         if (name in users) {
//           user[name].emit('wispher', {msg: msg, nick: socket.nickname});
//           console.log("WHISPER!");
//         }else{
//           callback("errrorrr wisper");
//         }
        
//       }
//       else{
//         callback("Errorrorororoor");
//       }
//     }else{
//       io.socket.emit('new message', {msg: data, nick: socket.nickname});
//     }
//   });

//   socket.on('disconnect', function(data){
//     if (!socket.nickname) return;
//     delete users[socket.nickname];
//     nicknames.splice(nicknames.indexOf(socket.nickname), 1);
//     updateNicknames();
//   });
//   // console.log('A user connected');

  // //Send a message after a timeout of 4seconds
  // setTimeout(function(){
  //   socket.send('Sent a message 4seconds after connection!');
  // }, 4000);

  // //Whenever someone disconnects this piece of code executed
  // socket.on('disconnect', function () {
  //   console.log('A user disconnected');
  // });

// });


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

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });