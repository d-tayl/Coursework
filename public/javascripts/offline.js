$(function () {

	// Arrays for storing canvas data
	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var clickColor = new Array();
	var paint;

	// Currently selected colour
	var color = "#000000";

	/* Push values to array for display */
	function addClick(x, y, dragging) {
		clickX.push(x);
		clickY.push(y);
		clickDrag.push(dragging);
		clickColor.push(color);
	}

	// Get context for canvas element
	var context = document.getElementById('pityCanvas').getContext("2d");

	/* Add point to canvas when user clicks mouse */
	$('#pityCanvas').mousedown(function (e) {
		paint = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		redraw();
	});

	/* Add point to canvas when user moves mouse while button is down */
	$('#pityCanvas').mousemove(function (e) {
		if (paint) {
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});

	/* Handle release of mouse button */
	$('#pityCanvas').mouseup(function (e) {
		paint = false;
	});

	/* Handle cursor leaving area of canvas */
	$('#pityCanvas').mouseleave(function (e) {
		paint = false;
	});

	/* Redraw entire canvas based on array contents */
	function redraw() {
		// Firstly, wipe the current canvas
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		// Set up line properties for drawing
		context.lineJoin = "round";
		context.lineWidth = 5;

		// Iterate through array and set points based on coordinates, colour and drag property
		for (var i = 0; i < clickX.length; i++) {
			context.beginPath();
			if (clickDrag[i] && i) {
				context.moveTo(clickX[i - 1], clickY[i - 1]);
			} else {
				context.moveTo(clickX[i] - 1, clickY[i]);
			}
			// Draw stroke
			context.strokeStyle = clickColor[i];
			context.lineTo(clickX[i], clickY[i]);
			context.closePath();
			context.stroke();
		}
	}

	// Set event for window resize
	$(window).resize(respondCanvas);

	var canvCont = $("#pityCanvas").parent();

	/* Function for resizing the canvas to be triggered on window resize */
	function respondCanvas() {
		// Set the canvas to the size of it's container
		$("#pityCanvas").attr('width', $(canvCont).width());
		$("#pityCanvas").attr('height', $(canvCont).height());
		redraw();
	}

	// Call canvas resize function on initial page load
	respondCanvas();

	/* Set canvas drawing colour to red */
	$("#cnvRed").click(function () {
		color = "#df4b26";
	});

	/* Set canvas drawing colour to green */
	$("#cnvGreen").click(function () {
		color = "#5DFC0A";
	});

	/* Set canvas drawing colour to blue */
	$("#cnvBlue").click(function () {
		color = "#00688B";
	});

	/* Set canvas drawing colour to yellow */
	$("#cnvYellow").click(function () {
		color = "#FFFF00";
	});

	/* Set canvas drawing colour to black */
	$("#cnvBlack").click(function () {
		color = "#000000";
	});

	/* Clear the canvas and reset array contents */
	$("#cnvClear").click(function () {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		clickX = new Array();
		clickY = new Array();
		clickDrag = new Array();
		clickColor = new Array();
	});

});
