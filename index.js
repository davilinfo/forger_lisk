'use strict';
    
const
    express = require('express'),
    bodyParser = require('body-parser'),
    log = require('npmlog'),
    http = require('./node_modules/xmlhttprequest/lib/XMLHttpRequest');

 var app = express();
 var   host = 'localhost';
 var   port = 10000;

    app.use(bodyParser.json());

    app.post('/api/forging/', function(req, res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        log.info('API', '/api/forging');

        return setForging(req.body);
    });

    app.listen(port, function(){
        log.info("forging api");
    });

function setForging(server){

    var forgingData = 
    {
        "publicKey": server.publicKey,
        "password": server.password,
        "forging": server.forging
    }

    var forgingRequest = new http.XMLHttpRequest();
    var url = "http://localhost:".concat(server.port).concat("/api/node/status/forging");

    forgingRequest.onload = function(){
        console.log("forgingRequest.status: ".concat(forgingRequest.status));
        if (forgingRequest.status === 200){
            console.log("Forging changed");
            console.log(JSON.parse(forgingRequest.responseText).data);
            return forgingRequest.responseText;
        }
    }

    forgingRequest.open("PUT", url);
    forgingRequest.setRequestHeader("Cache-Control", "no-cache");
    forgingRequest.setRequestHeader("Content-Type", "application/json");
    forgingRequest.send(JSON.stringify(forgingData));
}

