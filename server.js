//requiring dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars"); 
  //models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
  //scraping tools
var request = require("request");
var cheerio = require("cheerio");

//configuring express
var app = express();
var PORT = process.env.PORT || 8000;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/bloombergTechNews", {
  useMongoClient: true
});
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});
db.once("open", function() {
  console.log("Db connection successfull !!!");
});

//making http request to target web page
app.get("/scrape", function(req, res) {
  request("https://bloomberg.com/technology", function(error, response, html) {
   
    var $ = cheerio.load(html); 
    $("li.tech-latest-story").each(function(i, element) {
      
      // Save an empty result object
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
     
      var entry = new Article(result);
      entry.save(function(err, doc) {
        {unique: true}
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });
  });
  res.redirect("/");
});

app.get("/articles", function(req, res) {
  Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

app.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("note")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


app.post("/articles/:id", function(req, res) {
  var newNote = new Note(req.body);

  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});
app.delete("/delete/:id", function (req, res) {
  var id = req.params.id.toString();
  Note.remove({
    "_id": id
  }).exec(function (error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      console.log("deleted");
      res.redirect("/" );
    }
  });
});

app.listen(PORT, function() {
  console.log("App listening on port:", PORT);
});