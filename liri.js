require('dotenv').config();
const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const fs = require('fs');


// ===== COMMANDS =====
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says


const command = process.argv[2];
const searchedNameArr = process.argv.slice(3);

console.log(searchedNameArr);

const wordsWithPlus = (arr) => arr.join('+');
const wordsWithSpace = (arr) => arr.join(' ');


// node liri.js concert-this <artist/band name here>
const concertThis = artistName => {
  if (!artistName) {
    console.log('Please enter an artist name that you\'d like to search events for.');
    return;
  }

  const concertQueryURL = `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp`;
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
    const artistNameUppercase = artistName.toUpperCase();
    const eventData = res.data;

    if (eventData.length === 0) {
      console.log(`${artistNameUppercase} doesn't have any event scheduled at this moment.`)
      return;
    }

    console.log(`============= ${artistNameUppercase}'s EVENTS INFO ===============\n`);

    eventData.forEach((event) => {
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
const spotifyThis = songName => {
  const spotify = new Spotify(keys.spotify);

  // If no song is provided then your program will default to "The Sign" by Ace of Base.
  const songNameProvided = songName ? true : false;

  if (!songNameProvided) {
    songName = 'The Sign';
    console.log('You didn\'t enter a song name. Here is a song for you.');
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


// node liri.js movie-this '<movie name here>'
const movieThis = movieTitle => {
  // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody'.
  const movieTitleProvided = movieTitle ? true : false;

  if (!movieTitleProvided) {
    movieTitle = 'Mr. Nobody';
    console.log('You didn\'t enter a movie title. Here is a movie for you.');
  }

  const omdbQueryURL = `http://www.omdbapi.com/?t=${movieTitle}&y=&plot=short&apikey=trilogy`;
  console.log(`omdbQueryURL: ${omdbQueryURL}`);

  const request = axios.get(omdbQueryURL)
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
    console.log(`============= ${movieTitle.toUpperCase()}'s INFO ===============\n`);

    const movieData = res.data;

    if (!movieData.Title) {
      console.log('Sorry, the movie you typed in doesn\'t exist in the database.');
      return;
    }

    // Title of the movie.
    console.log(`Title: ${movieData.Title}`);

    // Year the movie came out.
    console.log(`Year: ${movieData.Year}`);

    let imdbRating = '';
    let rottenTomatoesRating = '';
    movieData.Ratings.forEach(item => {
      if (item.Source.toLowerCase() === 'Internet Movie Database'.toLowerCase()) {
        imdbRating = item.Value;
      } else if (item.Source.toLowerCase() === 'Rotten Tomatoes'.toLowerCase()) {
        rottenTomatoesRating = item.Value;
      }
    });
    // IMDB Rating of the movie.
    console.log(`IMDB Rating: ${imdbRating}`);

    // Rotten Tomatoes Rating of the movie.
    console.log(`Rotten Tomatoes Rating: ${rottenTomatoesRating}`);

    // Country where the movie was produced.
    console.log(`Country: ${movieData.Country}`);

    // Language of the movie.
    console.log(`Language: ${movieData.Language}`);

    // Plot of the movie.
    console.log(`Plot: ${movieData.Plot}`);

    // Actors in the movie.
    console.log(`Actors: ${movieData.Actors}`);
  });
};


// node liri.js do-what-it-says
const doWhatItSays = () => {
  fs.readFile('random.txt', 'utf8', (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    const dataArr = data.split(', ');
    dataArr.forEach(function (item) {
      console.log(item);
    })

    executeCommand(dataArr[0], dataArr[1]);

  });
}

function executeCommand(command, searchedTerm) {
  searchedTerm = Array.isArray(searchedTerm) ? wordsWithSpace(searchedTerm) : searchedTerm;
  switch (command) {
    case 'concert-this':
      concertThis(searchedTerm);
      break;
    case 'spotify-this-song':
      spotifyThis(searchedTerm);
      break;
    case 'movie-this':
      movieThis(searchedTerm);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('The command you entered doesn\'t exit.');
  }
}

executeCommand(command, searchedNameArr);
