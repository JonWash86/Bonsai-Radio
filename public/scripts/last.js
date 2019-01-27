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


// there are 604800 seconds in a week ...
function getLastWeek(){
  return(getYesterday() - 604800);
};

// ...and 2419200 seconds in 28 days (exactly four weeks)
function getFourWeeks(){
  return(getYesterday() - 2419200);
};

// Now, this function grabs the last 183 days, just .5 days over the length of half a year.
function getSixMonths(){
  return(getYesterday() - 15811200);
}

// this function check the last.fm id field and retrieves the most recently played tracks for that user. It then passes the length of the ensuing list to the getFullWeek function to loop over the pages of results.
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
  console.log(requestLength);
  for (i = 1; i <= requestLength; i ++){
    $.ajax({
      type:'POST',
      url: 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&api_key=100a45f60fce336c43b1dac55062e23a&username=' + userLastId + '&from='+ previousDate +'&to='+ todayDate +'&page='+ i +'&format=json',
      success: function(response) {
        console.log("request number "+ i + " is done and results are back.")
        for (i = 0; i <= (response.recenttracks.track.length - 1); i ++){
          allCallSongs.push(response.recenttracks.track[i]);
        }
      },
      error: function(code, message){
        console.log('it didn\'t work!');
      }
    });
    $(document).ajaxStop(function (){
      completed++;
      console.log(completed + " have been completed of " + requestLength);
      if (completed == requestLength){
        console.log('the requests are done and we are saving to storage')
        saveSongsToStorage(allCallSongs);
      }
    })
  }
  console.log(allCallSongs);
  return(allCallSongs);
}

function saveSongsToStorage(allCallSongs){
  localStorage.setItem("playHistory", JSON.stringify(allCallSongs));
}
