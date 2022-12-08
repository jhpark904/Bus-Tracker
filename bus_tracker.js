const busMap = new Map();
const updateFrequency = 15000;
const iconSize = 20;
let timer = null;

async function updateLocations() {
    // get bus data    
	const locations = await getBuses();

	locations.forEach((bus) => {
		const id = bus.id;
		const longitude = bus.attributes.longitude;
		const latitude = bus.attributes.latitude;

		if (busMap.has(id)) {
			// update position of existing bus
			busMap.get(id).setLngLat([longitude, latitude]);

		} else {
			const el = document.createElement('div');
			el.style.backgroundImage = 'url(travel-bus-red.svg)';
			el.style.width = `${iconSize}px`;
			el.style.height = `${iconSize}px`;
			el.style.backgroundSize = "100%";

			// create a new marker for the bus
			const marker = new mapboxgl.Marker({
				element: el
			}).setLngLat([longitude, latitude])
				.addTo(map);

			busMap.set(id, marker);
		}
	});

	// timer
	timer = setTimeout(updateLocations, updateFrequency);
}

// Request bus data from MBTA
async function getBuses() {
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

function stopTracking() {
	if (timer != null) {
		clearTimeout(timer);
	}

	const markers = Array.from(busMap.values());
	markers.forEach((marker) => {
		marker.remove();
	});

	busMap.clear();
}

mapboxgl.accessToken = 'YOUR-API-KEY';

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [-71.104081, 42.365554],
	zoom: 12
});

