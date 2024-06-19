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
String publishTopic = "yaba/location" ; // REPLACE THE NUMBER 114938 WITH YOUR channel ID
String  meter_id = "0001";

const unsigned long postingInterval = 5L * 1000L; // Post data every 20 seconds.

const char *mqtt_server = "41.223.145.80";
const char *MQTT_USERNAME = "admin";
const char *MQTT_CLIENT_ID = "gps";
const char *MQTT_PASSWORD = "12345678";
String WILL_TOPIC = "gpsState";
uint8_t WILL_QOS = 1;
bool WILL_RETAIN = false;
const char *WILL_MSG = "offline";
bool CLEAR_SESSION = false;
// *****************************************************************

double latitude,longitude,speed;
 TaskHandle_t HomeTaskHandler;
 TaskHandle_t WifiTaskHandler;
 TaskHandle_t ReadingTaskHandler;

#endif