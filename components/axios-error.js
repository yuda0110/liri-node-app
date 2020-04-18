const WriteLog = require('./write-log');

const writeLog = new WriteLog();

module.exports = function() {
  this.log = function(error, output, log) {
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
    writeLog.write(log);
    // process.exit();
  }
};