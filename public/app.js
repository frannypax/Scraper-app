$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    var mainUrl = "https://www.bloomberg.com"
    $("#articles").append("<div class='panel panel-default'><div class='panel-heading'> <p data-id='" + data[i]._id + "'>" + data[i].title + "</p></div>" + "<div class='panel-body'><a href='" + mainUrl+data[i].link + "'>Read Article</p>");
  }
});

$(document).on("click", "p", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .done(function(data) {
      console.log(data);
      $("#notes").append("<h3>" + data.title + "</h3>");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Post Comment</button>");
      $("#notes").append("<button data-id='" + data.note._id + "' id='deletenote'>Delete Comment</button>");
      if (data.note) {
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
      console.log(data);
      $("#notes").empty();
    });
  $("#bodyinput").val("");
});

$(document).on("click", "#deletenote", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/delete/" + thisId
  }).done(function(data) {
    $("#notes").empty();
  });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});