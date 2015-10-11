// Dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var mongoose = require('mongoose');
var database = require('./models/database.js');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// General config
mongoose.connect(database.url);
app.use(bodyParser.urlencoded({
	'extended' : 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());
// app.use(require('express-session')({
// secret : 'ankaaijijie',
// resave : false,
// saveUninitialized : false
// }));
app.use(passport.initialize());
app.use(passport.session());// passport is for user authentication

// Setting up router
var router = express.Router();
app.use('/', router);

// DB MODELS

var Subject = require('./models/subjects.js');
passport.use('subject', new LocalStrategy(Subject.authenticate()));
passport.serializeUser(Subject.serializeUser());
passport.deserializeUser(Subject.deserializeUser());
var Tracker = require('./models/trackers.js');
passport.use('tracker', new LocalStrategy(Tracker.authenticate()));
passport.serializeUser(Tracker.serializeUser());
passport.deserializeUser(Tracker.deserializeUser());

// PASSPORT STRATEGIES CONFIG
// passport.use(new LocalStrategy({
// usernameField : 'username',
// passwordField : 'password',
// passReqToCallback : true
// }, function(req, username, password, done) {
// console.log('in CB of new LocalStrategy');
// if (req.body.userType === 'Tracker') {
// Tracker.findOne({
// username : username
// }, function(err, tracker) {
// if (err)
// return done(err);
// if (!tracker) {
// console.log('DNE');
// return done(null, false, {
// message : 'username incorrect'
// });
// }
// if (!tracker.isValidPassword(tracker, password)) {
// console.log('!password');
// return done(null, false, {
// message : 'password incorrect'
// });
// }
//
// return done(null, tracker);
// });
// }
// if (req.body.userType === 'Subject') {
// Subject.findOne({
// username : username
// }, function(err, subject) {
// if (err)
// return done(err);
// if (!subject) {
// return done(null, false, {
// message : 'username incorrect'
// });
// }
// if (!subject.isValidPassword(password)) {
// console.log('!password');
// return done(null, false, {
// message : 'password incorrect'
// });
// }
//
// return done(null, subject);
// });
// }
// }));

// set up server for html pages
app.use(express.static(path.resolve("./")));
app.get('/', function(req, res) {
	res.sendFile('./index.html');
});

// ROUTES

router.route('/loginTracker').post(passport.authenticate('tracker'),
		function(req, res) {
			console.log('authentication successful: ' + req.user);
			res.send(req.user);
		});

router.route('/loginSubject').post(passport.authenticate('subject'),
		function(req, res) {
			console.log('authentication successful: ' + req.user);
			res.send(req.user);
		});

router.route('/addNewTracker').post(function(req, res) {
	Tracker.register(new Tracker({
		username : req.body.username,
		subject : []
	}), req.body.password, function(err, tracker) {
		if (err) {
			console.log('Error' + err);
			res.send(err);
		}
		passport.authenticate('tracker')(req, res, function() {
			res.send('Success: ' + tracker);
		});
	});

});

router.route('/addNewSubject').post(function(req, res) {
	Subject.register(new Subject({
		username : req.body.username,
		trackingId : Math.floor(Math.random() * 90000 + 10000),
		location : 'The subject has not yet checked in.'
	}), req.body.password, function(err, subject) {
		if (err) {
			console.log('Error' + err);
			res.send(err);
		}
		passport.authenticate('subject')(req, res, function() {
			res.send('Success: ' + subject);
		});
	});

});

// Listener (starting the app)
app.listen(port);
console.log("Miracles occur in port " + port);

// Tests and unused code
// var newTracker = Tracker({
// name: "Larry Bird",
// pin: "123"
// });
// newTracker.save(function(err){
// if (err) throw err;
// console.log('New Tracker: ' + newTracker);
// });
Tracker.remove({}, function(err) {
	if (err)
		throw err;
	console.log("All Trackers Deleted");
});
Subject.remove({}, function(err) {
	if (err)
		throw err;
	console.log("All Subjects Deleted");
});
// router.route('/addNewTracker').post(function(req, res) {
// var tracker = new Tracker();
// tracker.username = req.body.username;
// tracker.password = req.body.password;
// tracker.save(function(err) {
// if (err) {
// console.log(err);
// res.send(err);
// }
// console.log('New Tracker added: ' + tracker);
// res.send('New Tracker added:' + tracker);
// });
// //});
// router.route('/addNewSubject').post(function(req, res) {
// var subject = new Subject();
// subject.username = req.body.username;
// subject.password = req.body.password;
// // random 5 digit number
// subject.trackingId = Math.floor(Math.random() * 90000 + 10000);
// subject.location = 'The subject has not yet checked in.';
// subject.save(function(err) {
// if (err) {
// consolge.log(err);
// res.send(err);
// }
// console.log('New Subject added: ' + subject);
// res.send('New Subject added:' + subject);
// });
//
// });
