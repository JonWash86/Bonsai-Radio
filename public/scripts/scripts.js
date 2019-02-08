//This function gets a list of the user's playlists.
function getPlaylists(access_token) {
  $.ajax({
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'Authorization':'Bearer ' + access_token
    },
    success: function(response) {
      $(".recommendations").show();
      generatePlaylistDropdown(response.items);
    }
  });
}

// this function takes the playlists from getPlaylists and writes each title to the playlist selector dropdown.
function generatePlaylistDropdown(playlists){
  playlists.map(function(playlist){
    var list = "<option value=" + playlist.id + " class='playlistItem'>" + playlist.name + "</option>"
    document.getElementById('playlistList').innerHTML += list;
  })
  $('#playlistList').on('change', function() {
    $("#trackList").children().remove();
    var access_token = localStorage.getItem("access_token");
    getPlaylistTracks(access_token);
    playListTracks.length = 0;
  })
}

//This function will use the access token to retrieve a list of the songs in a given playlist.
function getPlaylistTracks(access_token, request_url){
  var url = request_url || 'https://api.spotify.com/v1/playlists/' + $('select option:selected').val() + '/tracks'

  $.ajax({
    url: url,
    headers: {
      'Authorization':'Bearer ' + access_token
    },
    success: function(response) {
      generateTrackList(response.items);
      if(response.next) {
        getPlaylistTracks(access_token, response.next);
      }
    }
  });
}

var playListTracks =[];

function writePlayListToPanel(track){
  var list = "<li id=\"" + track.track.id + "\" class='playlistItem'>" + track.track.name + "<br><span class=\"trackArtist\"> by " + track.track.artists[0].name + "</span></li>"
  document.getElementById('trackList').innerHTML += list;
  $('li.playlistItem').click(function() {
    displayTrackStats(idMatcher(this.id));
  });
}

// this function goes over every track and writes it to the list pane and adds an onclick listener to each track which will check the playcount and write the track's metadata to the infopane
function generateTrackList(tracks){
  tracks.map(function(track){
    writePlayListToPanel(track);
    track.playDates = [];
    track.lastPlayDate = null;
    track.fourWeekPlays = 0;
    track.twoWeekPlays = 0;
    track.oneWeekPlays = 0;
    track.activeStat = {
      counter: 0,
      spanText: "four weeks"}
    playListTracks.push(track);
  });
  developPlayListStats(allCallSongs);
  $('#controlPanel').show();
}

function developPlayListStats(allCallSongs){
  for(i = 0; i < allCallSongs.length; i++){
    // XX JRHEARD XX - this is what I was referring to: line 78 gives the length of my total scrobbles (if you try to select a playlist early, you'll see allCallSongs is not its final length, another reason for a progress bar). Line 79 shows where in the for loop we are. When I hit the end of the list, the loop starts over again, leading to our Helter Skelter double-scrobbles.
    console.log(allCallSongs.length);
    console.log(i);
    for(p = 0; p < playListTracks.length; p ++){
      if (playListTracks[p].track.name.toLowerCase() == allCallSongs[i].name.toLowerCase()){
        // TODO: due to some lameness, if a song has the "now playing" attribute, it'll not have a date attribute. I need to make a long-term fix for this down the line.
        if(allCallSongs[i].date){
          // console.log("Before: " + playListTracks[p].track.name + " is with " + playListTracks[p].fourWeekPlays + " plays total, with " + playListTracks[p].twoWeekPlays + "two-week plays from play date "  + allCallSongs[i].date.uts);
          playListTracks[p].fourWeekPlays++;
          playListTracks[p].playDates.push(allCallSongs[i].date.uts);
          if(playListTracks[p].lastPlayDate < allCallSongs[i].date.uts){
            playListTracks[p].lastPlayDate = allCallSongs[i].date.uts;
          }
          if(allCallSongs[i].date.uts >= getTwoWeeks()){
            playListTracks[p].twoWeekPlays ++;
            if(allCallSongs[i].date.uts >= getLastWeek()){
              playListTracks[p].oneWeekPlays ++;
            }
          }
          if (playListTracks[p].track.name.toLowerCase() =="andromeda"){
            console.log(playListTracks[p]);
            console.log(allCallSongs[i]);
          }
        }
        // console.log("after: " + playListTracks[p].track.name + " is with " + playListTracks[p].fourWeekPlays + " plays total, with " + playListTracks[p].twoWeekPlays + "two-week plays from play date "  + allCallSongs[i].date.uts);
      }
    }
  }
};

function idMatcher(identification){
  for (i = 0; i <= playListTracks.length; i++){
    if (identification == playListTracks[i].track.id){
      console.log('id match!');
      var thisTrack = playListTracks[i];
      console.log(thisTrack);
      return(thisTrack);
    }
  }
}

function displayTrackStats(track, trackSpan){
  var trackStats = "<img id=\"albumThumb\" src="+ track.track.album.images[0].url +" height=\"250px\"><h3 id=\"trackTitle\">" + track.track.name + "</h3><span class=\"trackFacts\">by "+ track.track.artists[0].name +"</span><br><span class=\"trackFacts\">from "+ track.track.album.name + "</span><br><br><span class=\"trackStatistics\">Added on "+ track.added_at +"</span><br><span class=\"trackStatistics\">Played "+ track.activeStat.counter + " times in the last </span><span id=\"dateRange\" class=\"trackStatistics\">" + track.activeStat.spanText + ".</span>"
  if (track.lastPlayDate){
    trackStats += "<br><br><br>Last played " + convertUnixToText(track.lastPlayDate) + "."
  };

  document.getElementById('songInfo').innerHTML = trackStats;
  // return(allCallSongs);
}

// $("#fourWeekButton").click(fourWeeks());
// the following function will take the tracks from allCallSongs and check whether they have matching IDs. If they have matching IDs, the scrobble date will be saved to the allCallTrack track, as well as the timestamp of the scrobble.
// This means the first line of the function will need to wipe the existing data, natch.


function debugAllCall(allCallSongs){
  allCallSongs.sort(function(obj1, obj2){
    return obj2.date.uts - obj1.date.uts;
  });
  return(allCallSongs);

}
