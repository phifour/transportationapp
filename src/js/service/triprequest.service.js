app.service('TripRequestService', ['$http', TripRequestService]);

function TripRequestService($http) {
    var api_key = 'XwCTb7o9iV';
    this.locationservice = function (location) {

        var promise = $http({
            method: 'GET',
            timeout: 5000000,
            url: 'http://www.wienerlinien.at/ogd_routing/XML_STOPFINDER_REQUEST?locationServerActive=1&outputFormat=JSON&type_sf=any&name_sf=' + location,
            // params: {
            //     sender: api_key
            // },
            locationServerActive: 1,
            contentType: 'application/x-www-form-urlencoded'
        });//; charset=utf-8

        return promise;
    }

    this.requestjourney = function (id1, id2) {
        
        var promise = $http({
            method: 'GET',
            timeout: 5000000,
            // url: "http://www.wienerlinien.at/ogd_routing/XML_TRIP_REQUEST2?locationServerActive=1&outputFormat=JSON&type_origin=any&name_origin=Reumannplatz&type_destination=any&name_destination=Stephansplatz", 
            url: "http://www.wienerlinien.at/ogd_routing/XML_TRIP_REQUEST2?locationServerActive=1&type_origin=any&name_origin=" + id1 + "&type_destination=any&name_destination=" + id2,
            params: {
                sender: api_key
            },
            
            
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },

            
            // headers: {
            //     'My-Header': 'value'
            // },  
            locationServerActive: 1,
            excludedMeans: 0,
            excludedMeans: 1,
            excludedMeans: 3,
            excludedMeans: 4,
            excludedMeans: 5,
            excludedMeans: 6,
            excludedMeans: 7,
            excludedMeans: 8,
            excludedMeans: 9,
            excludedMeans: 10,
            excludedMeans: 11,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8'
        });

        return promise;
    }
};          
