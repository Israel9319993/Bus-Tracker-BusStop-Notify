#include "mqtt.h"

void pushMessage()
{
    StaticJsonDocument<512> doc;
    
      JsonArray data = doc["location"].to<JsonArray>();
  data.add(latitude);
  data.add(longitude);
    doc["speed"] = speed;
    doc["link"] = "http://maps.google.com/?q=" + serialized(String(latitude,10)) + "," + serialized(String(longitude,10));
//   String output = "field1=" + serialized(String(latitude,10)) + "&field2=" + serialized(String(longitude,10)) + "&field3=" + String(speed) + "&status=MQTTPUBLISH";  
    String output;
    serializeJsonPretty(doc, output);

    publishMessage((publishTopic), output, true);
}

//======================================= publising as string
void publishMessage(String topic, String payload, boolean retained)
{
    if (client.publish(topic.c_str(), payload.c_str()))
    {
        Serial.println("Message publised [" + String(topic) + "]: " + payload);
    }

    else
    {
        Serial.println("error in sending message");
    }
}

String offLineMsg()
{
    StaticJsonDocument<512> doc;
    doc["gpsStatus"] = "Offline";
   
    String output;
    serializeJsonPretty(doc, output);
    return output;
}

//=====================================
void reconnect()
{
    // Loop until we're reconnected
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        // client.connect("cliend ID", "username","password") Replace with your Thingspeak MQTT Device Credentials
        // if (client.connect(meter_id.c_str(), MQTT_USERNAME, MQTT_PASSWORD, (WILL_TOPIC).c_str(), WILL_QOS, WILL_RETAIN, offLineMsg().c_str(), CLEAR_SESSION))
         if (client.connect(MQTT_CLIENT_ID,MQTT_USERNAME, MQTT_PASSWORD))
        {
            Serial.println("connected");
          
            pushMessage();

        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds"); // Wait 5 seconds before retrying
            delay(1000);
        }
    }
}

void callback(char *topic, byte *payload, unsigned int length)
{

    String incommingMessage = "";
    for (int i = 0; i < length; i++)
    {
        incommingMessage += (char)payload[i];
    }

    Serial.println("Message arrived [" + String(topic) + "]" + incommingMessage);

    
}