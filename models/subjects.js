var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');


var subjectSchema = new Schema ({
	username: String,
	password: String,
	trackingId: Number,
	location: String
});

subjectSchema.plugin(passportLocalMongoose);

subjectSchema.methods.validatePassword = function(password){
	return bcrypt.compareSync(password, this.password)
}

var subject = mongoose.model('Subject', subjectSchema);

module.exports = subject;