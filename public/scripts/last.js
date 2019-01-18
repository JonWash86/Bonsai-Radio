// this function is a last.fm api test to see if I can try and grab the scrobbles for a song based on

function getLastTracks() {
  $.ajax({
    type:'POST',
    url: 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=100a45f60fce336c43b1dac55062e23a&artist=Tennis&track=My+Emotions+Are+Blinding&username=chikinguy&format=json',
    success: function(response) {
      console.log(response);
    },
    error: function(code, message){
      console.log('it didn\'t work!');
    }
  });
}

function getLastPlayed() {
  $.ajax({
    type:'POST',
    url: 'http://ws.audioscrobbler.com/2.0/?method=user.getWeeklyTrackChart&api_key=100a45f60fce336c43b1dac55062e23a&artist=Tennis&username=chikinguy&format=json',
    success: function(response) {
      console.log(response);
    },
    error: function(code, message){
      console.log('it didn\'t work!');
    }
  });
}

// the following code is meant to grab today's date, then slot in the day before it and convert that day @11:59 UTC to a UNIX timestamp
function getYesterday(){
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(11,59);
  return(yesterday / 1000|0);
};

// there are 604800 seconds in a week and 2419200 seconds in 28 days (exactly four weeks)
function getLastWeek(){
  return(getYesterday() - 604800);
}

function getFourWeeks(){
  return(getYesterday() - 2419200);
}

var oneWeek = yesterday.setDate(yesterday.getDate() - 7);

var itsBeenOneWeek = (oneWeek / 1000|0);
// var itsBeenOneWeek = ((d - 7)/ 1000|0);
var unixYesterD = (yesterday / 1000|0);


//yesterDd is the number of today's date.
var today = new Date();
var yesterDd = (today.getDate() - 1);

// this function check the last.fm id field and retrieves the most recently played tracks for that user.
function getTrackForUser() {
  var userLastId = $("#lastId").val();
  console.log(userLastId);
  $.ajax({
    type:'POST',
    url: 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&api_key=100a45f60fce336c43b1dac55062e23a&username=' + userLastId + '&from=1546992000&to=1547611107&format=json',
    success: function(response) {
      console.log(response);
    },
    error: function(code, message){
      console.log('it didn\'t work!');
    }
  });
}