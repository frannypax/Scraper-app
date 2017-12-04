var mongoose = require("mongoose");

var commentsSchema = new mongoose.Schema({

});

var Comments = mongoose.model("Comments", commentsSchema);

module.exports = Comments;