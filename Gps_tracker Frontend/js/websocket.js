// v
// ws.onopen = function() {
//     console.log('WebSocket connection opened');
// };

// ws.onmessage = function(event) {
//     try {
//         const gpsData = JSON.parse(event.data);
//         // console.log(gpsData);
//         latitude = gpsData["location"][0];
//     longitude = gpsData["location"][1];
//     speed = gpsData.speed;
//     var busIcon = L.icon({
//                             iconUrl: 'img/icon.png', // Replace with the URL of your custom bus icon
//                             iconSize: [32, 32], // size of the icon
//                             iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
//                             popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
//                         });
    
//                         // Update map with new coordinates
//                         busMarker = updateMap(latitude, longitude, "Bus Location", busMarker, busIcon);
    
//                         // Draw polyline between bus and user if user location is known
//                         if (userLat !== undefined && userLon !== undefined) {
//                             L.polyline([[userLat, userLon], [latitude, longitude]], { color: 'red' }).addTo(window.map);
//                         }
//         return gpsData;
//     } catch (error) {
//         console.error('Error parsing message data:', error);
//     }
// };

// ws.onerror = function(error) {
//     console.error('WebSocket error:', error);
// };

// ws.onclose = function() {
//     console.log('WebSocket connection closed');
// };

