// Mapbox Public Access Key
mapboxgl.accessToken = 'pk.eyJ1Ijoic2Vlc2h1cmFqIiwiYSI6ImNsbWt4dWhyODA3eHEycnRjeWUzMXV4MXcifQ.K-RBud7LgJTbl91DrfP3QQ';

// Initializing Map
var map = new mapboxgl.Map({
    // Map Container ID
    container: 'map',
    // Mapbox Style URL
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 12.56, // Default Zoom
    center: [80.21696530503047,12.87107664042501] // Default centered coordinate
});

// Search Places
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: true,
});

// Adding Search Places on Map
map.addControl(geocoder, 'top-left')

// Adding navigation control on Map
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

// Create a live location marker
var liveLocationMarker = new mapboxgl.Marker({
    color: "#bb0000",
    draggable: false
});

// Initialize directions object
var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    interactive: true,
    controls: {
        inputs: false,
        instructions: true,
        profileSwitcher: false
    }
});

// When the geocoder returns a result
geocoder.on('result', function (event) {
    // Remove any existing markers
    $('.marker').remove();

    // Create a marker at the selected location
    new mapboxgl.Marker($('<div class="marker"><i class="fa fa-map-marker-alt"></i></div>')[0])
        .setLngLat(event.result.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML(
                    `<div>${event.result.place_name}</div><small class='text-muted'>${parseFloat(event.result.center[0]).toLocaleString('en-US')}, ${parseFloat(event.result.center[1]).toLocaleString('en-US')}</small>`
                )
        )
        .addTo(map);
});

// Map Loaded 
map.on('load', function () {
    geocoder.container.setAttribute('id', 'geocoder-search');
});

// Handle "Get Direction" button click
$('#get-direction').click(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLocation = [position.coords.longitude, position.coords.latitude];
            
            // Set user location as the origin for directions
            directions.setOrigin(userLocation);

            // Set a fixed destination (you can modify this)
            directions.setDestination([80.21696530503047,12.87107664042501]);

            // Add the directions control to the map
            map.addControl(directions, 'top-left');
            directions.container.setAttribute('id', 'direction-container');
            $(geocoder.container).hide();
            $('#get-direction').hide();
            $('#end-direction').removeClass('d-none');

            // Add the live location marker
            liveLocationMarker.setLngLat(userLocation).addTo(map);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Handle "End Direction" button click
$('#end-direction').click(function () {
    // Clear directions and reset the form
    directions.setOrigin('');
    directions.setDestination('');
    directions.removeRoutes();
    directions.removeMarkers();
    $(geocoder.container).show();
    $('#get-direction').show();
    $('#end-direction').addClass('d-none');
    liveLocationMarker.remove();
});
