#ifndef GLOBAL_H
#define GLOBAL_H
#include <Arduino.h>
#include <HardwareSerial.h>

#include <TinyGPSPlus.h>
extern TinyGPSPlus gps;

// ************ WIFI AND MQTT DECLARATION ***************
#include <WiFi.h>
#include <PubSubClient.h>
#include <HTTPClient.h>
#include <WiFiClient.h>
extern WiFiClient espClient;
extern PubSubClient client;

//********* WIFI CREDENTIAL *******************
extern const char *ssid;
extern const char *Password;
// ***********************************************

//******************* MQTT HEADER ***************************
extern String publishTopic; // REPLACE THE NUMBER 114938 WITH YOUR channel ID


extern const unsigned long postingInterval; // Post data every 20 seconds.

extern const char *MQTT_USERNAME;
extern const char *MQTT_CLIENT_ID;
extern const char *MQTT_PASSWORD;

extern const char *mqtt_server;
// **********************************************************************

// ################# voice ################
extern const int Unilag ;
extern const int Abule_Oja ;
extern const int Onike ;
extern const int Sabo ;
extern const int Alagomeji; 
extern const int Ifitness;
extern const int Adekunle ;
extern const int GpsLocate;
extern const int Alert;
// ##########################################


extern bool voiceFlag;
extern bool  gpsLocateFlag;
extern int speak;
extern int currentStop;
extern int previousStop;
extern bool BusFlag;
extern String BusStop;
extern double latitude,longitude,speed;
extern const int gpsLed;
extern TaskHandle_t WifiTaskHandler;
extern TaskHandle_t ReadingTaskHandler;
extern  const char* apiKey;
#endif