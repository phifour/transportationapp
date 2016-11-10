app.controller('MainCtrl', ['$scope', '$http', '$q' , MainCtrl])

function MainCtrl($scope, $http, $q) {

    $scope.departures = [];
    $scope.trainlist = [];
    $scope.stations = [];
    $scope.startime = '';
    $scope.endtime = '';
    
    $scope.youareoffline = false;

    $http.get("json/stations.json").then(function (response) {
        return response.data.stations;
    }).then(function (stations) {
        $scope.stations = stations;
    })

    $scope.switcher = function(x){
        if (x==true){
            return 'Hide';
        }else{
            return 'Show';
        }
    }


    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return i;
            }
        }
        return null;
    }

    $scope.names = undefined;

    $scope.showresult = false;

    $scope.routes = [];

    $scope.itdItinerary = {};

    function formatnumber(x) {
        x = '' + x;
        if (x.length > 1) {
            return x;
        } else {
            return '0' + x;
        }
    }

    $scope.formatnumber = formatnumber;

    $scope.checkequal = function (a, b) {
        if (a == b) {
            return true;
        } else {
            return false;
        }
    }

    $scope.request = function (journey) {

        if (journey.startpoint.id != journey.endpoint.id) {
            $scope.youareoffline = false;
                                                                       
            var address = 'http://localhost:3000/api/reqroute/'+journey.startpoint.id+'/'+ journey.endpoint.id;                       
                                    
                $http.get(address).then(function (data, status, headers, config) {
                    
                $scope.trainlist = [];

                var x2js = new X2JS();
                
                var jsonObj = x2js.xml_str2json(data.data.body);

                $scope.itdItinerary = jsonObj.itdRequest.itdTripRequest.itdItinerary;

                var x = jsonObj.itdRequest.itdTripRequest.itdItinerary;

                $scope.showresult = true;

                // var j = 2;
                
                // for (var i = 0;i<x.itdRouteList.itdRoute.length;i++){
                //     var start1 = x.itdRouteList.itdRoute[i].itdPartialRouteList.itdPartialRoute.itdPoint[0].itdDateTime.itdTime._hour;
                //     var start2 = x.itdRouteList.itdRoute[i].itdPartialRouteList.itdPartialRoute.itdPoint[0].itdDateTime.itdTime._minute;
                //     var end1 = x.itdRouteList.itdRoute[i].itdPartialRouteList.itdPartialRoute.itdPoint[1].itdDateTime.itdTime._hour;
                //     var end2 = x.itdRouteList.itdRoute[i].itdPartialRouteList.itdPartialRoute.itdPoint[1].itdDateTime.itdTime._minute;
                //     var train = {start:start1+':'+start2, end:end1+':'+end2};
                //     $scope.trainlist.push(train);             
                // }
                
                console.log('trainlist', $scope.trainlist);                                

                console.log('data', data);
                console.log('jsonObj', jsonObj);
                console.log('data', jsonObj);
                console.log("init structure", x.itdRouteList.itdRoute[0].itdPartialRouteList.itdPartialRoute);
                console.log('Routes', x.itdRouteList.itdRoute.length);                
                console.log('number of trains',x.itdRouteList.itdRoute.length)

                for (var j = 0;j<x.itdRouteList.itdRoute.length;j++){
                
                var start1 = x.itdRouteList.itdRoute[j].itdPartialRouteList.itdPartialRoute.itdPoint[0].itdDateTime.itdTime._hour;
                var start2 = x.itdRouteList.itdRoute[j].itdPartialRouteList.itdPartialRoute.itdPoint[0].itdDateTime.itdTime._minute;

                var end1 = x.itdRouteList.itdRoute[j].itdPartialRouteList.itdPartialRoute.itdPoint[1].itdDateTime.itdTime._hour;
                var end2 = x.itdRouteList.itdRoute[j].itdPartialRouteList.itdPartialRoute.itdPoint[1].itdDateTime.itdTime._minute;

                var trainplan = {start:formatnumber(start1) + ':' + formatnumber(start2),
                    end:formatnumber(end1) + ':' + formatnumber(end2)
                   ,departures:[]};

                // $scope.routes = jsonObj.itdRequest.itdTripRequest.itdItinerary.itdRouteList.itdRoute;

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
                        $scope.departures.push({ _name: 'take ' + line + ' direction: ' + dest });
                        for (var j = 0; j < tmp.length; j++) {
                            var stop = tmp[j];
                            stop['symb'] = symb;
                            $scope.departures.push(tmp[j]);
                            console.log('station', tmp[j]);
                        }
                    }

                } else {
                    var tmp_departures = x.itdRouteList.itdRoute[j].itdPartialRouteList.itdPartialRoute.itdStopSeq.itdPoint;
                    // console.log('tmp_departures', tmp_departures);
                    var departures = [];
                    for (var i = 0; i < tmp_departures.length; i++) {
                        if (i == 0 || i == tmp_departures.length - 1) {
                            var dttime = tmp_departures[i].itdDateTime[1];
                            var tmp = tmp_departures[i];
                            if (i == 0) tmp['itdDateTime'] = dttime;
                            if (i == tmp_departures.length - 1) { tmp['itdDateTime'] = x.itdRouteList.itdRoute[j].itdPartialRouteList.itdPartialRoute.itdPoint[1].itdDateTime; }

                            departures.push(tmp);
                        } else {
                            departures.push(tmp_departures[i]);
                        }
                    }
                    trainplan.departures = departures;
                }
                

                $scope.trainlist.push(trainplan);             
                }//loop over all trains
                
                $scope.apply;
            }).catch(function (e) {
                console.log('Error no internet', e); // "oh, no!"                                        
                $scope.youareoffline = true;
                var currentDate = new Date();
                var minute = currentDate.getMinutes();
                var hour = currentDate.getHours();

                $scope.starttime = undefined;
                $scope.endtime = undefined;
                
                
                var indexa = objectFindByKey($scope.stations, 'id', journey.startpoint.id);
                var indexb = objectFindByKey($scope.stations, 'id', journey.endpoint.id);

                if (indexa < indexb) {
                    $scope.departures = $scope.stations.slice(indexa, indexb + 1);
                } else {
                    $scope.departures = $scope.stations.slice(indexb, indexa + 1).reverse();
                    console.log($scope.departures, indexa, indexb);
                }

                for (var i = 0; i < $scope.departures.length; i++) {
                    if (minute + 2 >= 60) {
                        minute = minute - 60;
                        hour = hour + 1;
                    } else {
                        minute = minute + 2;
                    }
                    
                    if(i==0){
                        $scope.starttime = formatnumber(hour)+':'+formatnumber(minute);
                    }
                    
                    if (i==$scope.departures.length-1){
                       $scope.endtime = formatnumber(hour)+':'+formatnumber(minute);
                    }
                    
                    $scope.departures[i] = { _name: $scope.departures[i].name, 'itdDateTime': { 'itdTime': { _hour: hour, _minute: minute } } };
                }
                
                $scope.apply;

            });

        }

    }
};
