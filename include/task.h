#ifndef TASK_H
#define TASK_H
#include <Arduino.h>
#include "global.h"
#include "rtc.h"
#include "function.h"
#include "mqtt.h"

void ReadTask(void *declearation);
void WifiTask(void *pvParameters);
// void HomeTask(void *pvParameters);

#endif