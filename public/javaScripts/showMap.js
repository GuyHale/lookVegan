mapboxgl.accessToken = mapToken;

//creating a map
const map = new mapboxgl.Map({
    container: 'map',
    center: place, //centering the map around the place's geocoordinates
    zoom: 9,
    style: 'mapbox://styles/mapbox/light-v10'
});

//adding a marker to specifically show the location of the place
new mapboxgl.Marker()
    .setLngLat(place)
    .setPopup(
        new mapboxgl.Popup({ offset: 50 })
            .setHTML(
                `<h4>${title}</h4><p>${city}</p>`
            )
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());

