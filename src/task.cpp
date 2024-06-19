#include "task.h"

void ReadTask(void *declearation)
{

  (void)declearation;
  while (1)
  {
  while (Serial2.available() > 0)
    if (gps.encode(Serial2.read()))
      displayInfo();

  if (millis() > 5000 && gps.charsProcessed() < 10)
  {
    Serial.println(F("No GPS detected: check wiring."));
    while(true);
  }
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}



void WifiTask(void *pvParameters)
{
  (void)pvParameters;
  double lastUploadedTime = 0;
  const int postingInterval = 15000;
  while (true)
  {

    if (WiFi.status() == WL_CONNECTED)
    {
      if (!client.connected())

        reconnect();

      client.loop();

      if (millis() - lastUploadedTime > postingInterval)
      { // The uploading interval must be > 15 seconds

        pushMessage();
        lastUploadedTime = millis();
      }
    }
   
    delay(100);
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}


