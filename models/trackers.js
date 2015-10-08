var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');

var trackerSchema = new Schema({
	username : String,
	password: String,
	subjects: []
});

trackerSchema.plugin(passportLocalMongoose);

trackerSchema.methods.validatePassword = function(password){
	return bcrypt.hashSync(password, this.password);
}
var tracker = mongoose.model('Tracker', trackerSchema);

module.exports = tracker;