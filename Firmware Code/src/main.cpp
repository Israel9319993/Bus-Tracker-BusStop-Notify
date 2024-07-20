#include "task.h"
#include "function.h"
#include "header.h"



void setup()
{
  Serial.begin(9600);
  Serial2.begin(9600);
   mySerial.begin(9600, SERIAL_8N1, 5, 18);
   pinMode(gpsLed,OUTPUT);
  
WifiBegin();
  Serial.println(F("DeviceExample.ino"));
  Serial.println(F("A simple demonstration of TinyGPSPlus with an attached GPS module"));
  Serial.print(F("Testing TinyGPSPlus library v. ")); Serial.println(TinyGPSPlus::libraryVersion());
  Serial.println(F("by Mikal Hart"));
  Serial.println();
  Serial.println(F("DFRobot DFPlayer Mini Demo"));
  Serial.println(F("Initializing DFPlayer ... (May take 3~5 seconds)"));

  if (!myDFPlayer.begin( mySerial))
  { // Use softwareSerial to communicate with mp3.
    Serial.println(F("Unable to begin:"));
    Serial.println(F("1.Please recheck the connection!"));
    Serial.println(F("2.Please insert the SD card!"));
  } 
  // ************************** TASK SCHEDULER ********************
  xTaskCreatePinnedToCore(
      ReadTask,
      "Reading",
      4060,
      NULL,
      1,
      &ReadingTaskHandler,
      1);

  xTaskCreatePinnedToCore(
      WifiTask,
      "Wifi",
      4060,
      NULL,
      1,
      &WifiTaskHandler,
      0);

myDFPlayer.volume(30);
}



void loop()
{
if(longitude > 0 && latitude > 0 &&  gpsLocateFlag == false){
  myDFPlayer.playLargeFolder(4,GpsLocate); 
  delay(5000);
  gpsLocateFlag = true;
}



   Serial.println("main cordinate:   "  + trimCord(latitude,10)  + "," + trimCord(longitude,10));


if(longitude > 0 && latitude > 0){
checkBusStops(latitude,longitude);
}
 if (currentStop != previousStop) {
      voiceFlag = true;
      speak = currentStop; // Set speak to the current stop
      previousStop = currentStop; // Update the previous stop
    }

if(voiceFlag == true){

 myDFPlayer.playLargeFolder(4,speak);
delay(200);
voiceFlag = false; 
delay(1000);
  }

    // String address = getReverseGeocoding(latitude, longitude); 
      // Serial.println("Address: " + address);
delay(100);
}


   