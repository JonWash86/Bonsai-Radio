// this function is a last.fm api test to see if I can try and grab the scrobbles for a song based on the username.

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
  yesterday.setSeconds(59, 999);
  return(yesterday / 1000|0);
};


// there are 604800 seconds in a week ...
function getLastWeek(){
  return(getYesterday() - 604800);
};

function getTwoWeeks(){
  return(getYesterday() - 1209600);
}

// ...and 2419200 seconds in 28 days (exactly four weeks)
function getFourWeeks(){
  return(getYesterday() - 2419200);
};

// Now, this function grabs the last 183 days, just .5 days over the length of half a year.
function getSixMonths(){
  return(getYesterday() - 15811200);
}

// per https://makitweb.com/convert-unix-timestamp-to-date-time-with-javascript/
function convertUnixToText(unixStamp){
var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var date = new Date(unixStamp * 1000);
var year = date.getFullYear();
var month = months_arr[date.getMonth()];
var day = date.getDate();
var hours = date.getHours();
var minutes = "0" + date.getMinutes();
return(month + ' ' + day + ', at ' + hours + ':' + minutes.substr(-2))
}

// this function checks the last.fm id field and retrieves the most recently played tracks for that user. It then passes the length of the ensuing list to the getFullHistory function to loop over the pages of results.
function getTrackForUser(previousDate, todayDate) {
  //TODO: Rename this function to be more descriptive of what it does
  var userLastId = localStorage.getItem("userLastId");
  console.log(userLastId);
  $.ajax({
    type:'POST',
    url: 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&api_key=100a45f60fce336c43b1dac55062e23a&username=' + userLastId + '&from='+ previousDate +'&to='+ todayDate +'&page?&format=json',
    success: function(response) {
      console.log(response.recenttracks)
      var requestLength = response.recenttracks["@attr"].totalPages;
      console.log(response.recenttracks["@attr"].total);
      getFullHistory(requestLength, previousDate, todayDate);
    },
    error: function(code, message){
      console.log('it didn\'t work!');
    }
  });
}

var allCallSongs = [];


function getFullHistory(requestLength, previousDate, todayDate) {
  var userLastId = $("#lastId").val();
  var completed = 0;
  // if (localStorage.getItem("playHistory") !== null){
  //   var allCallSongs = JSON.parse(localStorage.getItem("playHistory"));
  // }
  console.log(requestLength);
  for (i = 1; i <= requestLength; i ++){
    console.log('making call number ' + i +' of '+ requestLength )

    $.ajax({
      type:'POST',
      url: 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&api_key=100a45f60fce336c43b1dac55062e23a&username=' + userLastId + '&from='+ previousDate +'&to='+ todayDate +'&page='+ i +'&format=json',
      success: function(response) {
        for (i = 0; i <= (response.recenttracks.track.length - 1); i ++){
          allCallSongs.push(response.recenttracks.track[i]);
        }
      },
      error: function(code, message){
        console.log('it didn\'t work!');
      }
    });
    // This function was meant to save the user's plays to local storage once all ajax calls were done. It appears that this maybe is still firing?
    // $(document).ajaxStop(function (){
    //   completed++;
    //   console.log(completed + " have been completed of " + requestLength);
    //   if (completed == requestLength){
    //     console.log('the requests are done and we are saving to storage')
    //     saveSongsToStorage(allCallSongs);
    //   }
    // })
  }
  console.log(allCallSongs);
  return(allCallSongs);
}

function saveSongsToStorage(allCallSongs){
  localStorage.setItem("playHistory", JSON.stringify(allCallSongs));
}

// the following function checks the user's local storage for an existing play history. If there is none, it will grab the default six months. If a play history does exist, it will then compare the last pull date and fill the gap. If there's no gap, it will do nothing.

// 1/28/19 - for the moment, local storage functionality is on ice; we'll work on persistent accounts/data on a future build.

// function checkForExistingHistory(){
//   if (localStorage.getItem("playHistory") === null){
//     getTrackForUser(getLastWeek(), getYesterday());
//     localStorage.setItem("lastPullDate", getYesterday());
//     console.log('new date saved');
//   }
//   else if (localStorage.getItem("playHistory") !== null && localStorage.getItem("lastPullDate") !== getYesterday()){
//     console.log("It worked! My login function now checks for the user's last pull date and knows it is not up to date.")
//     // TODO: this else if will then pull the data for yesterday until lastPullDate. From there, it will have to iterate over the existing data and append the new data to it, then re-save that to locaal storage.
//     var pastPlayDate = parseInt(localStorage.getItem("lastPullDate"));
//     console.log(pastPlayDate);
//     // var allCallSongs = JSON.parse(localStorage.getItem("playHistory"));
//     console.log(allCallSongs);
//     console.log((pastPlayDate + 1));
//     getTrackForUser((pastPlayDate + 1), getYesterday());
//     console.log(allCallSongs);
//   }
//   else {
//     console.log("the history is currently up to date!")
//   }
// }
