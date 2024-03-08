// All Globel Variable
let currentSong = new Audio();
let songs;
let currFolder;


// Function to convert Microseconds to Seconds ,
function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0 ){
        return "00:00";
    }
  const minutes = Math.floor(seconds/60)  ;
  const remainigSeconds = Math.floor
}