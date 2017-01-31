// Global Variables. Just for now to keep demo simple.
var activeElement = {
	element: null,
	activated: false
};
var assets = [];
// The one function to rule them all.
function init() {
	buildGrid();
	buildAssets();
};
// Mouse events functionality on the assets
function attachAssetListeners(obj) {
	// Hover over the asset
	obj.addEventListener('mouseenter', function () {
		if(this.classList.contains("active")) return;
		this.setAttribute('material', 'color', 'red');
	});
	// No longer hovering over asset
	obj.addEventListener('mouseleave', function () {
		if(this.classList.contains("active")) return;
		this.setAttribute('material', 'color', '#FF00FF');
	});
	// Clicked on asset
	obj.addEventListener('click', function () {
		// Asset already active, remove active modifiers
		if(this.classList.contains("active") && this.getAttribute("isCloned") === "false")
		{
			// Deactivates the selected asset
			this.setAttribute('material', 'color', 'red');
			this.classList.remove("active");
			activeElement.element = null;
			activeElement.activated = false;
		}
		// Clicking on an active asset that is also a clone will delete that clone.
		else if(this.classList.contains("active") && this.getAttribute("isCloned") === "true")
		{
			activeElement.element.setAttribute('material', 'color', '#FF00FF');
			activeElement.element = null;
			activeElement.activated = false;
			deleteAsset(this);
		}
		// Asset wasn't active before, but will be now.
		else
		{
			// Activates the selected asset after deactivating all others.
			if(activeElement.activated === true) removesActive();
			this.setAttribute('material', 'color', '#00FF00');
			this.classList.add("active");
			activeElement.element = this;
			activeElement.activated = true;
		}
		// Manually ensure a-frame pushes changes to the HTML DOM.
		this.flushToDOM();
	});
}
function attachGridCellEventListeners()
{
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
				// Position of cell you clicked.
				var cellPosition = this.getAttribute('position');
				// Get asset's scale (helps with putting bottom of asset on ground).
				var assetSize = activeElement.element.getAttribute('scale');
				// If active object wasn't a clone, make a clone.
				if(activeElement.element.getAttribute("isCloned") === "false")
				{
					// Remove the active color and related class.
					activeElement.element.setAttribute('material', 'color', '#FF00FF');
					activeElement.element.classList.remove("active");
					// Clone the asset.
					activeElement.element = clone(activeElement.element);
					// Make the clone the active asset
					activeElement.element.classList.add("active");
					activeElement.element.setAttribute('material', 'color', '#00FF00');
				}
				// Place the clone in the scene on top of clicked grid cell.
				activeElement.element.setAttribute('position', {x: cellPosition.x, y: (assetSize.y / 2), z: cellPosition.z});
				// Make sure clone is manually pushed to HTML DOM.
				activeElement.element.flushToDOM();
			}
		});
	}
};
function buildAssets()
{
	// Makes adjustments to the pretend asset (cube).
	var box = document.querySelector("a-box");
	box.setAttribute('position', {x: 15, y: 0.5, z: 0});
	box.setAttribute('material', 'color', '#FF00FF');
	// Helps not to duplicate cloned objects.
	box.setAttribute("isCloned", false);
	// Sometimes necessary to force the HTML DOM to redraw these pseudo-dom elements.
	box.flushToDOM();
	attachAssetListeners(box);
	// Adds this fake asset to the array of assets (easier to search through them)
	assets.push(box);
};
function buildGrid()
{
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
			// Helps not to duplicate cloned objects.
			planes[(i*10)+j].setAttribute("isCloned", false);
			// Sometimes necessary to force the HTML DOM to redraw these pseudo-dom elements.
			planes[(i*10)+j].flushToDOM();
		}
	}
	attachGridCellEventListeners();
};
// Safely clones an asset object rather than use the one in the sidebar
function clone(obj)
{
	// Make sure an actual object was passed in.
	if (null == obj || "object" != typeof obj) return obj;
	// Create a new object of same type.
	var copyType = obj.getAttribute("geometry")["primitive"];
	var clonedObject = document.createElement("a-" + copyType);
	// Copy over its essential attributes.
	clonedObject.setAttribute("material", obj.getAttribute("material"));
	clonedObject.setAttribute("scale", obj.getAttribute("scale"));
	clonedObject.setAttribute("rotation", obj.getAttribute("rotation"));
	// Helps not to duplicate cloned objects.
	clonedObject.setAttribute("isCloned", true);
	// Copies classes over to new object.
	for(cls in obj.classList)
	{
		clonedObject.classList.add(cls);
	}
	// Put it in the scene.
	document.querySelector('a-scene').appendChild(clonedObject);
	// Give new object same listeners as the original.
	attachAssetListeners(clonedObject);
	// keep all assets in same array.
	assets.push(clonedObject);
	return clonedObject;
}
// Deletes a cloned asset from all places referenced.
function deleteAsset(obj) {
	// Flush element from asset collection.
	var flag = false;
	for(var i = 0; i < assets.length; i++)
	{
		if(flag && assets[i+1]) assets[i] = assets[i+1];
		else if(obj === assets[i])
		{
			flag = true;
			if(assets[i+1]) assets[i] = assets[i+1];
		}
	}
	document.querySelector('a-scene').removeChild(obj);
};
// Removes the active class from any object that has it
function removesActive()
{
	activeElement.element = null;
	activeElement.activated = false;
	for(var i = 0; i < assets.length; i++)
	{
		assets[i].setAttribute('material', 'color', '#FF00FF');
		assets[i].classList.remove("active");
	}
};
function setup()
{
	var mainContainer = document.querySelector('a-scene');
	// Create the grid cells, and append to scene.
	for(var i = 1; i <= 100; i++)
	{
		var plane = document.createElement("a-plane");
		mainContainer.appendChild(plane);
	}
	// Create the assets, and append to scene.
	var box = document.createElement("a-box");
	mainContainer.appendChild(box);
};