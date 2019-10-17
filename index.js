'use strict';

const
    express = require('express'),
    bodyParser = require('body-parser'),
    log = require('npmlog'),
    q = require('q'),
    http = require('./node_modules/xmlhttprequest/lib/XMLHttpRequest'),
    fileStream = require('fs');

var app = express();
var host = 'localhost:';
var port = 10000;
var defer = q.defer();
var delegate = null;
    
var response = fileStream.readFileSync('./account.json');
    delegate = JSON.parse(response);
    defer.resolve(delegate[0]);
    log.info('delegate account information loaded');
    fileStream.closeSync(0);
    
    defer.promise.then(function (result){
        if (result !== null){
            log.info('initiating lisk forger');

            app.use(bodyParser.json());
            app.post('/api/forging/', function(req, res){
                res.setHeader('Access-Control-Allow-Origin', '*');
                log.info('API', '/api/forging');

                res.status(200).json({ result: setForging(req.body, result) });
            });

            app.listen(port, function(){
                log.info("forging api");
            });
        }
    });    

function setForging(server, accountInfo){

    var invalidDelegate = { "result": "invalid delegate info" };
    if (accountInfo.publicKey !== server.publicKey){
        log.info("Different account");

        return JSON.parse(invalidDelegate);
    }

    var forgingData = 
    {
        "publicKey": server.publicKey,
        "password": accountInfo.password,
        "forging": server.forging
    }

    var forgingRequest = new http.XMLHttpRequest();
    var url = "http://".concat(host).concat(server.port).concat("/api/node/status/forging");

    forgingRequest.onload = function(){
        console.log("forgingRequest.status: ".concat(forgingRequest.status));
        if (forgingRequest.status === 200){
            console.log("Forging changed");
            console.log(JSON.parse(forgingRequest.responseText).data);
        }
    }

    forgingRequest.open("PUT", url, false);
    forgingRequest.setRequestHeader("Cache-Control", "no-cache");
    forgingRequest.setRequestHeader("Content-Type", "application/json");
    forgingRequest.send(JSON.stringify(forgingData));

    return JSON.parse(forgingRequest.responseText).data;
}
