import React, { useEffect, useState } from "react";
import { Page, Button, Icon } from 'framework7-react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css"; 
import "../css/app.css";
import "../css/leaflet-routing-machine.css";
import RoutineMachine from "../js/RoutineMachine";
import { UpdateMapView, GetCurrentCoordination,busStops,busStopsMap } from "../js/map"
import {convertToHoursAndMinutes,timeTracking,customIcon,bustopIcon,officeIcon } from "../js/component"





const defaultCurrentLocation = [0, 0];

const TrackMap = () => {
  const stops = busStops();
  const hours = timeTracking();
  const [Location, setLocation] = useState(defaultCurrentLocation);
  const [Location1, setLocation1] = useState(null);
  // const [nextStop, setNextStop] = useState(0);
  const [stopArray, setStopArray] = useState(0);


  const [timer,setTimer] = useState(0);

  

  useEffect(() => {
    setTimer(timeTracking().hours);
    const fetchGpsData = async () => {
      try {
        const data = await GetCurrentCoordination();

        setLocation(data.currentLocation);
        setLocation1(data.currentLocation);
      } catch (error) {
        console.error('Error setting GPS data:', error);
      } 
      // finally {
      //   setLoading(false);
      // }
    };

    fetchGpsData();
  }, []);


  useEffect(() => {
    const updateStopArray = () => {
      if (hours >= 0 && hours <= 12) {
        setStopArray(7);  
      } else {
        setStopArray(0);  
    
      }
    };

    updateStopArray();

  }, [hours]); // Include timer and nextStop as dependencies
    

  return (
    <Page>
      <Button
        position="right-bottom"
        className="floatButton"
        raised
        round
        fill
        tonal
        color="blue"
        style={{ left: "5%" }}
        href="/home/"
        animate={true}
        ignoreCache={true}
      >
        <Icon ios="f7:location_fill" md="f7:location_fill" />
        Start Tracking
      </Button>

      <div id="mapBlock">
        <MapContainer
          center={Location}
          zoom={17}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          {/* Conditionally render RoutineMachine only when currentLocation1 is loaded */}
          {Location1 && (
              <RoutineMachine
              // key={key}
                lat1={Location1[0]}
                lon1={Location1[1]}
                lat2={stops[stopArray].latitude}
                lon2={stops[stopArray].longitude}
              />
            )}
          
          <UpdateMapView lat={Location[0]} lon={Location[1]} />
          <ZoomControl position="verticalcenterleft" />
          <LayersControl position="verticalcenterright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Street Map">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
              />
            </LayersControl.BaseLayer>
          </LayersControl>

         
            {/* Marker for  Bus Location */}
            <Marker position={Location} icon={customIcon}>
              <Popup>
                Current Bus<br />Location.
              </Popup>
            </Marker>

            {/* Markers for Bus Stops */}
            {busStopsMap.map((stop, index) => (
              <Marker key={index} position={[stop.latitude, stop.longitude]} icon={ index == 9? officeIcon:bustopIcon}>
                <Popup>
                  {stop.name}
                </Popup>
              </Marker>
            ))}


        </MapContainer>
      </div>
    </Page>
  );
};

export default TrackMap;
