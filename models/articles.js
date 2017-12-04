var mongoose = require("mongoose");

var articlesSchema = new mongoose.Schema({
	
});

var Articles = mongoose.model("Articles", articlesSchema);

module.exports = Articles;