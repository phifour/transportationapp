app.service('TripRequestService', ['$http',TripRequestService]);

function TripRequestService($http) {
    var api_key = 'XwCTb7o9iV';
    
    this.locationservice = function(location){
     
        var promise = $http({
            method: 'GET',
            timeout: 5000000,
            url: 'http://www.wienerlinien.at/ogd_routing/XML_STOPFINDER_REQUEST?locationServerActive=1&outputFormat=JSON&type_sf=any&name_sf='+location,
            params: {
                sender: api_key
            },
            locationServerActive:1,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8'
        });
        
        return promise;  
    }
    
    
    
}


