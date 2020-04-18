const fs = require('fs');
const ConcertThis = require('./components/concert-this');
const SpotifyThis = require('./components/spotify-this');
const MovieThis = require('./components/movie-this');
const WriteLog = require('./components/write-log');

const concertThis = new ConcertThis();
const spotifyThis = new SpotifyThis();
const movieThis = new MovieThis();
const writeLog = new WriteLog();

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

const wordsWithSpace = (arr) => arr.join(' ');

// node liri.js do-what-it-says
const doWhatItSays = () => {
  let log = `Command: ${commands.do}\n`;
  writeLog.write(log);

  fs.readFile('random.txt', 'utf8', (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    const dataArr = data.split(', ');

    executeCommand(dataArr[0], dataArr[1]);
  });
};

function executeCommand(command, searchedTerm) {
  searchedTerm = Array.isArray(searchedTerm) ? wordsWithSpace(searchedTerm) : searchedTerm;
  switch (command) {
    case commands.concert:
      concertThis.findConcert(searchedTerm);
      break;
    case commands.spotify:
      spotifyThis.findSong(searchedTerm);
      break;
    case commands.movie:
      movieThis.findMovie(searchedTerm);
      break;
    case commands.do:
      doWhatItSays();
      break;
    default:
      console.log('The command you entered doesn\'t exit.');
  }
}

executeCommand(command, searchedNameArr);
