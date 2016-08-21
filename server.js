// Dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var mongoose = require('mongoose');
var database = require('./models/database.js');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var cookieParser = require('cookie-parser');


// General config
mongoose.connect(database.url);
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());
// app.use(require('express-session')({
// secret : 'ankaaijijie',
// resave : false,
// saveUninitialized : false
// }));
app.use(session({
    secret: 'Ankai Secret Session',
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session()); // passport is for user authentication

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
router.route('/addSubjectToTracker').get(function(req, res) {
    var addedSubject;
    Subject.findOne({
        trackingId: req.query.subjectTrackingId
    }, function(err, subject) {
        addedSubject = subject;
        console.log(addedSubject);
    });
    Tracker.findOne({
        username: req.query.trackerName
    }, function(err, tracker) {
        tracker.subjects.push(addedSubject._id);
        tracker.save(function(err) {
            if (err)
                res.status(500).send('Subject could not be added');
        })
        res.status(200).send(tracker);
    });
});

router.route('/deleteSubjectFromTracker').get(function(req, res) {
    var deleteSub;
    Subject.findOne({
        trackingId: req.query.subjectTrackingId
    }, function(err, subject) {
        deleteSub = subject;
        console.log(deleteSub);
    });
    Tracker.findOne({
        username: req.query.trackerName
    }, function(err, tracker) {
        var index = tracker.subjects.indexOf(deleteSub._id);
        tracker.subjects.splice(index, 1);
        tracker.save(function(err) {
            if (err)
                res.status(500).send('Subject could not be deleted');
        });
        console.log('Delete subject from tracker success');
        res.status(200).send(tracker);
    });
});

// router.route('/refreshTracker').get(function(req, res) {
// Tracker.findOne({
// username : req.query.trackerName
// }, function(err, tracker) {
// res.send(tracker);
// });
// });


router.route('/getTrackerSubjects').get(function(req, res) {
    var trackerName = req.query.trackerName;
    var subjectIds = [];
    Tracker.findOne({
        username: trackerName
    }, function(err, tracker) {
        var subjects = [];
        if (tracker !== null) {
            subjectIds = tracker.subjects;
            Subject.find({
                _id: {
                    $in: subjectIds
                }
            }, function(err, subjects) {
                res.send(subjects);
            });
        }

    });

});

router.route('/subjectLocation').get(function(req, res) {
    var lon = req.query.longitude;
    var lat = req.query.latitude;
    var subjectName = req.query.subUsername;
    Subject.findOne({
        username: subjectName
    }, function(err, sub) {
        if (err) {
            console.log('error find: ' + err)
            res.status(500).send(err);
        }

        request('https://api.mapbox.com/v4/geocode/mapbox.places/' + lon + ',' + lat + '.json?access_token=pk.eyJ1IjoiYW5rYWlqaWUiLCJhIjoiY2lmMmdya3o5MWl4N3Q1bTVvbWl5bTloaiJ9.j0get67vjdd3YJt9nr7o3w', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var json = JSON.parse(body);
                var location2 = json['features'][0]['place_name'];
                console.log("ID: " + sub.id);
                sub.location = location2;
                sub.save(function(err) {
                    if (err) {
                        console.log('error save:' + err);
                        res.status(500).send(err);
                    }
                });
                res.status(200).send(sub);
            }
        });

    });

});


router.route('/logout').get(function(req, res) {
    req.logout();
});


router.route('/loginTracker').post(passport.authenticate('tracker'), function(req, res) {
    console.log('authentication successful: ' + req.user);
    res.status(200).send(req.user);
});

router.route('/loginSubject').post(passport.authenticate('subject'), function(req, res) {
    console.log('authentication successful: ' + req.user);
    res.status(200).send(req.user);
});

router.route('/addNewTracker').post(function(req, res) {
    Tracker.register(new Tracker({
        username: req.body.username,
        subject: []
    }), req.body.password, function(err, tracker) {
        if (err) {
            console.log('Error' + err);
            res.status(500).send(err);
        }
        passport.authenticate('tracker')(req, res, function() {
            res.status(200).send('Success: ' + tracker);
        });
    });

});

router.route('/addNewSubject').post(function(req, res) {
    Subject.register(new Subject({
        username: req.body.username,
        trackingId: Math.floor(Math.random() * 90000 + 10000),
        location: 'The subject has not yet checked in.'
    }), req.body.password, function(err, subject) {
        if (err) {
            console.log('Error' + err);
            res.status(500).send(err);
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
// Tracker.remove({}, function(err) {
// if (err)
// throw err;
// console.log("All Trackers Deleted");
// });
// Subject.remove({}, function(err) {
// if (err)
// throw err;
// console.log("All Subjects Deleted");
// });
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
