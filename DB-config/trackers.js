var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var trackerSchema  = new Schema({
	name: String,
	pin: Number
});

var tracker = mongoose.model('Tracker', trackerSchema);

module.exports = tracker;