#ifndef HEADER_H
#define HEADER_H

// ************ WIFI AND MQTT DECLARATION ***************
#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClient.h>
WiFiClient espClient;
PubSubClient client(espClient);

//**********************************
#include <HardwareSerial.h>
HardwareSerial mySerial(1);

#include "DFRobotDFPlayerMini.h"
DFRobotDFPlayerMini myDFPlayer;

//********* WIFI CREDENTIAL *******************
const char *ssid = "Israel's Galaxy S20 FE 5G";
const char *Password = "64646464.1";
// ***********************************************
#include <TinyGPSPlus.h>
TinyGPSPlus gps;


//******************* MQTT HEADER ***************************
String publishTopic = "yaba/location";  //"channels/2580764/publish" ;    //"yaba/location" ; // REPLACE THE NUMBER 114938 WITH YOUR channel ID


const unsigned long postingInterval = 5L * 1000L; // Post data every 20 seconds.

const char *mqtt_server = "41.223.145.80";  //"mqtt3.thingspeak.com";     //"41.223.145.80";
const char *MQTT_USERNAME = "admin";   //GRgjITklDCklDwoFDREoCS0";
const char *MQTT_PASSWORD =   "admin";    //h3YrlZ2sdEfOzeoN/T/aLDFv" ;  // "12345678";
const char *MQTT_CLIENT_ID =    "1223487" ; //GRgjITklDCklDwoFDREoCS0";

// *****************************************************************

double latitude,longitude,speed;
 TaskHandle_t WifiTaskHandler;
 TaskHandle_t ReadingTaskHandler;

#endif