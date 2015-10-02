var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var Subject = require('./subjects.js');

var trackerSchema = new Schema({
	username : String,
	password: String,
	subjects: []
});

var tracker = mongoose.model('Tracker', trackerSchema);

module.exports = tracker;