var read_key = "HI8JWVJUXATQY0P4";
var device_id = "2580764";
var latitude, longitude, direction, speed;
var userMarker, busMarker;
var userPath = [];
var initialZoomLevel = 14;
var userLat, userLon;
var ws;
var connectionStatus = document.getElementById("connectionStatus");
var reloadButton = document.getElementById("reloadButton");

$(document).ready(function () {
    initMap();
    initializeWebSocket();
});

reloadButton.addEventListener("click", function() {
    initializeWebSocket();
});

function initMap() {
    // Initialize the map with zoom control enabled
    window.map = L.map('map', {
        zoomControl: true // Enable the default zoom control
    }).setView([0, 0], initialZoomLevel); // Default view

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
    }).addTo(window.map);
}

function updateMap(lat, lon, label, marker, icon = null) {
    // Add a marker to the map
    if (marker) {
        window.map.removeLayer(marker);
    }

    var markerOptions = icon ? { icon: icon } : {};
    marker = L.marker([lat, lon], markerOptions).addTo(window.map)
        .bindPopup(label + '<br>' + speed + ' Kmh')
        .openPopup();

    // Center the map on the new marker
    window.map.setView([lat, lon], window.map.getZoom());

    return marker;
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userLat = position.coords.latitude;
            userLon = position.coords.longitude;
            userMarker = updateMap(userLat, userLon, 'Your Location', userMarker);
            userPath.push([userLat, userLon]);

            // if (userPath.length > 1) {
            //     L.polyline([userPath[userPath.length - 2], userPath[userPath.length - 1]], { color: 'blue' }).addTo(window.map);
            // }

            // if (busMarker) {
            //     L.polyline([[userLat, userLon], [latitude, longitude]], { color: 'red' }).addTo(window.map);
            // }

            console.log(distance(latitude, longitude, userLat, userLon));
        }, function (error) {
            console.error('Error getting user location:', error);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function initializeWebSocket() {

    ws = new WebSocket('wss://mqtt-tracking-system-4895ee17dd0b.herokuapp.com/gps');

    ws.onopen = function() {
        console.log('WebSocket connection opened');
        connectionStatus.textContent = "Connected";
        connectionStatus.style.color = "green";
    };

    ws.onmessage = function(event) {
        try {
            const gpsData = JSON.parse(event.data);
            latitude = gpsData["location"][0];
            longitude = gpsData["location"][1];
            speed = gpsData.speed;
            direction = gpsData.direction; // Assuming direction is provided in the data

            var busIcon = L.icon({
                iconUrl: 'img/icon.png', // Replace with the URL of your custom bus icon
                iconSize: [32, 32], // size of the icon
                iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -32], // point from which the popup should open relative to the iconAnchor
                opacity: 0.5 // Set the icon transparency to 50%
            });

            busMarker = updateMap(latitude, longitude, "<b> Bus Speed", busMarker, busIcon);

            if (userLat !== undefined && userLon !== undefined) {
                L.polyline([[userLat, userLon], [latitude, longitude]], { color: 'red' }).addTo(window.map);
            }

            rotateMap(direction);
        } catch (error) {
            console.error('Error parsing message data:', error);
        }
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    ws.onclose = function() {
        console.log('WebSocket connection closed');
        connectionStatus.textContent = "Disconnected";
        connectionStatus.style.color = "red";
        setTimeout(initializeWebSocket, 5000); // Attempt to reconnect every 5 seconds
    };
}

function rotateMap(angle) {
    var mapPane = document.querySelector('.leaflet-map-pane');
    mapPane.style.transform = `rotate(${angle}deg)`;
    mapPane.style.transformOrigin = 'center center';
}

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
