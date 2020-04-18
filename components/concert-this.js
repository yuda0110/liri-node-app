const axios = require('axios');
const moment = require('moment');
const WriteLog = require('./write-log');
const Commands = require('./commands');
const AxiosError = require('./axios-error');

const writeLog = new WriteLog();
const commands = new Commands();
const axiosError = new AxiosError();

// node liri.js concert-this <artist/band name here>
module.exports = function() {
  let output = '';
  let log = `Command: ${commands.concert}\n`;

  this.findConcert = function(artistName) {
    if (!artistName) {
      output += 'Please enter an artist name that you\'d like to search events for.\n';
      log += output;
      console.log(output);
      writeLog.write(log);
      return;
    }

    const concertQueryURL = `https://rest.bandsintown.com/artists/${artistName}/events?app_id=codingbootcamp`;
    console.log(`concertQueryURL: ${concertQueryURL}`);

    const request = axios.get(concertQueryURL)
      .catch((error) => {
        axiosError.log(error, output, log);
      });

    // If the request with axios is successful
    request.then((res) => {
      const artistNameUppercase = artistName.toUpperCase();
      const eventData = res.data;

      if (eventData.length === 0) {
        output += `${artistNameUppercase} doesn't have any event scheduled at this moment.\n`;
        log += output;
        console.log(output);
        writeLog.write(log);
        return;
      }

      output += `---------------- ${artistNameUppercase}'s EVENTS INFO ----------------\n`;

      eventData.forEach((event) => {
        // Name of the venue
        output += `Name of the venue: ${event.venue.name}\n`;
        // Venue location
        output += `Venue location: ${event.venue.city}, ${event.venue.region}, ${event.venue.country}\n`;
        // Date of the Event (use moment to format this as "MM/DD/YYYY")
        output += `Date of the event: ${moment(event.datetime).format('MM/DD/YYYY')}\n`;
        output += '\n';
      });

      console.log(output);
      log += output;
      writeLog.write(log);
    });
  }
};