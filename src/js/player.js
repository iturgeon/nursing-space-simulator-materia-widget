// Hospital Sim
// Player JS
// JS Framework ????

// Global Variables. Just for now to keep demo simple.
var activeElement = {
	element: null,
	activated: false
};
function init() {
	// Makes adjustments to the grid cell.
	var planes = document.querySelectorAll('a-plane');
	for(var i = 0; i < 10; i++)
	{
		/* i is base x-coord. If cell is increased in scale along x-axis,
		** multiply i by the amount (ie. (i * 10) for scale-x: 10).
		** 0.5 refers to half the cell size, since the plane is drawn out from its center point.
		** (0.05 * i) creates the thin, empty space between cells for the grid effect.
		** Increase or decrease the 0.05 to make gaps thinner or thicker.
		*/
		var xCoord = (i) + 0.5 + (0.05 * i);
		for(var j = 0; j < 10; j++)
		{
			/* j is base z-coord. If cell is increased in scale along z-axis,
			** multiply j by the amount (ie. (j * 10) for scale-z: 10).
			** 0.5 refers to half the cell size, since the plane is drawn out from its center point.
			** (0.05 * j) creates the thin, empty space between cells for the grid effect.
			** Increase or decrease the 0.05 to make gaps thinner or thicker.
			*/
			var zCoord = (j) + 0.5 + (0.05 * j);
			planes[(i*10)+j].setAttribute('position', {x: xCoord, y: 0, z: zCoord});
			planes[(i*10)+j].setAttribute('rotation', {x: -90, y: 0, z: 0});
			planes[(i*10)+j].setAttribute('material', 'color', '#7BC8A4');
			// Necessary for event listeners.
			planes[(i*10)+j].classList.add("grid");
			// Necessary to easily track state of asset locations.
			planes[(i*10)+j].id = "cell-" + i + "-" + j;
			// Sometimes necessary to force the HTML DOM to redraw these pseudo-dom elements.
			planes[(i*10)+j].flushToDOM();
		}
	}
	// Attaches mouse events to the grid cells.
	var cells = document.querySelectorAll('.grid');
	for(var i = 0; i < cells.length; i++)
	{
		// Hovering over cell
		cells[i].addEventListener('mouseenter', function () {
			this.setAttribute('material', 'color', '#CC4500');
		});
		// Mouse cursor has left the cell.
		cells[i].addEventListener('mouseleave', function () {
			this.setAttribute('material', 'color', '#7BC8A4');
		});
		// Mouse cursor has clicked the cell.
		cells[i].addEventListener('click', function () {
			// If asset has been activated, place it on this cell.
			if(activeElement.activated)
			{
				var cellPosition = this.getAttribute('position')
				var assetSize = activeElement.element.getAttribute('scale');
				activeElement.element.setAttribute('position', {x: cellPosition.x, y: (assetSize.y / 2), z: cellPosition.z})
			}
		});
	}
	// Makes adjustments to the pretend asset (cube).
	var box = document.querySelector("a-box");
	box.setAttribute('position', {x: 15, y: 0.5, z: 0});
	box.setAttribute('material', 'color', '#FF00FF');
	// Sometimes necessary to force the HTML DOM to redraw these pseudo-dom elements.
	box.flushToDOM();
	// Mouse events functionality on the fake asset (cube)
	box.addEventListener('mouseenter', function () {
		if(this.classList.contains("active")) return;
		this.setAttribute('material', 'color', 'red');
	});
	box.addEventListener('mouseleave', function () {
		if(this.classList.contains("active")) return;
		this.setAttribute('material', 'color', '#FF00FF');
	});
	box.addEventListener('click', function () {
		if(this.classList.contains("active"))
		{
			// Deactivates the selected asset
			this.setAttribute('material', 'color', 'red');
			this.classList.remove("active");
			activeElement.element = null;
			activeElement.activated = false;
		}
		else if(activeElement.activated === false)
		{
			// Activates the selected asset iff no other element is activated.
			// TODO: Will change later to clear last active element, and take this new one.
			this.setAttribute('material', 'color', '#00FF00');
			this.classList.add("active");
			activeElement.element = this;
			activeElement.activated = true;
		}
		this.flushToDOM();
	});
	// Adds this fake asset to the array of assets (easier to search through them)
	var assets = [];
	assets.push(box);
};

document.addEventListener("DOMContentLoaded", function(event) {

	var mainContainer = document.querySelector('a-scene');

	for(var i = 1; i <= 100; i++)
	{
		var plane = document.createElement("a-plane");
		mainContainer.appendChild(plane);
	}

	var box = document.createElement("a-box");
	mainContainer.appendChild(box);

	init();
});