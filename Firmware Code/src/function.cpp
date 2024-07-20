#include "function.h"


struct BusStop {
  const char* name;
  double latitude;
  double longitude;
  int returnValue;
};


struct BusStop busStops[] = {
  {"Unilag Bus Stop",  6.517689, 3.384223, 1},    // Replace with actual coordinates    6.5176, 3.3842,
  {"Abule-Oja Bus Stop", 6.516592, 3.381157, 2},   // Replace with actual coordinates   6.5166, 3.3811,
  {"Onike Bus Stop", 6.509640, 3.383816, 3}, // Replace with actual coordinates
    {"Sabo Bus Stop", 6.505617,3.377856, 4},    // Replace with actual coordinates
  {"Alagomeji Bus Stop", 6.499548, 3.378231, 5},   // Replace with actual coordinates
    {"iFitness Bus Stop", 6.497126, 3.379595, 6}, // Replace with actual coordinates
  {"Adekunle Bus Stop", 6.491500, 3.382831, 7}, // Replace with actual coordinates
    {"Interswitch Bus Stop", 6.428549, 3.429369, 8}, // Replace with actual coordinates
    {"Estate Bus Stop", 6.491072, 3.390133, 9},   // Replace with actual coordinates

};

const double radius = 50.0; // Radius in meters for detecting the bus stop




void displayInfo()
{
 
  if (gps.location.isValid() && (gps.date.isValid() && gps.time.isValid()) && gps.speed.isValid())
  {
    latitude = gps.location.lat();
    longitude = gps.location.lng();
    speed = gps.speed.kmph();

    blink();

    // checkBusStops(latitude,longitude);
//  Serial.print(F("Location: "));
//     Serial.print(gps.location.lat(), 6);
//     Serial.print(F(","));
//     Serial.print(gps.location.lng(), 6);

//       Serial.print(F(" "));

//      Serial.print(F("  Date/Time: "));
//     Serial.print(F("/"));
//     Serial.print(gps.date.day());
//     Serial.print(F("/"));
//     Serial.print(gps.date.year());
//      if (gps.time.hour() < 10)
//       Serial.print(F("0"));
//     Serial.print(gps.time.hour());
//     Serial.print(F(":"));
//     if (gps.time.minute() < 10)
//       Serial.print(F("0"));
//     Serial.print(gps.time.minute());
//     Serial.print(F(":"));
//     if (gps.time.second() < 10)
//       Serial.print(F("0"));
//     Serial.print(gps.time.second());
//     Serial.print(F("."));
//     if (gps.time.centisecond() < 10)
//       Serial.print(F("0"));
//     Serial.print(gps.time.centisecond());

//       Serial.print(F(" "));

//   Serial.print(F("Speed: "));
//     Serial.print(gps.speed.kmph());
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



String trimCord(double cord, int point){
    return serialized(String(cord,point));
}

void blink(){
   digitalWrite(gpsLed,HIGH);
   delay(200);
      digitalWrite(gpsLed,LOW);
   delay(200);
}

  
     String getReverseGeocoding(double latitude, double longitude) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "https://revgeocode.search.hereapi.com/v1/revgeocode?apikey=" + String(apiKey) + "&at=" + String(latitude, 6) + "," + String(longitude, 6) + "&lang=en-US";
    http.begin(url);
    int httpCode = http.GET();
    String payload;

    if (httpCode > 0) {
      payload = http.getString();
    } else {
      payload = "Error on HTTP request";
    }
    http.end();

    // Parse the JSON response
    StaticJsonDocument<1024> doc;
    DeserializationError error = deserializeJson(doc, payload);
    if (error) {
      return "Failed to parse JSON";
    }
    const char* city = doc["items"][0]["address"]["city"];
    const char* country = doc["items"][0]["address"]["label"];
    String address = String(city) + ", " + String(country);
    return address;
  } else {
    return "WiFi Disconnected";
  }
}




void checkBusStops(double lat, double lng) {
  bool atBusStop = false;
  
  for (int i = 0; i < sizeof(busStops) / sizeof(busStops[0]); i++) {
    double distance = calculateDistance(busStops[i].latitude, busStops[i].longitude, lat, lng);
       Serial.print(". Distance: ");
      Serial.println(distance);
    if (distance <= radius) {
      Serial.print("Reached ");
      Serial.print(busStops[i].name);
      Serial.print(". Returning value: ");
      Serial.println(busStops[i].returnValue);

      atBusStop = true;
         BusFlag = true;
      BusStop = String(busStops[i].name);
     currentStop = busStops[i].returnValue;
      break;  // Exit loop if bus stop is found
    }
  }

  if (!atBusStop) {
    Serial.println("Not at any bus stop.");
          currentStop = 0;
 previousStop = -1;
 BusStop = "";
 BusFlag = false;
  }
  }

double deg2rad(double deg) {
  return deg * (M_PI / 180.0);
}



double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
  const int R = 6371000; // Radius of the Earth in meters
  double dLat = deg2rad(lat2 - lat1);
  double dLng = deg2rad(lng2 - lng1);
  double a = sin(dLat / 2) * sin(dLat / 2) +
             cos(deg2rad(lat1)) * cos(deg2rad(lat2)) *
             sin(dLng / 2) * sin(dLng / 2);
  double c = 2 * atan2(sqrt(a), sqrt(1 - a));
  return R * c;
}