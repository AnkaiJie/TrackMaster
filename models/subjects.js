var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var subjectSchema = new Schema ({
	username: String,
	password: String,
	trackingId: Number,
	location: String
});

subjectSchema.plugin(passportLocalMongoose);
var subject = mongoose.model('Subject', subjectSchema);

module.exports = subject;