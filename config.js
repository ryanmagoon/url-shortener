let config = {};

config.db = {};
// the URL shortening host - shortened URLs will be this + base58 ID
// i.e: http://localhost:3000/3Ys
config.webhost = 'https://peaceful-caverns-62358.herokuapp.com/';

// your MongoDB host and database name
config.db.host = 'localhost';
config.db.name = 'url_shortener';

module.exports = config;