let express = require('express');
let app = express();
let path = require('path');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let config = require('./config.js');
let base58 = require('./base58.js');

// grab the url model
let Url = require('./models/url.js');

// get the mongo connection string
let mongoCreds = process.env.MONGODB_URI || ('mongodb://' + config.db.host + '/' + config.db.name);

// create a conntection to our MongoDB
mongoose.connect(mongoCreds);

// handles JSON bodies
app.use(bodyParser.json());
// handles URL encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// // tell Express to serve files from our public folder
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    // route to serve up the homepage
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/new/*', function (req, res) {
    let longUrl = req.params[0];
    let shortUrl = ''; // the shortened URL we'll return

    console.log('posted url: ' + longUrl);
    if (longUrl.search(/http:\/\/www\.[\w]+\.com/) === -1) {
        throw Error('incompatible url format!');
    }

    // check if url already exists in database
    Url.findOne({ long_url: longUrl }, function (err, doc) {
        if (doc) {
            // base58 encode the unique _id of that document and construct the short URL
            shortUrl = config.webhost + base58.encode(doc._id);

            // since the document exists, we return it without creating a new entry
            res.send({ 'shortUrl': shortUrl });
        } else {
            // The long URL was not fount in the long_url field in our urls
            // collection, so we need to create a new entry:
            let newUrl = Url({
                long_url: longUrl
            });

            // save the new link
            newUrl.save(function (err) {
                if (err) {
                    console.log(err);
                }

                // construct the short URL
                shortUrl = config.webhost + base58.encode(newUrl._id);

                res.send({ 'shortUrl': shortUrl });
            });
        }
    });
});

app.get('/:encoded_id', function (req, res) {
    console.log('encoded id: ' + req.params.encoded_id);
    let base58Id = req.params.encoded_id;
    let id = base58.decode(base58Id);

    // check if url already exists in database
    Url.findOne({ _id: id }, function (err, doc) {
        console.log(doc);
        if (doc) {
            console.log("document found!");
            // found an entry in the DB, redirect the user to their destination
            res.redirect(doc.long_url);
        } else {
            // nothing found, go home
            res.redirect(config.webhost);
        }
    });
});

let server = app.listen(process.env.PORT || 3000, function () {
    console.log('Server listening on port ' + (process.env.PORT || 3000));
});
