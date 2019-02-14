//This function gets a list of the user's playlists.
function getPlaylists(access_token, allCallSongs) {
  $.ajax({
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'Authorization':'Bearer ' + access_token
    },
    success: function(response) {
      $(".recommendations").show();
      generatePlaylistDropdown(response.items, allCallSongs);
    }
  });
}

// this function takes the playlists from getPlaylists and writes each title to the playlist selector dropdown.
function generatePlaylistDropdown(playlists, allCallSongs){
  playlists.map(function(playlist){
    var list = "<option value=" + playlist.id + " class='playlistItem'>" + playlist.name + "</option>"
    document.getElementById('playlistList').innerHTML += list;
  })
  $('#playlistList').on('change', function() {
    $("#trackList").children().remove();
    var access_token = localStorage.getItem("access_token");
    var playListTracks = getPlaylistTracks(access_token, allCallSongs);
    console.log(playListTracks);
  })
}



//This function will use the access token to retrieve a list of the songs in a given playlist.
function getPlaylistTracks(access_token, allCallSongs, request_url, playListTracks){
  var url = request_url || 'https://api.spotify.com/v1/playlists/' + $('select option:selected').val() + '/tracks'
  var playListTracks = (playListTracks || []);
  $.ajax({
    url: url,
    headers: {
      'Authorization':'Bearer ' + access_token
    },
    success: function(response) {
      var tracks = generateTrackList(response.items, allCallSongs);
      console.log(tracks);
      tracks.map(function(track){
        playListTracks.push(track);
        writePlayListToPanel(track, playListTracks);
      })
      initTrackListener(playListTracks);
      console.log(playListTracks);
      if(response.next) {
        getPlaylistTracks(access_token, allCallSongs, response.next, playListTracks);
      }
    }
  });
  $(document).ajaxComplete(function(){
    console.log('all calls are complete, and now PLT is like so: ' + playListTracks);
    initializePlayListControl(playListTracks);
  });
  return(playListTracks);
}


function writePlayListToPanel(track, playListTracks){
  console.log(track);
  var list = "<li id=\"" + track.track.id + "\" class='playlistItem'>" + track.track.name + "<br><span class=\"trackArtist\"> by " + track.track.artists[0].name + "</span></li>"
  document.getElementById('trackList').innerHTML += list;

  $('li.playlistItem').click(function() {
    displayTrackStats(idMatcher(this.id, playListTracks));
  });
}

function writePlayListToPanel(track){
  var thisParticulartrack = track;
  // console.log(thisParticulartrack);
  var list = "<li id=\"" + thisParticulartrack.track.id + "\" class='playlistItem'>" + thisParticulartrack.track.name + "<br><span class=\"trackArtist\"> by " + thisParticulartrack.track.artists[0].name + "</span></li>"
  document.getElementById('trackList').innerHTML += list;
}

// this function goes over every track and writes it to the list pane and adds an onclick listener to each track which will check the playcount and write the track's metadata to the infopane
function generateTrackList(tracks, allCallSongs){
  var trackBatch = [];
  tracks.map(function(track){
    track.playDates = [];
    track.lastPlayDate = null;
    track.fourWeekPlays = 0;
    track.twoWeekPlays = 0;
    track.oneWeekPlays = 0;
    track.activeStat = {
      counter: 0,
      spanText: "four weeks"}
    trackBatch.push(track);
  });

  return developPlayListStats(allCallSongs, trackBatch);

//   commented out during pull request; uncomment if issues arise!
//   $('#controlPanel').show();

}

function developPlayListStats(allCallSongs, trackBatch){
  for(i = 0; i < allCallSongs.length; i++){
    for(p = 0; p < trackBatch.length; p ++){
      if (trackBatch[p].track.name.toLowerCase() == allCallSongs[i].name.toLowerCase()){
        // TODO: due to some lameness, if a song has the "now playing" attribute, it'll not have a date attribute. I need to make a long-term fix for this down the line.
        if(allCallSongs[i].date){
          trackBatch[p].fourWeekPlays++;
          trackBatch[p].activeStat.counter++;
          trackBatch[p].playDates.push(allCallSongs[i].date.uts);
          if(trackBatch[p].lastPlayDate < allCallSongs[i].date.uts){
            trackBatch[p].lastPlayDate = allCallSongs[i].date.uts;
          }
          if(allCallSongs[i].date.uts >= getTwoWeeks()){
            trackBatch[p].twoWeekPlays ++;
            if(allCallSongs[i].date.uts >= getLastWeek()){
              trackBatch[p].oneWeekPlays ++;
            }
          }
        }
      }
    }
  }
  console.log(trackBatch);
  return trackBatch;
};

function idMatcher(identification, playListTracks){
  for (i = 0; i <= playListTracks.length; i++){
    if (identification == playListTracks[i].track.id){
      console.log('id match!');
      var thisTrack = playListTracks[i];
      console.log(thisTrack);
      return(thisTrack);
    }
  }
}

function displayTrackStats(track){
  var trackStats = "<img id=\"albumThumb\" src="+ track.track.album.images[0].url +" height=\"250px\"><h3 id=\"trackTitle\">" + track.track.name + "</h3><span class=\"trackFacts\">by "+ track.track.artists[0].name +"</span><br><span class=\"trackFacts\">from "+ track.track.album.name + "</span><br><br><span class=\"trackStatistics\">Added on "+ track.added_at +"</span><br><span class=\"trackStatistics\">Played "+ track.activeStat.counter + " times in the last </span><span id=\"dateRange\" class=\"trackStatistics\">" + track.activeStat.spanText + ".</span>"
  if (track.lastPlayDate){
    trackStats += "<br><br><br>Last played " + convertUnixToText(track.lastPlayDate) + "."
  };

  document.getElementById('songInfo').innerHTML = trackStats;
}
