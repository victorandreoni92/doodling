/* State variables */
var mouseDown = false;
var colorCounter = 0;

/*
|----------------------------------------------------------------------------------------------|
|                               Event Handlers                                                 |
|----------------------------------------------------------------------------------------------|
*/

/**
 * Initializer function. Called form OnLoad().
 * 
 * Sets up the Canvas, its listeners, and the context.
 */
function initialize() {
  let canvas = d3.select("#canvas").append("canvas").attr("id", "cvs");
  canvas.attr("width", $(window).width()).attr("height", $(window).height());
  let context = canvas.node().getContext("2d");  
  context.lineWidth = 5;

  // Set up event listeners
  canvas.on("mousedown", function(){
    mouseDown = true;
  
    let color = $("#sett_color_select").val();
    paint(color, context);
  });
  
  canvas.on("mousemove", function() {
    // Only pain if the mouse is clicked
    if (mouseDown) {
      let color = $("#sett_color_select").val();
      paint(color, context);
    }
  });
  
  canvas.on("mouseup", function() {
    mouseDown = false;
  })
}

// If enter is pressed, clear page
$(document).keypress(function(e) {
  if (e.which == 13) {
    clearCanvas();
  }
});

/*
|----------------------------------------------------------------------------------------------|
|                               Drawing Helper Functions                                       |
|----------------------------------------------------------------------------------------------|
*/
   
/**
 * Function for painting on the Canvas.
 *
 * @param {string}                   color   The color to pain with.
 * @param {CanvasRenderingContext2D} context The rendering context to draw on.
 */
function paint(color, context) {
  let mouse = d3.mouse(document.getElementById("cvs"));
  let x = mouse[0];
  let y = mouse[1];
  let radius = 30;

  let fColor = getColorRGBA(color);
  
  // Perform actual painting
  d3.select({}).transition()
                .duration(1000)
                .ease(Math.sqrt)
                .tween("circle", function() {
                  return function(time) {
                    context.strokeStyle = `rgba(${fColor.r},${fColor.g},${fColor.b},${(1 - time)})`;
                    context.beginPath();
                    context.arc(x, y, radius * time, 0, 2 * Math.PI);
                    context.stroke();
                  };
                });
}

/**
 * Returns an object with the red, green, and blue properties of the color to use for painting. 
 *
 * @param {string} color The color to paint with.
 */
function getColorRGBA(color) {
  let rgbColor;

  if (color == "RGB") {
    rgbColor = d3.hsl(++colorCounter % 360, 1, .5).rgb();
  } else if (color == "Eraser") {
    rgbColor = d3.color("#202545").rgb();
    // TODO: There is some shadows around eraser
  } else {
    rgbColor = d3.color(color).rgb();
  }
  
  return rgbColor;
}

/**
 * Clears the canvas from all contents.
 */
function clearCanvas() {
  context.clearRect(0, 0, $(window).width(), $(window).height());
}
