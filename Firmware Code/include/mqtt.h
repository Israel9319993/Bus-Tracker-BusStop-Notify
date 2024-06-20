#ifndef MQTT_H
#define MQTT_H
#include <Arduino.h>
#include "global.h"

#include "function.h"
#include <ArduinoJson.h>

void pushMessage();
String offLineMsg();
void publishMessage(String topic, String payload, boolean retained);
void reconnect();
void callback(char* topic, byte* payload, unsigned int length) ;

#endif