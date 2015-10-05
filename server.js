// Dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var mongoose = require('mongoose');
var database = require('./DB-config/database.js');
var bodyParser = require('body-parser');
var path = require('path');

// General config
mongoose.connect(database.url);
app.use(bodyParser.urlencoded({
	'extended' : 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

// Setting up router
var router = express.Router();
app.use('/', router);

// DB MODELS
var Tracker = require('./DB-config/trackers.js');
var Subject = require('./DB-config/subjects.js');

//set up server for html pages
app.use(express.static(path.resolve("./")));
app.get('/', function(req, res) {
	res.sendFile('./index.html');
});

//ROUTES

router.route('/addNewTracker').post(function(req, res) {
	var tracker = new Tracker();
	tracker.username = req.body.username;
	tracker.password = req.body.password;
	tracker.save(function(err) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		console.log('New Tracker added: ' + tracker);
		res.send('New Tracker added:' + tracker);
	});
});

router.route('/addNewSubject').post(function(req, res) {
	var subject = new Subject();
	subject.username = req.body.username;
	subject.password = req.body.password;
	// random 5 digit number
	subject.trackingId = Math.floor(Math.random() * 90000 + 10000);
	subject.location = 'The subject has not yet checked in.';
	subject.save(function(err) {
		if (err) {
			consolge.log(err);
			res.send(err);
		}
		console.log('New Subject added: ' + subject);
		res.send('New Subject added:' + subject);
	});

});


// Listener (starting the app)
app.listen(port);
console.log("Miracles occur in port " + port);

// Tests
// var newTracker = Tracker({
// name: "Larry Bird",
// pin: "123"
// });
// newTracker.save(function(err){
// if (err) throw err;
// console.log('New Tracker: ' + newTracker);
// });
// Tracker.findOneAndRemove({username: undefined}, function (err){
// if(err) throw err;
// console.log("User deleted");
// });
//Subject.findOneAndRemove({username: undefined}, function (err){
//if(err) throw err;
//console.log("User deleted");
//});
