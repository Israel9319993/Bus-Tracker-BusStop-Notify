var read_key = "HI8JWVJUXATQY0P4";
var device_id = "2580764";
var latitude, longitude;
var userMarker, busMarker;
var userPath = [];
var initialZoomLevel = 14;
var userLat, userLon;

$(document).ready(function () {
    initMap();
    GetData();
    setInterval(GetData, 5000); // Fetch data every 10 seconds
});

function initMap() {
    // Initialize the map
    window.map = L.map('map').setView([0, 0], initialZoomLevel); // Default view

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
        .bindPopup(label + '<br>Latitude: ' + lat + '<br>Longitude: ' + lon)
        .openPopup();

    // Center the map on the new marker
    window.map.setView([lat, lon], window.map.getZoom());

    return marker;
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
            userLat = position.coords.latitude;
            userLon = position.coords.longitude;
            userMarker = updateMap(userLat, userLon, 'Your Location', userMarker);
            userPath.push([userLat, userLon]);

            if (userPath.length > 1) {
                L.polyline([userPath[userPath.length - 2], userPath[userPath.length - 1]], { color: 'blue' }).addTo(window.map);
            }

            if (busMarker) {
                L.polyline([[userLat, userLon], [latitude, longitude]], { color: 'red' }).addTo(window.map);
            }

            console.log(distance(latitude, longitude, userLat, userLon));
        }, function (error) {
            console.error('Error getting user location:', error);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function GetData() {
    var url = 'https://api.thingspeak.com/channels/' + device_id + '/feeds.json?api_key=' + read_key + '&results=1';
    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json",
        success: function (data) {
            $.each(data, function (i, item) {
                if (i == 'feeds') {
                    var ubound = item.length;
                    latitude = parseFloat(item[ubound - 1].field1);
                    longitude = parseFloat(item[ubound - 1].field2);
                    console.log(latitude, longitude);

                    var busIcon = L.icon({
                        iconUrl: 'img/icon.png', // Replace with the URL of your custom bus icon
                        iconSize: [32, 32], // size of the icon
                        iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
                        popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
                    });

                    // Update map with new coordinates
                    busMarker = updateMap(latitude, longitude, "Bus Location", busMarker, busIcon);

                    // Draw polyline between bus and user if user location is known
                    if (userLat !== undefined && userLon !== undefined) {
                        L.polyline([[userLat, userLon], [latitude, longitude]], { color: 'red' }).addTo(window.map);
                    }
                }
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error('Error fetching data:', errorThrown);
        }
    });
}

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
