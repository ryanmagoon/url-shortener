'use strict';

let express = require('express');
let path = require('path');
let mongo = require('mongodb').MongoClient;
let app = express();

let alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
let base = alphabet.length; // base is the length of the alphabet (58 in this case)


app.get('/', function (req, res) {
    // route to serve up the homepage
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/new/:url', function (req, res) {
    // route to create and return a shortened URL given a long URL
    let theURL = req.params.url;
    let result = {};
    result.original_url = theURL;
    result.short_url = 'asdf';
    res.send(result);
});

app.get('/:encoded_id', function (req, res) {
    // route to redirect the visitor to their original URL given the short URL

});


app.listen(process.env.PORT || 3000, function () {
    console.log('app started!');
});

// utility function to convert base 10 integer to base 58 string
function encode(num) {
    let encoded = '';
    while (num) {
        let remainder = num % base;
        num = Math.floor(num / base);
        encoded = alphabet[remainder].toString() + encoded;
    }
    return encoded;
}

// utility function to convert a base 58 string to base 10 integer
function decode(str) {
    let decoded = 0;
    while (str) {
        let index = alphabet.indexOf(str[0]);
        let power = str.length - 1;
        decoded += index * (Math.pow(base, power));
        str = str.substring(1);
    }
    return decoded;
}