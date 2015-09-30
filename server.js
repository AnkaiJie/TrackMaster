// Dependencies
var express = require('express');
var app = express();
var port  = process.env.PORT ||8000;
var bodyParse = require('body-parser');


//Listener (starting the app)
app.listen(port);
console.log("Miracles occur in port " + port);