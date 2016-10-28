# Transportation App
This program has been written in AngularJS.
Since the Vienna Public Transport API only supports http requests, Gulp browser-sync had to be 
modefied in order to deal with those kind of requests. The http-requests are implemented in the nodejs server (server.js). 

## Using the App
This app shows arrival times for the Vienna Underground line U1.

## Build Process
To install open a terminal and type:
- git clone https://github.com/phifour/transportationapp.git transportationapp
- cd transportationapp
- npm install
- gulp build
- gulp serve
- app runs per default on http://localhost:3000/

