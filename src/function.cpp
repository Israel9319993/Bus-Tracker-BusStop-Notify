#include "function.h"

void displayInfo()
{
 
  if (gps.location.isValid() && (gps.date.isValid() && gps.time.isValid()) && gps.speed.isValid())
  {
    latitude = gps.location.lat();
    longitude = gps.location.lng();
    speed = gps.speed.kmph();


 Serial.print(F("Location: "));
    Serial.print(gps.location.lat(), 6);
    Serial.print(F(","));
    Serial.print(gps.location.lng(), 6);

      Serial.print(F(" "));

     Serial.print(F("  Date/Time: "));
    Serial.print(F("/"));
    Serial.print(gps.date.day());
    Serial.print(F("/"));
    Serial.print(gps.date.year());
     if (gps.time.hour() < 10)
      Serial.print(F("0"));
    Serial.print(gps.time.hour());
    Serial.print(F(":"));
    if (gps.time.minute() < 10)
      Serial.print(F("0"));
    Serial.print(gps.time.minute());
    Serial.print(F(":"));
    if (gps.time.second() < 10)
      Serial.print(F("0"));
    Serial.print(gps.time.second());
    Serial.print(F("."));
    if (gps.time.centisecond() < 10)
      Serial.print(F("0"));
    Serial.print(gps.time.centisecond());

      Serial.print(F(" "));

  Serial.print(F("Speed: "));
    Serial.print(gps.speed.kmph());
  }

 
  
  else
  {
    Serial.print(F("INVALID"));
    latitude = 0;
    latitude = 0;
    speed = 0;
  }

  Serial.println();
}

void WiFiStationConnected(WiFiEvent_t event, WiFiEventInfo_t info)
{
  Serial.println("Connected to AP successfully!");
}

void WiFiStationDisconnected(WiFiEvent_t event, WiFiEventInfo_t info)
{
  WiFi.begin(ssid, Password);
}

void WifiBegin()
{

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, Password);

  WiFi.onEvent(WiFiStationConnected, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_CONNECTED);
  WiFi.onEvent(WiFiStationDisconnected, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}
