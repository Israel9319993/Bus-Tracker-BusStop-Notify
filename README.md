# Bus-Tracker-BusStop-Notify
### Repository Name: Bus-Tracker-BusStop-Notify

### Description:
The Bus-Tracker-BusStop-Notify system provides real-time tracking of bus locations and announces upcoming bus stops with voice notifications. Using GPS and GNSS technologies, the system accurately locates buses and employs MQTT to publish coordinates to an MQTT broker. The backend, implemented in Java, retrieves these coordinates and forwards them to the front end via WebSockets, ensuring timely and reliable updates for users.

#### Key Features:
1. **Real-Time Bus Tracking**: Utilizes GPS and GNSS to continuously monitor and update the bus location.
2. **MQTT Integration**: Publishes bus coordinates in real-time to an MQTT broker for efficient data distribution.
3. **Java Backend**: The backend service, written in Java, fetches the coordinates from the MQTT broker and processes them.
4. **WebSocket Communication**: Sends the processed coordinates to the front end using WebSockets for real-time updates.
5. **Bus Stop Notifications**: Provides voice prompts and notifications for upcoming bus stops, enhancing the commuter experience.
6. **Voice Announcements**: Announces every preset bus stop via voice notification to keep passengers informed about their journey.

#### Technical Overview:
- **GPS/GNSS Module**: Collects accurate location data from the bus.
- **ESP32 Microcontroller**: Manages the GPS/GNSS data and publishes coordinates to the MQTT broker.
- **MQTT Broker**: Acts as an intermediary to distribute the real-time location data to the backend.
- **Java Backend Service**: Subscribes to the MQTT broker, processes the incoming data, and sends it to the front end via WebSockets.
- **WebSocket Front End**: Receives real-time location updates and displays them on a map interface, along with bus stop notifications and voice prompts.
- **Voice Notification System**: Announces each preset bus stop to passengers, providing clear and timely updates about their journey.

This system ensures that users have access to precise and up-to-date bus location information and receive timely voice announcements for every bus stop, improving the overall efficiency and convenience of public transportation.

