

var app = angular.module('app', ['ui.bootstrap']);

app.controller('MainCtrl', ['$scope', '$http', 'TripRequestService', MainCtrl])

var token = "c14a9a73-8ff7-43a4-96ef-dc78d7d33740";

function MainCtrl($scope, $http,TripRequestService) {

    $scope.status = "Wolfgang";
    
    var getloc = TripRequestService.locationservice;
    var api_key = 'XwCTb7o9iV';

    $scope.names = undefined;

    $scope.routes = [];

    var stations = ['Reumannplatz','Keplerplatz', 'Südtiroler Platz-Hauptbahnhof', 'Taubstummengasse',
    'Karlsplatz', 'Stephansplatz', 'Herrengasse','Schwedenplatz','Nestroyplatz', 'Praterster',
    'Vorgartenstraße','Donauinsel','Kaisermühlen','Alte Donau','Kagran','Kagraner Platz','Rennbahnweg',
    'Aderklaaer Straße','Großfeldsiedlung','Leopoldau'];
       
    $scope.divclass = {};
    $scope.stations = stations;

    $scope.divclass['U1-H'] = "U1";
    $scope.divclass['U3-R'] = "timeline-content";
    
    $scope.itdItinerary = {};
   console.log('hello!!??!');
    for (var i = 0; i < stations.length; i++) {
        getloc(stations[i]).then(function (data) {
            console.log($scope.stations[i]);
            console.log(stations[i], data.data.stopFinder[0].ref.id);
        })
    }
        
    
    $scope.request = function (journey) {

        // Create x2js instance with default config
        //var goal = 'Herrengasse';
        // var goal = 'Stephansplatz';
        
        console.log(journey);
            
        console.log("http://www.wienerlinien.at/ogd_routing/XML_TRIP_REQUEST2?locationServerActive=1&type_origin=any&name_origin="+journey.startpoint+"&type_destination=any&name_destination=" + journey.endpoint);
        
        $http({
            method: 'GET',
            timeout: 5000000,
            // url: "http://www.wienerlinien.at/ogd_routing/XML_TRIP_REQUEST2?locationServerActive=1&outputFormat=JSON&type_origin=any&name_origin=Reumannplatz&type_destination=any&name_destination=Stephansplatz", 
            url: "http://www.wienerlinien.at/ogd_routing/XML_TRIP_REQUEST2?locationServerActive=1&type_origin=any&name_origin="+journey.startpoint+"&type_destination=any&name_destination=" + journey.endpoint,
            params: {
                sender: api_key
            },
            locationServerActive:1,
            excludedMeans:0, 
            excludedMeans:1, 
            excludedMeans:3, 
            excludedMeans:4, 
            excludedMeans:5, 
            excludedMeans:6, 
            excludedMeans:7, 
            excludedMeans:8, 
            excludedMeans:9, 
            excludedMeans:10,
            excludedMeans:11,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8'
        })
            .then(function (data, status, headers, config) {

                var x2js = new X2JS();   
                var jsonObj = x2js.xml_str2json(data.data);
                
                console.log('data',data);               
                console.log('jsonObj',jsonObj);
                
                
                $scope.itdItinerary = jsonObj.itdRequest.itdTripRequest.itdItinerary;
                
                
                var x = jsonObj.itdRequest.itdTripRequest.itdItinerary;
                
                console.log('data', jsonObj);

                console.log("init structure", x.itdRouteList.itdRoute[0].itdPartialRouteList.itdPartialRoute);
                    
                    
                $scope.routes = jsonObj.itdRequest.itdTripRequest.itdItinerary.itdRouteList.itdRoute;

                console.log("itdPartialRoute is array", Array.isArray(x.itdRouteList.itdRoute[0].itdPartialRouteList.itdPartialRoute));


                // $scope.routes = [];

                // for (var i=0;i<x.itdRouteList.itdRoute.length;i++){
                //     $scope.routes.push(i);
                // }

                $scope.departures = [];
                
                
                console.log('Anzahl routes x.itdRouteList.itdRoute',x.itdRouteList.itdRoute.length);
             
                var j = 2;
                            
                var xx = x.itdRouteList.itdRoute[j].itdPartialRouteList.itdPartialRoute;

                var multiple_lines = Array.isArray(x.itdRouteList.itdRoute[j].itdPartialRouteList.itdPartialRoute);

                if (multiple_lines) {
                    //user has to switch
                    for (var i = 0; i < xx.length; i++) {
                        console.log(xx[i].itdStopSeq.itdPoint);
                        var tmp = xx[i].itdStopSeq.itdPoint;
                        console.log('means of transport', xx[i].itdMeansOfTransport);
                        var dest = xx[i].itdMeansOfTransport._destination;
                        var line = xx[i].itdMeansOfTransport._name;
                        var symb = xx[i].itdMeansOfTransport._symbol; 
                        $scope.departures.push({_name:'take ' + line + ' direction: ' + dest});
                        for (var j = 0; j < tmp.length; j++) {
                            var stop = tmp[j];
                            stop['symb'] = symb;
                            $scope.departures.push(tmp[j]);
                            console.log('station',tmp[j]);
                        }
                    }

                } else {
                    $scope.departures = x.itdRouteList.itdRoute[0].itdPartialRouteList.itdPartialRoute.itdStopSeq.itdPoint;
                }
                
                
                
                
                console.log('Departures', $scope.departures);
                 
                //   console.log("means of transport",x.itdRouteList.itdRoute[0].itdPartialRouteList.itdPartialRoute.itdMeansOfTransport);

                //   console.log("stop sequence",x.itdRouteList.itdRoute[0].itdPartialRouteList.itdPartialRoute.itdStopSeq.itdPoint);
                  
                  
                //   
                  
                //    console.log('number of part.routes',x.itdRouteList.itdRoute.length);       
                  
                //     console.log('PartialRoute', xx);


                //     $scope.routes = x.itdRouteList.itdRoute;

                //     console.log('routes', $scope.routes);

                //     console.log('check', $scope.departures);
            
            
                //    console.log("check structure",jsonObj.itdRequest.itdTripRequest.itdTripOptions); 
             
                $scope.apply;
            });
            // .error(function (data, status, headers, config) {
            // });

    }          
          
    
  
};


