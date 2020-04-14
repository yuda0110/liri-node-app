require('dotenv').config();
const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');

// moment().format();

// ===== COMMANDS =====
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says


const command = process.argv[2];
const searchNameArr = process.argv.slice(3);

console.log(searchNameArr);

const nameWithPlus = searchNameArr.join('+');
const nameWithSpace = searchNameArr.join(' ');


// node liri.js concert-this <artist/band name here>
const concertThis = (artist) => {
  const concertQueryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
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
    console.log(`============= ${nameWithSpace.toUpperCase()}'s EVENTS INFO ===============\n`);

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
};


// node liri.js spotify-this-song '<song name here>'
const spotifyThis = (songName) => {
  const spotify = new Spotify(keys.spotify);

  // If no song is provided then your program will default to "The Sign" by Ace of Base.
  const songNameProvided = songName ? true : false;

  if (!songNameProvided) {
    songName = 'The Sign'
  }

  spotify
    .search({ type: 'track', query: songName })
    .then(function(response) {
      // console.log(response.tracks.items);
      const items = response.tracks.items;
      let itemsArr = [];

      if (songNameProvided) { // If a song name is provided
        itemsArr = items;
      } else {
        items.forEach((item) => {
          if (item.artists[0].name.toLowerCase() === 'ace of base') {
            itemsArr.push(item);
          }
        })
      }

      if (itemsArr.length <= 0) {
        console.log(`Sorry, no result found for ${songName}.`);
      } else {
        itemsArr.forEach((item) => {
          // Artist(s)
          console.log(`Artist(s): ${item.artists[0].name}`);
          // The song's name
          console.log(`The song's name: ${item.name}`);
          // A preview link of the song from Spotify
          console.log(`Preview link: ${item.preview_url}`);
          // The album that the song is from
          console.log(`The album: ${item.album.name}`);
          console.log('\n');
        });
      }
    })
    .catch(function(err) {
      console.log(err);
    });
};

switch (command) {
  case 'concert-this':
    concertThis(nameWithPlus);
    break;
  case 'spotify-this-song':
    spotifyThis(nameWithSpace);
    break;
}