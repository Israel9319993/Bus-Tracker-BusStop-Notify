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
#endif