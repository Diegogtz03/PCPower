# **PCPower**

A websocket server and API that allows you to control and check your PC power state from a simple API or a web interface anywhere in the world.

Made together with [ESP-PC](https://github.com/Diegogtz03/ESP-PC).

-----
## Websocket Server
- Opens up the port 3100 for WS/WSS access
- Allows for the API to communicate with the ESP32 via POST requests

## API
### /status (GET)
- Return "Arduino not connected" if the ESP is offline
- Returns either "ON" or "OFF" depending on the value of the PC's LED

### /on (POST)
- Needs authorization header defined by the .env variable AUTHORIZATION_HEADER
- Return "Arduino not connected" if the ESP is offline
- Sends message to ESP requesting the PC to turn ON

### /off (POST)
- Needs authorization header defined by the .env variable AUTHORIZATION_HEADER
- Return "Arduino not connected" if the ESP is offline
- Sends message to ESP requesting the PC to turn OFF

-----
## Triggers / Deployments
### HTTPS deployment 
- I've provided some docker files for easy deployment on a remote server.
- This would allow for secure connections and for remote connections anywhere in the world.

### A simple request
- You could use simple post requests for triggering the ESP

### Custom UI
- You could make a simple custom UI to see the PC's status/trigger the PC's state

### iOS Shortcuts
- I have a simple example of how I integrated this with Apple's Shortcuts for quick and easy use on all of my iOS devices remotely.

  
![IMG_3286](https://github.com/Diegogtz03/PCPower/assets/65473367/64266f9c-e7c4-4cd4-b1c2-872af546fdf7)
![IMG_3287](https://github.com/Diegogtz03/PCPower/assets/65473367/ee42f3db-1e70-4d58-9713-08b12f528342)
