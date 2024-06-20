var read_key = "HI8JWVJUXATQY0P4";
var device_id = "2580764";
var latitude, longitude;
var busMarker, userMarker, polyline;

$(document).ready(function () {
    initMap();
    GetData();
});

function initMap() {
    // Initialize the map
    window.map = L.map('map').setView([0, 0], 2); // Default view

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
    }).addTo(window.map);

    // Add zoom control
    L.control.zoom({
        position: 'topright'
    }).addTo(window.map);

    // Add custom locate control
    var locateControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },
        onAdd: function () {
            var container = L.DomUtil.create('div', 'leaflet-control-locate');
            container.innerHTML = 'Get Location';
            container.onclick = function () {
                getUserLocation();
            };
            return container;
        }
    });

    window.map.addControl(new locateControl());
}

function updateMap(lat, lon, label, isUser) {
    var currentZoom = window.map.getZoom();
    var distance = "";

    if (isUser) {
        if (userMarker) {
            window.map.removeLayer(userMarker);
        }

        if (latitude && longitude) {
            distance = "<br>Distance from Bus: " + getDistance(lat, lon, latitude, longitude).toFixed(2) + " meters";
        }

        userMarker = L.marker([lat, lon]).addTo(window.map)
            .bindPopup(label + '<br>Latitude: ' + lat + '<br>Longitude: ' + lon + distance)
            .openPopup();
    } else {
        if (busMarker) {
            window.map.removeLayer(busMarker);
        }
        var customIcon = L.icon({
            iconUrl: 'img/icon.png', // Replace with your custom icon URL
            iconSize: [32, 32], // Size of the icon
            iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
            popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
        });
        busMarker = L.marker([lat, lon], {icon: customIcon}).addTo(window.map)
            .bindPopup(label + '<br>Latitude: ' + lat + '<br>Longitude: ' + lon)
            .openPopup();
    }

    if (latitude && longitude) {
        // Draw a line between the bus and user location
        if (polyline) {
            window.map.removeLayer(polyline);
        }
        polyline = L.polyline([[latitude, longitude], [lat, lon]], {color: 'blue'}).addTo(window.map);
    }

    // Reset the map view with the same zoom level
    window.map.setView([lat, lon], currentZoom);
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLat = position.coords.latitude;
            var userLon = position.coords.longitude;
            updateMap(userLat, userLon, 'Your Location', true);
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

                    // Update map with new coordinates
                    updateMap(latitude, longitude, "Bus Location", false);
                }
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error('Error fetching data:', errorThrown);
        }
    });

    setTimeout(GetData, 10000); // Fetch data every 10 seconds
}

function getDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula to calculate the distance between two points in meters
    var R = 6371000; // Radius of the Earth in meters
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(Value) {
    return Value * Math.PI / 180;
}
