require('dotenv').config();
const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');

// moment().format();

// ===== COMMANDS =====
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says


// example
// const spotify = new Spotify(keys.spotify);

const command = process.argv[2];
const searchNameArr = process.argv.slice(3);

console.log(searchNameArr);

const searchName = searchNameArr.join('+');
const displayName = searchNameArr.join(' ');

// node liri.js concert-this <artist/band name here>
const concertQueryURL = `https://rest.bandsintown.com/artists/${searchName}/events?app_id=codingbootcamp`;
console.log(`concertQueryURL: ${concertQueryURL}`);

const request = axios.get(concertQueryURL)
  .catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Headers---------------");
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });

// If the request with axios is successful
// request.then(console.log);

request.then((res) => {
  console.log(`============= ${displayName.toUpperCase()}'s EVENTS INFO ===============\n`);

  res.data.forEach((event) => {
    // Name of the venue
    console.log(`Name of the venue: ${event.venue.name}`);
    // Venue location
    console.log(`Venue location: ${event.venue.city}, ${event.venue.region}, ${event.venue.country}`);
    // Date of the Event (use moment to format this as "MM/DD/YYYY")
    console.log(`Date of the event: ${moment(event.datetime).format('MM/DD/YYYY')}`);
    console.log('\n');
  })

});