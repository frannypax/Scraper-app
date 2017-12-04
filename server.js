var express = require('express');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var request = require('request');
var path = require('path');

//Route files
var routes = require('./routes/index');

//Initializing express
var app = express();
//setting up public folder for web app
app.use(express.static("public"));


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/', routes);

//setting up app to listen on 3000
app.listen(8000, function(){
	console.log("Scrapper App is listening on Port:",8000)
});
