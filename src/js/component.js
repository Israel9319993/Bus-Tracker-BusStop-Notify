import { useState, useEffect, useRef } from 'react';
import { f7, Icon } from 'framework7-react';
import { busStops } from "./map";
 // Ensure this is properly installed and working
import customIconUrl from '../img/mark.png';
import busStopUrl from '../img/BusStop.png';
import officeUrl from '../img/office.png';
import "../css/appNotification.css";
import { NativeAudio } from '@capacitor-community/native-audio';


// Helper function to convert distance and speed to hours and minutes
export function convertToHoursAndMinutes(distance, speed) {
  const timeInHours = distance / speed;
  const hours = Math.floor(timeInHours);
  const minutes = Math.round((timeInHours - hours) * 60);
  return { hours, minutes };
}

// Function to track the current hour


export function timeTracking() {
  return new Date().getHours();
}





// Icon configurations for custom markers
export const customIcon = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [50, 50],
  iconAnchor: [19, 50],
  popupAnchor: [8, -50],
});

export const bustopIcon = new L.Icon({
  iconUrl: busStopUrl,
  iconSize: [50, 50],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

export const officeIcon = new L.Icon({
  iconUrl: officeUrl,
  iconSize: [70, 70],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Global RouteTime object
export let RouteTime = {
  value: [], // Initial value
};

// Load sounds for notifications
// Function to show notification



export const useNotification = () => {
  const stops = busStops();
  const notificationFull = useRef(null);
  // const notificationSound = new Audio('../assets/sound/alert.mp3'); // Path to your sound file


  useEffect(() => {
    const preloadAudio = async () => {
      try {


          const assetPath = Capacitor.convertFileSrc("assets/sound/alert.mp3");

        await NativeAudio.preload({
          assetId: "alert",
          assetPath: assetPath, // Now using the converted absolute URL
          audioChannelNum: 1,
          isUrl: true, // Since the file path is absolute
        });
        console.log("Audio preloaded successfully");
      } catch (error) {
        console.error("Error preloading audio:", error);
      }
    };

    preloadAudio();

    // Cleanup function: unload audio when the component unmounts
    return () => {
      NativeAudio.unload({ assetId: "alert" }).catch((error) => {
        console.error("Error unloading audio:", error);
      });
    };
  }, []);

  // Play the audio on button click
  const playAudio = async () => {
    try {
      await NativeAudio.play({ assetId: 'alert' });
      console.log("Audio playing");
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };




  // Call this function to show a notification
  const showNotificationFull = (n) => {
    const hours = timeTracking();
    // Destroy the existing notification (if any) to avoid old content showing up
    if (notificationFull.current) {
      notificationFull.current.close();
      notificationFull.current.destroy();
      notificationFull.current = null;
    }

    // Create the new notification with updated content
    notificationFull.current = f7.notification.create({
      icon: '<i class="icon f7-icons">bell_fill</i>', // Notification icon
      title: 'Bus Notification',
      titleRightText: 'now', // Timestamp on the right
      subtitle: `This Bus is Currently at ${
        hours >= 0 && hours <= 12
          ? (stops[n - 1]?.name || "Final Destination")
          : (stops[n - 1]?.name || "Final Destination")
      }`,
      text: `${
        hours >= 0 && hours <= 12
          ? (stops[n]?.name ? `Now! Moving to ${stops[n].name}` : "You have reached the Final Destination!")
          : (stops[n - 2]?.name ? `Now! Moving to ${stops[n - 2].name}` : "You have reached the Final Destination!")
      }`,
      cssClass: 'custom-notification',
      closeTimeout: 5000, // Auto close after 5 seconds
    });

    // Play sound effect

    playAudio();
    // Play the notification sound
    // notificationSound.play().catch((error) => {
    //   console.error('Error playing sound:', error);
    // });

    // Open the notification
    notificationFull.current.open();
  };

 

  return { showNotificationFull };
};

// Function to manage time flag in localStorage
export function timeFlag() {
  const [flag, setFlag] = useState(null);

  useEffect(() => {
    const storedFlag = localStorage.getItem("timeFlag");
    setFlag(storedFlag);
  }, []);

  return flag;
}
