/* State variables */
var canvas;
var context;
var mouse_down = false;
var color_counter = 0;
var lastColor = null;

/*
 Event handlers 
*/

// If enter is pressed, clear page
$(document).keypress(function(e) {
  if (e.which == 13) {
    clear_page();
  }
});

window.onresize = function () {
  canvas.attr("width", $(window).width())
        .attr("height", $(window).height());
}

// Initializer
function initialize() {
  canvas = d3.select("#canvas").append("canvas").attr("id", "cvs");
  canvas.attr("width", $(window).width()).attr("height", $(window).height());
  initialize_animation();
}


// Load animation
function initialize_animation() {
  // Set values for canvas
  var x1 = 0;
  var y1 = 0;
  var x0 = x1;
  var y0 = y1;
  var radius = 30;
 

 
  context = canvas.node().getContext("2d");
  context.lineWidth = 5;

  // Use mousedown variable to paint only when user has moused clicked down
  canvas.on("mousedown", function(){
    mouse_down = true;

    // Get color
    last_color = $("#sett_color_select").val();
    paint(last_color);
    move();
    
  });

  canvas.on("mousemove", function() {
    move();
    if (mouse_down) {
      paint(last_color);
    }
  });

  canvas.on("mouseup", function() {
    mouse_down = false;
  })

  /**
  * Function to track mouse movement and update variables for location of painting
  */
  function move() {
    var mouse = d3.mouse(document.getElementById("cvs"));
    x1 = mouse[0];
    y1 = mouse[1];
    //d3.event.preventDefault();
  }

  /**
  * Function to paint
  */
  function paint(color) {
    // Calculate x and y coordinates for paint
    var x = x0 += (x1 - x0);
    var y = y0 += (y1 - y0);
    var finalColor;

    if (color == null) {
      finalColor = lastColor;
    }
    if (color == "RGB") {
      finalColor = getRGBColor();
    } else{
      finalColor = getBlueColor();
    }

    // Perform actual painting
    d3.select({}).transition()
                 .duration(1000)
                 .ease(Math.sqrt)
                 .tween("circle", function() {
                  return function(time) {
                    context.strokeStyle = finalColor + (1 - time) + ")";
                    context.beginPath();
                    context.arc(x, y, radius * time, 0, 2 * Math.PI);
                    context.stroke();
                  };
                 });
  }
}

function getRGBColor() {
  var rgb = d3.hsl(++color_counter % 360, 1, .5).rgb();
  var color = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",";

  return color;
}

function getBlueColor() {
  return "rgba(0,0,100,";
}

function clear_page() {
  context.clearRect(0, 0, $(window).width(), $(window).height());
}
