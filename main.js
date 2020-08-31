
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var loading_screen = document.getElementById('loading');

// Initialize loading variables
var loaded = false;
var load_counter = 0;

// Initialize images for layers
var background = new Image();
var shadows = new Image();
var clouds = new Image();
var floaties_1 = new Image();
var floaties_2 = new Image();
var frame = new Image();
var humans = new Image();
var floaties_3 = new Image();

// Create a list of layer objects
// Each object contains the following:
// image: a reference to the image created above
// src: the path to the actual image in your project
// z_index: how close the object should appear in 3d space (0 is neutral)
// position: a place to keep track of the layer's current position
// blend: what blend mode you'd like the layer to use—default is null
// opacity: how transparent you'd like the layer to appear (0 is completely transparent, 1 is completely opaque)
var layer_list = [
	{
		'image': background,
		'src': './images/layer_1_1.png',
		'z_index': -2.25,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': clouds,
		'src': './images/layer_2_1.png',
		'z_index': -2,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': floaties_1,
		'src': './images/layer_3_1.png',
		'z_index': -1.25,
		'position': {x: 0, y: 0},
		'blend': 'overlay',
		'opacity': 1
	},
	{
		'image': floaties_2,
		'src': './images/layer_4_1.png',
		'z_index': -0.5,
		'position': {x: 0, y: 0},
		'blend': 'overlay',
		'opacity': 1
	},
	{
		'image': shadows,
		'src': './images/layer_5_1.png',
		'z_index': -1.25,
		'position': {x: 0, y: 0},
		'blend': 'multiply',
		'opacity': 0.75
	},
	{
		'image': frame,
		'src': './images/layer_6_1.png',
		'z_index': 0,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': humans,
		'src': './images/layer_7_1.png',
		'z_index': 0.8,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': floaties_3,
		'src': './images/layer_8_1.png',
		'z_index': 2,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 0.9
	}
];


// Go through the list of layer objects and load images from source
// When all images are loaded, the loading screen will be hidden, and the render loop will start running
layer_list.forEach(function(layer, index) {
	

	layer.image.onload = function() {
		load_counter += 1;
		if (load_counter >= layer_list.length) {
			loading_screen.classList.add('hidden')
			requestAnimationFrame(drawCanvas);
		}
	};
	// load the images 
	layer.image.src = layer.src;
});


// Draw layers in Canvas
function drawCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	TWEEN.update();
	
	// Calculate how much the canvas should be rotated
	var rotate_x_degree = (pointer.y * -0.15)
	var rotate_y_degree = (pointer.x * 0.15) 
	
	// Actually rotate the canvas
	canvas.style.transform = "rotateX(" + rotate_x_degree + "deg) rotateY(" + rotate_y_degree + "deg)";
		
	layer_list.forEach(function(layer, index) {
		// console.log('DrawCanvas at index :', index , pointer)
		// Calculate what the position of the layer should be (getOffset function is below)
		layer.position = getOffset(layer);

		if (layer.blend) {
			context.globalCompositeOperation = layer.blend;
		} else {
			context.globalCompositeOperation = 'normal';
		}
		context.globalAlpha = layer.opacity;

		// Draw the layer into the canvas context
		context.drawImage(layer.image, layer.position.x, layer.position.y);
	});
	
	// Loop this function! requestAnimationFrame is a special built in function that can draw to the canvas at 60 frames per second
	// drawCanvas()
	requestAnimationFrame(drawCanvas);

}

// Function to calculate layer offset
function getOffset(layer) {
	// Calculate the amount you want the layers to move based on touch or mouse input.
	var touch_multiplier = 0.3;
	var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
	var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;
	
	var offset = {
		x: touch_offset_x ,
		y: touch_offset_y 
	};

	return offset;
}

//// TOUCH AND MOUSE CONTROLS ////

// This is a variable we're using to only move things when you're touching the screen, or holding the mouse button down.
var moving = false;

var pointer_initial = {
	x: 0,
	y: 0
};

var pointer = {
	x: 0,
	y: 0
};

canvas.addEventListener('mousedown', pointerStart);

// Runs when touch or mouse click starts
function pointerStart(event) {
	// Ok, you touched the screen or clicked, now things can move until you stop doing that
	moving = true;
	console.log('## clicked on the image ##', event)
	if (event.type === 'mousedown') {
		// set initial mouse position to the coordinates where you first clicked
		pointer_initial.x = event.clientX;
		pointer_initial.y = event.clientY;
	}
	console.log('click pointer x : ', pointer_initial.x, 'pointer y : ', pointer_initial.y)
}


window.addEventListener('mousemove', pointerMove);
function pointerMove(event) {
	event.preventDefault();
	// Only run this if mouse click has started
	if (moving === true) {
		var current_x = 0;
		var current_y = 0;

		 if (event.type === 'mousemove') {
			// Current position of mouse cursor
			current_x = event.clientX;
			current_y = event.clientY;
		}
		// Set pointer position to the difference between current position and initial position
		pointer.x = current_x - pointer_initial.x;
		pointer.y = current_y - pointer_initial.y; 
	}
	console.log('moving pointer', pointer)
};


canvas.addEventListener('mousemove', function(event) {
	event.preventDefault();
});


window.addEventListener('mouseup', function(event) {
	endGesture();
});


function endGesture() {
	moving = false;
	
	TWEEN.removeAll();
	// This starts the animation to reset the position of all layers when you stop moving them
	var pointer_tween = new TWEEN.Tween(pointer).to({x: 0, y: 0}, 300).easing(TWEEN.Easing.Back.Out).start();	

	// pointer.x = 0
	// pointer.y = 0
}


function play() {
	var audio = new Audio("https://t4.bcbits.com/stream/30362781cafee7536d4ee16657f35397/mp3-128/3295481649?p=0&ts=1593384286&t=7a1dbd0582bf6b102313d41032e24fe0a41a112c&token=1593384286_1b6647efd2a0f5a7e4501e91cc8423fc616d0b91");
	audio.play();
  }