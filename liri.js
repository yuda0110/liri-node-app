require('dotenv').config();
const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const fs = require('fs');

const SpotifyThis = require('./components/spotify-this');
const spotifyThis = new SpotifyThis();


// ===== COMMANDS =====
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says


const command = process.argv[2];
const searchedNameArr = process.argv.slice(3);

const commands = {
  concert: 'concert-this',
  spotify: 'spotify-this-song',
  movie: 'movie-this',
  do: 'do-what-it-says'
};

console.log(searchedNameArr);

const wordsWithPlus = (arr) => arr.join('+');
const wordsWithSpace = (arr) => arr.join(' ');

const axiosErrorHandling = (error, output, log) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    output += "---------------Data---------------\n";
    output += `${JSON.stringify(error.response.data, null, 2)}\n`;
    output += "---------------Status---------------\n";
    output += `${error.response.status}\n`;
    output += "---------------Headers---------------\n";
    output += `${JSON.stringify(error.response.headers, null, 2)}\n`;
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an object that comes back with details pertaining to the error that occurred.
    output += `${JSON.stringify(error.request, null, 2)}\n`;
  } else {
    // Something happened in setting up the request that triggered an Error
    output += `Error: ${error.message}\n`;
  }
  output += `${JSON.stringify(error.config, null, 2)}\n`;
  console.log(output);
  log += output;
  writeLog(log);
};

/*
const writeLog = (log) => {
  fs.appendFile('./log.txt', `${log}\n`, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('Log added!');
  });
};
*/

// node liri.js concert-this <artist/band name here>
const concertThis = artistName => {
  let output = '';
  let log = `Command: ${commands.concert}\n`;

  if (!artistName) {
    output += 'Please enter an artist name that you\'d like to search events for.\n';
    log += output;
    console.log(output);
    writeLog(log);
    return;
  }

  const concertQueryURL = `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp`;
  console.log(`concertQueryURL: ${concertQueryURL}`);

  const request = axios.get(concertQueryURL)
    .catch((error) => {
      axiosErrorHandling(error, output, log);
    });

  // If the request with axios is successful
  request.then((res) => {
    const artistNameUppercase = artistName.toUpperCase();
    const eventData = res.data;

    if (eventData.length === 0) {
      output += `${artistNameUppercase} doesn't have any event scheduled at this moment.\n`;
      log += output;
      console.log(output);
      writeLog(log);
      return;
    }

    output += `============= ${artistNameUppercase}'s EVENTS INFO ===============\n`;

    eventData.forEach((event) => {
      // Name of the venue
      output += `Name of the venue: ${event.venue.name}\n`;
      // Venue location
      output += `Venue location: ${event.venue.city}, ${event.venue.region}, ${event.venue.country}\n`;
      // Date of the Event (use moment to format this as "MM/DD/YYYY")
      output += `Date of the event: ${moment(event.datetime).format('MM/DD/YYYY')}\n`;
      output += '\n';
    })

    console.log(output);
    log += output;
    writeLog(log);
  });
};

/*
// node liri.js spotify-this-song '<song name here>'
const spotifyThis = songName => {
  let output = '';
  let log = `Command: ${commands.spotify}\n`;

  const spotify = new Spotify(keys.spotify);

  // If no song is provided then your program will default to "The Sign" by Ace of Base.
  const songNameProvided = songName ? true : false;

  if (!songNameProvided) {
    songName = 'The Sign';
    output += 'You didn\'t enter a song name. Here is a song for you.\n';
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
        output += `Sorry, no result found for ${songName}.\n`;
      } else {
        itemsArr.forEach((item) => {
          // Artist(s)
          output += `Artist(s): ${item.artists[0].name}\n`;
          // The song's name
          output += `The song's name: ${item.name}\n`;
          // A preview link of the song from Spotify
          output += `Preview link: ${item.preview_url}\n`;
          // The album that the song is from
          output += `The album: ${item.album.name}\n`;
          output += '\n';
        });
      }
      console.log(output);
      log += output;
      writeLog(log);
    })
    .catch(function(err) {
      output += `${JSON.stringify(err, null, 2)}\n\n`;
      console.log(output);
      log += output;
      writeLog(log);
    });
};
*/

// node liri.js movie-this '<movie name here>'
const movieThis = movieTitle => {
  let output = '';
  let log = `Command: ${commands.movie}\n`;

  // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody'.
  const movieTitleProvided = movieTitle ? true : false;

  if (!movieTitleProvided) {
    movieTitle = 'Mr. Nobody';
    output += 'You didn\'t enter a movie title. Here is a movie for you.\n';
  }

  const omdbQueryURL = `http://www.omdbapi.com/?t=${movieTitle}&y=&plot=short&apikey=trilogy`;
  console.log(`omdbQueryURL: ${omdbQueryURL}`);

  const request = axios.get(omdbQueryURL)
    .catch((error) => {
      axiosErrorHandling(error, output, log);
    });

  // If the request with axios is successful
  // request.then(console.log);

  request.then((res) => {
    output += `============= ${movieTitle.toUpperCase()}'s INFO ===============\n`;

    const movieData = res.data;

    if (!movieData.Title) {
      output += 'Sorry, the movie you typed in doesn\'t exist in the database.';
      log += output;
      console.log(output);
      writeLog(log)
      return;
    }

    // Title of the movie.
    output += `Title: ${movieData.Title}\n`;

    // Year the movie came out.
    output += `Year: ${movieData.Year}\n`;

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
    output += `IMDB Rating: ${imdbRating}\n`;

    // Rotten Tomatoes Rating of the movie.
    output += `Rotten Tomatoes Rating: ${rottenTomatoesRating}\n`;

    // Country where the movie was produced.
    output += `Country: ${movieData.Country}\n`;

    // Language of the movie.
    output += `Language: ${movieData.Language}\n`;

    // Plot of the movie.
    output += `Plot: ${movieData.Plot}\n`;

    // Actors in the movie.
    output += `Actors: ${movieData.Actors}\n`;

    console.log(output);

    log += output;

    writeLog(log);
  });
};

// node liri.js do-what-it-says
const doWhatItSays = () => {
  let log = `Command: ${commands.do}\n`;
  writeLog(log);

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
};

function executeCommand(command, searchedTerm) {
  searchedTerm = Array.isArray(searchedTerm) ? wordsWithSpace(searchedTerm) : searchedTerm;
  switch (command) {
    case commands.concert:
      concertThis(searchedTerm);
      break;
    case commands.spotify:
      spotifyThis.findSong(searchedTerm);
      break;
    case commands.movie:
      movieThis(searchedTerm);
      break;
    case commands.do:
      doWhatItSays();
      break;
    default:
      console.log('The command you entered doesn\'t exit.');
  }
}

executeCommand(command, searchedNameArr);
