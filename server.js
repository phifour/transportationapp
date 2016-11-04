// 'use strict';

// simple express server
var express = require('express');
var app = express();

var http = require('http');
// var router = express.Router();
var request = require("request");
// app.use(express.static('dist'));
var router = express.Router();              // get an instance of the express Router
var rp = require('request-promise');


// // app.set('port', (process.env.PORT || port));
// app.get('/', function(req, res) {
//     res.sendfile('./dist/index.html');
// });

var port = 3000;

app.set('port', (process.env.PORT || port));

// app.use(cors({origin: 'http://localhost:'+port}));
// app.use(cors({origin: 'http://www.wienerlinien.at'}));

app.use(express.static(__dirname + '/dist'));

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

router.get('/reqroute/:id1/:id2', function (req, res, next) {
    var id1 = req.params.id1;
    var id2 = req.params.id2;
    console.log(id1,id2);
    //additional paramters
    var em = 'excludedMeans=';
    var exclude_means = em+'1'+'&'+em+'3'+'&'+em+'4'+'&'+em+'5'+'&'+em+'6'+'&'+em+'7'+'&'+em+'8'+'&'+em+'9'+'&'+em+'10'+'&'+em+'11'+'&';
    console.log(exclude_means);
    
    var address = 'http://www.wienerlinien.at/ogd_routing/XML_TRIP_REQUEST2?locationServerActive=1&'+exclude_means+'type_origin=any&name_origin='+id1+'&type_destination=any&name_destination='+id2;
    
    // rp(address).catch(function (result) {
    //      res.send(result);
    //       console.log(result);});
        
    request.get(address, function (error, response, body) {
        if (error) {
            // console.log(error);
            res.send(error);
            // next();
        } else {
            // console.log(response);
            res.send(response);
            // next();
        }
    });
    // res.send(req.params.dummy);
    // next();
});

app.use('/api', router);

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
