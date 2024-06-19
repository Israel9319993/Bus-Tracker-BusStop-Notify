#include "task.h"
#include "function.h"
#include "header.h"

 

// The serial connection to the GPS device
// SoftwareSerial ss(RXPin, TXPin);
void displayInfo();

void setup()
{
  Serial.begin(9600);
  Serial2.begin(9600);
   mySerial.begin(9600, SERIAL_8N1, 13, 14);
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
      3040,
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

      
//  myDFPlayer.volume(20);
//   myDFPlayer.playLargeFolder(2,3); 
//   xTaskCreatePinnedToCore(
//       HomeTask,
//       "Home",
//       4060 ,
//       NULL,
//       1,
//       NULL,
//       1);
}


void loop()
{
  // This sketch displays information every time a new sentence is correctly encoded.
  // myDFPlayer.playLargeFolder(2,3);
  // delay(3000);
}

