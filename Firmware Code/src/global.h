#ifndef GLOBAL_H
#define GLOBAL_H
#include <Arduino.h>
#include <HardwareSerial.h>

#include <TinyGPSPlus.h>
extern TinyGPSPlus gps;

// ************ WIFI AND MQTT DECLARATION ***************
#include <WiFi.h>
#include <PubSubClient.h>
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
extern const int unilag;
extern const int sabo;
extern const int alagomeji;
extern const int adekunle;
extern const int esate;

extern double latitude,longitude,speed;

extern TaskHandle_t WifiTaskHandler;
extern TaskHandle_t ReadingTaskHandler;
#endif