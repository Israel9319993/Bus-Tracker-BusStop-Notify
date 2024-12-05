import React, { useState, useEffect } from 'react';
import { Page, Navbar, List, ListItem } from 'framework7-react';
import { busStops } from '../js/map';
import { StopIds } from './home'; // Ensure this is correctly imported or used
import { timeTracking } from '../js/component';

const NotificationPage = () => {
  const stops = busStops(); // Get bus stops
  const hours = timeTracking();
  const [timestamps, setTimestamps] = useState(Array(stops?.length || 0).fill(null)); // Ensure stops is defined
  const [currentStopId, setCurrentStopId] = useState(StopIds); // Track StopIds in state

  // Load timestamps from localStorage on component mount
  useEffect(() => {
    const storedTimestamps = localStorage.getItem('busStopTimestamps');
    if (storedTimestamps) {
      setTimestamps(JSON.parse(storedTimestamps)); // Set timestamps if found in localStorage
    }
  }, []);

  // Function to update timestamp for a specific bus stop
  const updateTimestamp = (stopIndex) => {
    const currentTime = new Date().toLocaleTimeString(); // Get current time
    setTimestamps((prevTimestamps) => {
      const updatedTimestamps = [...prevTimestamps];
      updatedTimestamps[stopIndex] = currentTime; // Update the timestamp for the specific stop

      // Store the updated timestamps in localStorage
      localStorage.setItem('busStopTimestamps', JSON.stringify(updatedTimestamps));

      return updatedTimestamps;
    });
  };

  // Handle notification and update timestamps
  const handleNotification = (busStopIndex) => {
    updateTimestamp(busStopIndex); // Update the corresponding stop with the current timestamp
  };

  // Effect to handle StopIds change and force re-render
  useEffect(() => {
    if (currentStopId > 0) {
      
      if (hours >= 0 && hours < 12) {
        handleNotification(currentStopId -1); // Update based on the StopId
        console.log('Stop ids:  ' + currentStopId);
      } else {
        handleNotification(currentStopId);
        console.log('Stop ids:  ' + currentStopId);
      }
    }
  }, [currentStopId]);

  // Watch for changes to StopIds and update currentStopId
  useEffect(() => {
    setCurrentStopId(StopIds); // Update the currentStopId state whenever StopIds changes
  }, [StopIds]);

  // Watch for changes to timestamps in localStorage and re-render
  useEffect(() => {
    const interval = setInterval(() => {
      const storedTimestamps = localStorage.getItem('busStopTimestamps');
      if (storedTimestamps) {
        setTimestamps(JSON.parse(storedTimestamps)); // Set timestamps if found in localStorage
      }
    }, 1000); // Poll every second (you can adjust this interval as needed)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <Page name="notification">
      <Navbar title="Notification" />

      <List dividers outlineIos strongIos>
        {timestamps.map((timestamp, index) => (
          stops[index] && timestamp && ( // Ensure both stops and timestamps are defined
            <ListItem
              key={index}
              title={<span style={{ color: 'rgb(60,60,60)', fontWeight: 'bold' }}>Bus Stop Alert!</span>}
              after={<span style={{ color: 'red' }}>{timestamp}</span>}
              footer={<span style={{ fontSize: '110%', fontWeight: '500', color: 'green' }}>YAB251 just arrived at {stops[index]?.name}</span>} // Safely access stop name
            />
          )
        ))}
      </List>
    </Page>
  );
};

export default NotificationPage;
