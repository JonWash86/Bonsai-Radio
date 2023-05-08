var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// grab today's date, then slot in the day before it and convert that day @11:59 UTC to a UNIX timestamp
function getYesterday(){
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(11,59);
  yesterday.setSeconds(59, 999);
  return(yesterday / 1000|0);
};

function getNow(){
  var today = new Date();
  return(today / 1000|0);
};


// there are 604800 seconds in a week ...
function getLastWeek(){
  return(getYesterday() - 604800);
};

function getTwoWeeks(){
  return(getYesterday() - 1209600);
};

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
  var date = new Date(unixStamp * 1000);
  var year = date.getFullYear();
  var month = months_arr[date.getMonth()];
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  return(month + ' ' + day + ', at ' + hours + ':' + minutes.substr(-2))
}

function convertIsoToLastPlayed(IsoStamp){
  var date = new Date(IsoStamp);
  var day = date.getDate();
  var month = months_arr[date.getMonth()];
  return(month + ' ' + day )
}

// this function checks the last.fm id field and retrieves the most recently played tracks for that user. It then passes the length of the ensuing list to the getFullHistory function to loop over the pages of results.
function getTrackForUser(previousDate, todayDate) {
  //TODO: Rename this function to be more descriptive of what it does
  var userLastId = localStorage.getItem("userLastId");
  var requestUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&api_key=' + process.env.LAST_FM_KEY + '&username=' + userLastId + '&from='+ previousDate +'&to='+ todayDate +'&page?&format=json';
  console.log(userLastId);
  console.log(requestUrl);
  $.ajax({
    type:'POST',
    url: requestUrl,
    success: function(response) {
      console.log(response.recenttracks)
      var requestLength = response.recenttracks["@attr"].totalPages;
      var total = response.recenttracks["@attr"].total;
      console.log(total);
      getFullHistory(requestLength, total, previousDate, todayDate);
    },
    error: function(code, message){
      console.log('it didn\'t work!');
      $('#loading').html('Something went wrong. Please try refreshing the browser.');
      $('#loading').addClass('errorMessage');
      $('#loading').css('color', 'red');
    }
  });
}

function getFullHistory(requestLength, numTracksExpected, previousDate, todayDate) {
  var userLastId = localStorage.getItem("userLastId");
  var completed = 0;
  var allCallSongs = [];
  console.log(requestLength);
  for (i = 1; i <= requestLength; i ++){
    console.log('making call number ' + i +' of '+ requestLength )

    $.ajax({
      type:'POST',
      url: 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&api_key=100a45f60fce336c43b1dac55062e23a&username=' + userLastId + '&from='+ previousDate +'&to='+ todayDate +'&page='+ i +'&format=json',
      success: function(response) {
        console.log(response.recenttracks.track.length);
        for (j = 0; j <= (response.recenttracks.track.length - 1); j ++){
          allCallSongs.push(response.recenttracks.track[j]);
        }
      // NOTE: if one of these requests fails, then allCallSongs.length will never equal numTracksExpected
      // and this if-statement will never be satisfied and the app will hang.
      // Some error handling (maybe decrement `numTracksExpected` by `tracksPerPage` or somethhing in the error function?)
      // could fix this potential problem.
      if (allCallSongs.length >= numTracksExpected) {
        console.log("last.fm history responses all received, now let's fetch spotify data!");
        console.log(allCallSongs);
        var access_token = localStorage.getItem("access_token");
        getPlaylists(access_token, allCallSongs);
        $("#progressDisplay").hide();
      }

      },
      error: function(code, message){
        console.log('it didn\'t work!');
        $('#loading').html('Something went wrong. Please try refreshing the browser.');
        $('#loading').addClass('errorMessage');
        $('#loading').css('color', 'red');
      }
    });
  }
  console.log(allCallSongs);
  return(allCallSongs);
}
