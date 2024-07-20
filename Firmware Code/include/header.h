#ifndef HEADER_H
#define HEADER_H

// ************ WIFI AND MQTT DECLARATION ***************
#include <WiFi.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
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

const int gpsLed = 12;
const unsigned long postingInterval = 5L * 1000L; // Post data every 20 seconds.

const char *mqtt_server = "41.223.145.80";  //"mqtt3.thingspeak.com";     //"41.223.145.80";
const char *MQTT_USERNAME = "admin";   //GRgjITklDCklDwoFDREoCS0";
const char *MQTT_PASSWORD =   "admin";    //h3YrlZ2sdEfOzeoN/T/aLDFv" ;  // "12345678";
const char *MQTT_CLIENT_ID =    "1223487" ; //GRgjITklDCklDwoFDREoCS0";

// *****************************************************************

// ################# voice ################
const int Unilag = 1;
const int Abule_Oja = 2;
const int Onike  = 3;
const int Sabo = 4;
const int Alagomeji = 5; 
const int Ifitness = 6;
const int Adekunle = 7;
const int GpsLocate = 8;
const int Alert = 9;
// ##########################################



int speak;
float diff = 0.00015;
int currentStop = 0;
int previousStop = -1;

 bool voiceFlag = false;
 bool  gpsLocateFlag = false;
 bool BusFlag = false;
 String BusStop = "";
double latitude,longitude,speed;
 TaskHandle_t WifiTaskHandler;
 TaskHandle_t ReadingTaskHandler;
 const char* apiKey = "7JR9GHQ66ezCSlsZU7tsZCdvdUMLs78zoz0OmlPXZXc";

#endif

