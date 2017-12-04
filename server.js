var express = require('express');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');
//// Parses our HTML and helps us find elements
var cheerio = require('cheerio');
// Makes HTTP request for HTML page
var request = require('request');
var path = require('path');
//var db = require('./models');

// First, telling the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from bloomberg tech news website" +
            "\n***********************************\n");

// Making a request for bloomberg.com/technology. The page's HTML is passed as the callback's third argument
request("https://www.bloomberg.com/technology", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each h2-tag with the "technology" class
  // (i: iterator. element: the current element)
  $("li.tech-latest-story").each(function(i, element) {

    // Save the text of the element in a "breakingNews" variable
    var title = $(element).text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).children().attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});


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
