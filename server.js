'use strict';

let express = require('express');
let path = require('path');
let mongo = require('mongodb').MongoClient;

let app = express();

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/new/:url', function(req, res) {
    let theURL = req.params.url;
    let result = {};
    result.original_url = theURL;
    result.short_url = 'asdf';
    res.send(result);
});

app.listen(process.env.PORT || 3000, function() {
    console.log('app started!');
});