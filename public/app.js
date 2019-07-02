
$.getJSON("/articles", function(data) {
    
    for (let i = 0; i < data.length; i++) {
      
      $("#articles").append("<p>" + "<h2 data-id='" + data[i]._id + "'>" + data[i].title + "</h2>" + "<br />" + "<a href=https:" + data[i].link + " target='_blank' >" + data[i].link + "</a>" + "</p>");
    }
  });
  
  $(document).on("click", "h2", function() {
    
    $("#notes").empty();
    
    const thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })  
      .then(function(data) {
        console.log(data);  
        $("#notes").append("<h2>" + data.title + "</h2>"); 
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>"); 
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.note) {
          
          $("#titleinput").val(data.note.title);
          
          $("#bodyinput").val(data.note.body);
        }
      });
  }); 
  $(document).on("click", "#savenote", function() {
    
    const thisId = $(this).attr("data-id"); 
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: { 
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {  
        console.log(data); 
        $("#notes").empty();
      });
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

// function getResults() {
//   $("#results").empty();
//   $.getJSON("/all", function(data) {
//     for ( i = 0; i < data.length; i++) {
//       $("#results").prepend("<p class='data-entry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
//         data[i]._id + ">" + data[i].title + "</span><span class=delete>X</span></p>");
//     }
//   });
// }
// getResults();
$(document).on("click", "#make-new", function() {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit",
    data: {
      title: $("#title").val(),
      note: $("#note").val(),
      created: Date.now()
    }
  })
    .then(function(data) {
      $("#results").prepend("<p class='data-entry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
      data._id + ">" + data.title + "</span><span class=delete>X</span></p>");
      $("#note").val("");
      $("#title").val("");
    });
});

$("#clear-all").on("click", function() {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/clearall",
    success: function(response) {
      $("#results").empty();
    }
  });
});

$(document).on("click", ".delete", function() {
  var selected = $(this).parent();
  $.ajax({
    type: "GET",
    url: "/delete/" + selected.attr("data-id"),
    success: function(response) {
      selected.remove();
      $("#note").val("");
      $("#title").val("");
      $("#action-button").html("<button id='make-new'>Submit</button>");
    }
  });
});
$(document).on("click", ".dataTitle", function() {
  var selected = $(this);
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function(data) {
      $("#note").val(data.note);
      $("#title").val(data.title);
      $("#action-button").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
    }
  });
});

$(document).on("click", "#updater", function() {
  var selected = $(this);
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      title: $("#title").val(),
      note: $("#note").val()
    },
    success: function(data) {
      $("#note").val("");
      $("#title").val("");
      $("#action-button").html("<button id='make-new'>Submit</button>");
      getResults();
    }
  });
});

  