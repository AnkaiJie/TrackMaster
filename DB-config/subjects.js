var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subjectSchema = new Schema ({
	username: String,
	password: String,
	trackingId: Number,
	location: String
});

var subject = mongoose.model('Subject', subjectSchema);

module.exports = subject;