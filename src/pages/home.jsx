import React, { useEffect, useState,useRef } from "react";
import {
  Page,
  Sheet,
  PageContent,
  BlockTitle,
  Block,
  Fab,
  FabButton,
  FabButtons,
  Button,
  Icon,
  Gauge,
  Link,
  View,
  f7,
} from "framework7-react";

import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl, LayersControl } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css"; // Make sure to import Leaflet CSS
import "../css/app.css"
import L from "leaflet";
import "leaflet-routing-machine";
import { UpdateMapView, GetCurrentCoordination,busStops,busStopsMap } from "../js/map";
import {convertToHoursAndMinutes, timeTracking,
  customIcon, bustopIcon, officeIcon, RouteTime, useNotification} from "../js/component";
  import RoutineMachine from "../js/RoutineMachine";
  
  import { PushNotifications} from '@capacitor/push-notifications';
  
const interswitch = [6.428334, 3.42900];

// Default current location state
const defaultCurrentLocation = [0, 0];
const totalStop = 8;
const stops = busStops();

export let StopIds;



const HomePage = () => {
  const hours = timeTracking();
  const [currentLocation, setCurrentLocation] = useState(defaultCurrentLocation);
  const prevStop = useRef(null);
  const [nextStop, setNextStop] = useState(0);
  const [stopArray, setStopArray] = useState(0);
  const [stopLeft, setStopLeft] = useState(0);
  const [distanceTravel, setDistanceTravel] = useState(0);

  const [currentLocation1, setCurrentLocation1] = useState(defaultCurrentLocation);
  const [speed, setSpeed] = useState(0);

  const [speedPercent, setSpeedPercent] = useState(0);
  const [travelTimeHr, setTravelTimeHr] = useState(0); // For storing travel time
  const [travelTimeMin, setTravelTimeMin] = useState(0); // For storing travel time
  const [timer, setTimer] = useState(0);
  const [busStopIndex, setBusStopIndex] = useState(4); 
  const { showNotificationFull, openNotification } = useNotification();
  
  const addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  };

  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  };

  const getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('Delivered notifications', notificationList);
  };

  useEffect(() => {
    // Register and set up listeners
    registerNotifications()
      .then(() => {
        console.log("Push Notifications Registered");
        addListeners();
      })
      .catch((err) => {
        console.error("Error during push notification setup:", err);
      });

    // Optionally, get delivered notifications
    getDeliveredNotifications();
  }, []);


  useEffect(() => {
    setTimer(timeTracking().hours);
    const fetchGpsData = async () => {
      try {
        const data = await GetCurrentCoordination();

        setCurrentLocation(data.currentLocation);
        setCurrentLocation1(data.currentLocation);


        setSpeed(data.speed);
        setSpeedPercent(data.speedPercentage);
        setNextStop(data.busStopValue);
        if (nextStop !== 0 && nextStop !== data.busStopValue && prevStop.current !== nextStop) {
          prevStop.current = nextStop;
          showNotificationFull(data.busStopValue);
          StopIds = data.busStopValue;
          console.log("new Stop incommming : " + StopIds);
        }

      } catch (error) {
        console.error('Error setting GPS data:', error);
      }

    };
    fetchGpsData();
  }, [currentLocation, currentLocation1, speed, speedPercent, nextStop, StopIds]);


  //   // useEffect(() => {
  const handleRouteFound = ({ distance, time }) => {
    const timee = convertToHoursAndMinutes(distance, (speed == 0 ? 0.1 : speed));
    setTravelTimeHr(timee.hours);
    setTravelTimeMin(timee.minutes);
    setDistanceTravel(distance);
  };



  RouteTime.value = convertToHoursAndMinutes(distanceTravel, (speed == 0 ? 0.1 : speed));


  useEffect(() => {
    const updateStopArray = () => {
      if (hours >= 0 && hours <= 12) {
        setStopArray(totalStop - 1 );   //(nextStop - 1) <= -1 ? 0 : nextStop - 1
        setStopLeft(totalStop - nextStop);      //

      } else {
        setStopArray(0);  //(nextStop - 1) <= -1 ? 8 : nextStop - 1
        setStopLeft(nextStop == 0 ? totalStop -1 : nextStop - 1)
      }

    };
    updateStopArray();
  }, [hours, nextStop, RouteTime]); // Include timer and nextStop as dependencies

  



  return (
    <Page name="home" >
      <div>
        {/* **************** TopBar *********************************************************** */}
        <div id="topBlock">
          <div id="ar" className="grid grid-cols-3 ">
            <div className="smallBlock">
              <span style={{ color: 'gray', fontSize: '1rem', marginTop: '5px' }}> Stops Left  </span>
              <span id="busStop" style={{ fontSize: '2rem', fontWeight: '500' }}> {stopLeft}</span>
            </div>

            <div className="smallBlock">
              <span style={{ color: 'gray', fontSize: '1rem', marginTop: '5px' }}>Time Remaining</span>
              <span>
                <span style={{ fontSize: '2rem', fontWeight: '500' }}>{travelTimeHr}</span>
                <span style={{ fontSize: '1rem' }}>hr </span>
                <span style={{ fontSize: '2rem', fontWeight: '500' }}>{travelTimeMin}</span>
                <span style={{ fontSize: '1rem' }}>{"min"}</span>
              </span>
            </div>

            <div className="smallBlock">
              <div style={{ width: "85%", height: "90%" ,marginTop:"2%"}}>
                <Gauge
                  type="semicircle"
                  value={speedPercent}
                  valueText={speed > 0 ? speed : "0"}
                  valueTextColor="rgb(229, 231, 234)"
                  valueFontSize={47}
                  valueFontWeight={700}
                  borderWidth={8}
                  borderColor="#c2782d"
                  borderBgColor="transparent"
                />
              </div>
              <span style={{ color: 'gray' }}>Km/hr</span>
            </div>
          </div>
        </div>
        {/* ***************************************************************************** */}

        {/* ****************** Floating Button *************************************************** */}
        <Button
          position="right-bottom"
          className="floatButton"
          sheetOpen=".demo-sheet-swipe-to-close"
          raised
          round
          fill
          tonal
          color="blue"
          style={{ right: "5%" }}
        >
          <Icon ios="f7:arrow_branch" md="f7:arrow_branch" />
          Bus Routes
        </Button>

        <Button
          position="right-bottom"
          className="floatButton"
          raised
          round
          fill
          tonal
          color="red"
          style={{ left: "5%" }}
          href="/trackmap/" 
          animate={true}
          ignoreCache={true}
        >
          <Icon ios="f7:location_slash_fill" md="f7:location_slash_fill" />
          Stop Tracking
        </Button>
        {/* ******************************************************************************* */}

        {/* ************************* PAGE SWITCHER ****************************************** */}
        <Sheet
          className="demo-sheet-swipe-to-close"
          style={{ height: '70%' }}
          swipeToClose
          push
          backdrop
        >
          <div className="swipe-handler"></div>
          <PageContent>
            <View url="/busroutes/" />
          </PageContent>
        </Sheet>
        {/* *************************************************************************************** */}

        {/* ***************************** MapView *********************************************** */}
        <div id="mapBlock">
          <MapContainer
            center={currentLocation}
            zoom={18}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}

          >
            {currentLocation1 && (
              <RoutineMachine
                // key={key}
                lat1={currentLocation1[0]}
                lon1={currentLocation1[1]}
                lat2={stops[stopArray].latitude}
                lon2={stops[stopArray].longitude}
                onRouteFound={handleRouteFound}
              />
            )}
            {/* Add Zoom Control manually since zoomControl is set to false */}
            <UpdateMapView lat={currentLocation[0]} lon={currentLocation[1]} />
            <ZoomControl position='verticalcenterleft' />
            <LayersControl position='verticalcenterright'>
              {/* Base Layers */}
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

            {/* Update map view based on current location */}


            {/* Marker for Current Bus Location */}
            <Marker position={currentLocation} icon={customIcon}>
              <Popup>
                Current Bus<br />Location.
              </Popup>
            </Marker>

            {/* Markers for Bus Stops */}
            {busStopsMap.map((stop, index) => (
              <Marker key={index} position={[stop.latitude, stop.longitude]} icon={index == 9 ? officeIcon : bustopIcon}>
                <Popup>
                  {stop.name}
                </Popup>
              </Marker>
            ))}


            {/* Uncomment and configure RoutineMachine when ready */}

          </MapContainer>
        </div>
        {/* ********************************************************************************** */}
      </div>
    </Page>
  );
};

// export { routeTime,routeSpeed,routeDistance }; 

export default HomePage;
