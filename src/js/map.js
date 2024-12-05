import React, { useEffect, useState } from "react";

import {useMap} from "react-leaflet";
import axios from 'axios';
import {timeTracking} from "../js/component";

// Function to fetch current coordination
export const GetCurrentCoordination = async () => {
    try {
        const response = await axios.get(
            'https://api.thingspeak.com/channels/2580764/feeds.json?api_key=HI8JWVJUXATQY0P4&results=1'
        );
        const data = response.data.feeds[0]; // Default to empty object

        if(data){
        const speed = Number(data.field3); // Default to 0
        const  busStopValue =  (Number(data.field4) >= 7? Number(data.field4) - 1 :Number(data.field4));
        const gpsResponse = {
            speed,
             busStopValue, // Default value
            speedPercentage: speed / 240,
            currentLocation: [
                Number(data.field1), // Default to 0
                Number(data.field2),  // Default to 0
            ],
        };
        return gpsResponse;
    }
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            speed: 0,
            busStopValue: 0,
            speedPercentage: 0,
            currentLocation: [0, 0]
        };
    }
};



// Custom component to update the map view
export const UpdateMapView = ({ lat, lon }) => {
  const map = useMap();

  useEffect(() => {
    function addControlPlaceholders(map) {
      const corners = map._controlCorners,
        l = 'leaflet-',
        container = map._controlContainer;

      function createCorner(vSide, hSide) {
        const className = l + vSide + ' ' + l + hSide;
        corners[vSide + hSide] = L.DomUtil.create('div', className, container);
      }

      createCorner('verticalcenter', 'left');
      createCorner('verticalcenter', 'right');
    }

    addControlPlaceholders(map);
    map.setView([lat, lon]);
  }, [lat, lon, map]);

  return null;
};


export const busStopsMap = [
  { name: "Unilag Bus Stop", latitude: 6.517689, longitude: 3.384223, returnValue: 1 },
  { name: "Abule-Oja Bus Stop", latitude: 6.516592, longitude: 3.381157, returnValue: 2 },
  { name: "Onike Bus Stop", latitude: 6.509640, longitude: 3.383816, returnValue: 3 },
  { name: "Sabo Bus Stop", latitude: 6.505617, longitude: 3.377856, returnValue: 4 },
  { name: "Alagomeji Bus Stop", latitude: 6.499548, longitude: 3.378231, returnValue: 5 },
  { name: "Alagomeji Bus Stop", latitude: 6.500541, longitude: 3.379448, returnValue: 5 },
  { name: "iFitness Bus Stop", latitude: 6.497126, longitude: 3.379595, returnValue: 6 },
  { name: "Casino Bus Stop", latitude: 6.497265, longitude: 3.380350, returnValue: 7 },
  { name: "Adekunle Bus Stop", latitude: 6.491500, longitude: 3.382831, returnValue: 8 },
  { name: "InterSwitch VI", latitude: 6.428334, longitude:3.42900, returnValue: 9 },
 
  // Add more bus stops as needed
];


export const busStops = () => {
  const hours = timeTracking(); // Ensure you call timeTracking to get the current time
  if (hours >= 0 && hours <= 12) {
    return [
      { name: "Unilag", latitude: 6.517689, longitude: 3.384223, returnValue: 1 },
      { name: "Abule-Oja", latitude: 6.516592, longitude: 3.381157, returnValue: 2 },
      { name: "Onike", latitude: 6.509640, longitude: 3.383816, returnValue: 3 },
      { name: "Sabo", latitude: 6.505617, longitude: 3.377856, returnValue: 4 },
      { name: "Alagomeji", latitude: 6.499548, longitude: 3.378231, returnValue: 5 },
      { name: "iFitness", latitude: 6.497126, longitude: 3.379595, returnValue: 6 },
      { name: "Adekunle", latitude: 6.491500, longitude: 3.382831, returnValue: 7 },
      { name: "InterSwitch VI", latitude: 6.428334, longitude: 3.42900, returnValue: 8 },
    ];
  } else {
    return [
      { name: "Unilag", latitude: 6.517689, longitude: 3.384223, returnValue: 1 },
      { name: "Abule-Oja", latitude: 6.516592, longitude: 3.381157, returnValue: 2 },
      { name: "Onike", latitude: 6.509640, longitude: 3.383816, returnValue: 3 },
      { name: "Sabo", latitude: 6.505617, longitude: 3.377856, returnValue: 4 },
      { name: "Alagomeji", latitude: 6.500541, longitude: 3.379448, returnValue: 5 },
      { name: "Casino", latitude: 6.497265, longitude: 3.380350, returnValue: 6 },
      { name: "Adekunle", latitude: 6.491500, longitude: 3.382831, returnValue: 7 },
      { name: "InterSwitch VI", latitude: 6.428334, longitude: 3.42900, returnValue: 8 },
    ];
  }
};