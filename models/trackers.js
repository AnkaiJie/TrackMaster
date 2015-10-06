var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var trackerSchema = new Schema({
	username : String,
	password: String,
	subjects: []
});

trackerSchema.plugin(passportLocalMongoose);
var tracker = mongoose.model('Tracker', trackerSchema);

module.exports = tracker;