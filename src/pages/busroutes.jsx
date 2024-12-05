import React, { useEffect, useState } from "react";
import { Page, Icon, Range,Button } from 'framework7-react';
import "../css/app.css"
import { timeTracking, RouteTime} from "../js/component";
import { busStops } from "../js/map";
import { StopIds } from "./home";

let maxTime = 2 * 3600;

let timeFlag = localStorage.getItem("timeFlag");

const BusRoutes = () => {
  const hours = timeTracking();
  const stops = busStops();
  const [stop, setStop] = useState("");
  const [travelTimeH, setTravelTimeH] = useState(0); // For storing travel time
  const [travelTimeM, setTravelTimeM] = useState(0); // For storing travel time
  const [timestamps, setTimestamps] = useState(Array(busStops.length).fill(null));
  const [min, setMin] = useState(200);
  const [max, setMax] = useState(400);

  // Load stored timestamps from localStorage when the app starts


  useEffect(() => {
    const storedTimestamps = localStorage.getItem('busStopTimestamps');
    if (storedTimestamps) {
      setTimestamps(JSON.parse(storedTimestamps));
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
    setStop(hours >= 0 && hours <= 12 ? "InterSwitch" : "Unilag");
    setTravelTimeH(RouteTime.value.hours);
    setTravelTimeM(RouteTime.value.minutes);

    const sec = travelTimeH * 3600 + travelTimeM * 60; // 2 hours max sec
    const range = (maxTime - (sec > maxTime ? maxTime : sec)) * 100 / maxTime;
    const rangeInv = (sec > maxTime ? maxTime : sec) / maxTime * 100;


    if (hours >= 0 && hours <= 12) {
      setMax(100);
      setMin(range);
    } else {
      setMin(0);
      setMax(rangeInv);
    }

  }, 1000);
  return () => clearInterval(intervalId);
  }, [stop,travelTimeH, travelTimeM,hours]);



  // Function to update timestamp based on notification and store in localStorage
  const updateTimestamp = (stopIndex) => {
    const currentTime = new Date().toLocaleTimeString(); // Get current time as a string
    setTimestamps((prevTimestamps) => {
      const updatedTimestamps = [...prevTimestamps];
      updatedTimestamps[stopIndex] = currentTime; // Update the timestamp for the specific stop

      // Store the updated timestamps in localStorage
      localStorage.setItem('busStopTimestamps', JSON.stringify(updatedTimestamps));
      
      return updatedTimestamps;
    });
  };



  const handleNotification = (busStopIndex) => {
    updateTimestamp(busStopIndex); // Update the corresponding stop with the current timestamp
  };

  useEffect(() => {

    if (StopIds > 0) {
     
      handleNotification(StopIds - 1); // Update based on the StopId
    }
  }, [StopIds]);



  const clearTimestamps = () => {
    localStorage.removeItem('busStopTimestamps');
    setTimestamps(Array(busStops.length).fill(null)); // Reset the state to the initial value
  };
  
  
  const clearAllData = () => {
    localStorage.clear();
    setTimestamps(Array(busStops.length).fill(null)); // Reset the state to the initial value
  };


  // ********************* AUTO CLEARING *******************************************************
  useEffect(() => {
    timeFlag = localStorage.getItem("timeFlag"); 
    console.log("time flag " + timeFlag);
    if (timeFlag == null) {
      localStorage.setItem("timeFlag", "false");
    } 
    // else {

      if (hours >= 0 && hours < 12 && timeFlag == "false") {
        clearTimestamps();
        localStorage.setItem("timeFlag", "true");
        console.log("time flag morning  " + timeFlag);
      } 
      
else if (hours >= 12 && hours < 24 && timeFlag == "true") {
        clearTimestamps();
        localStorage.setItem("timeFlag", "false");
        console.log("time flag evening  " + timeFlag);
      }
    // }
  }, [timeFlag,hours]);


// *********************************************************************************************
  return (
    <Page>
      <div id="topBorder">
        <div style={{ marginTop: "3%", marginLeft: "3%", fontSize: "15px" }}>
          <Icon ios="f7:timer" md="f7:timer" size="20px" />
          <span> 
           { "Time to the Final Stop "} 
            <span style={{ color: "rgb(200,100,100)", fontWeight: "bold" }}>
                "{stop}" 
            </span> is   
            <span style={{ color: "rgb(8, 130, 243)"}}>
              <span style={{ fontWeight: "bold" }}> {travelTimeH}</span>
              <span>{"hr:"}</span>
              <span style={{ fontWeight: "bold" }}>{travelTimeM}</span>
              <span>{"m"}</span>
            </span>
          </span>
        </div>

        <div style={{ width: '90%', margin: '1% 4%' }}>
          <div style={{ width: "100%" }}>
            <Icon ios="f7:pin_fill" md="f7:pin_fill" size="20px" color="red" />
            <Icon ios="f7:map_pin_ellipse" md="f7:map_pin_ellipse" style={{ left: "90%" }} color="green" />
          </div>
          <Range
            min={0}
            max={100}
            step={1}
            value={[min, max]}
            label={true}
            dual={true}
            color="rgb(8, 130, 243)"
            draggablebar={false}
          />
        </div>
      </div>
      
      <div className="timeline">
        {stops.map((stop, index) => (
          timestamps[index] && (
            <div key={index} className="timeline-item">
              <div className="timeline-item-date">{stop.name}  </div>
              <div className="timeline-item-divider"></div>
              <div className="timeline-item-content">
                <div className="timeline-item-inner">
                  <div className="timestamp">
                    <span style={{ color: "rgb(214, 103, 23)", fontWeight: "bold" }}>
                      Bus At this Location At
                    </span> {timestamps[index]} {/* Display timestamp */}
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

         { /* Button to clear timestamps */}
         <div>
    <Button onClick={clearTimestamps}
    position="right-bottom"
          className="deleteButton"
          raised
          round
          fill
          tonal
          color="green"
          style={{ left: "5%" }}
          animate={true}
          ignoreCache={true}
        >
          <Icon ios="f7:bin_xmark_fill" md="f7:bin_xmark_fill" />
            <span style ={{marginLeft:"5%"}}>   Delete Notification Tracking</span>
        </Button>
        </div>
    </Page>
  );
};

export default BusRoutes;
