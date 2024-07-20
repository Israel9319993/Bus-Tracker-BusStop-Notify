#ifndef FUNCTION_H
#define FUNCTION_H
#include "global.h"
#include <Arduino.h>
#include "mqtt.h"
#include "function.h"

void displayInfo();
void WifiBegin();
void WiFiStationConnected(WiFiEvent_t event, WiFiEventInfo_t info);
void WiFiStationDisconnected(WiFiEvent_t event, WiFiEventInfo_t info);
void ButStopAlert();
bool StopLocate(float lat, float lon);
String trimCord(double cord, int point);
void blink();
String getReverseGeocoding(double latitude, double longitude);
void checkBusStops(double lat, double lng) ;
double calculateDistance(double lat1, double lng1, double lat2, double lng2);
double deg2rad(double deg);


#endif