var activeTrack;

//This function gets a list of the user's playlists.
function getPlaylists(access_token, allCallSongs) {
  $.ajax({
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'Authorization':'Bearer ' + access_token
    },
    success: function(response) {
      $(".recommendations").show();
      console.log('response items:');
      console.log(response.items);
      console.log('all call:');
      console.log(allCallSongs);
      generatePlaylistDropdown(response.items, allCallSongs);
    }
  });
}

// this function takes the playlists from getPlaylists and writes each title to the playlist selector dropdown.
function generatePlaylistDropdown(playlists, allCallSongs){
  console.log('These are the playlists we receive: ');
  console.log(playlists);
  playlists.map(function(playlist){
    console.log(playlist);
    var list = "<option value=" + playlist.id + " class='playlistItem'>" + playlist.name + "</option>"
    document.getElementById('playlistList').innerHTML += list;
  })
  $('#playlistList').on('change', function() {
    $('#trackList').children().remove();
    $('#playlistFetcher').hide();
    activeTrack = null;
    var clear = "";
    document.getElementById('songInfo').innerHTML = clear;
    var access_token = localStorage.getItem("access_token");
    var activePlaylist = $('select option:selected').val();
    getPlaylistTracks(access_token, allCallSongs);
  })
  $('#pickNewPlaylist').on('click', function(){
    $('#playlistFetcher').show();
    $('#closeOut').show();
    $('#closeOut').on('click', function(){
      $('#playlistFetcher').hide();
    })
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
      })
      console.log(playListTracks);
      if(response.next) {
        getPlaylistTracks(access_token, allCallSongs, response.next, playListTracks);
      } else {
        console.log('done making spotify api requests for this playlist');
        console.log('tracks below');
        console.log(playListTracks);
        console.log(playListTracks[0].track.name);
        console.log(playListTracks[0].track.artists[0].name);
        $("#sortPane").show();
        $("#controlPanel").show();
        $('#playlistSwitcher').show();
        initNativePlays(playListTracks);
        writePlayListToPanel(playListTracks);
        initializePlayListControl(playListTracks);

      }
    }
  });
}

// This function maps all of the tracks for a playlist and adds a natural order for removing top/bottom sorting.
function initNativePlays(playListTracks){
  var orderTracker = 0;
  playListTracks.map(function(track){
    track.nativeOrder = orderTracker;
    orderTracker++;
  })
  return(playListTracks);
}

// Here we map over the PLT and write a li to the playlist panel, then initialize an onclick listener which will draw our tracks' stats to the stat panel.
function writePlayListToPanel(playListTracks){
  playListTracks.map(function(track) {
    var t = track.track;
    var list = "<li id=\"" + t.id + "\" class='playlistItem'>" + t.name + "<br><span class=\"trackArtist\"> by " + t.artists[0].name + "</span></li>"
    document.getElementById('trackList').innerHTML += list;
  });
  initTrackListener(playListTracks);
  console.log(playListTracks[0].track.name);
}


function initTrackListener(playListTracks){
  $('li.playlistItem').click(function() {
    console.log(this.id, playListTracks);
    activeTrack = this.id;
    $('li').removeClass('activeTrack');
    $(this).addClass('activeTrack');
    displayTrackStats(idMatcher(this.id, playListTracks));
    readyRangeChange(idMatcher(this.id, playListTracks));
    // $('#pruneButton').click(function(){
    //   pruneTrack();
    // })
  });
}

// this function goes over every track and writes it to the list pane and adds an onclick listener to each track which will check the playcount and write the track's metadata to the infopane
function generateTrackList(tracks, allCallSongs){
  var trackBatch = [];
  // use const where possible, as with Es2015 will ensure it remains in the local scope (look up variable hoisting! Also look up const vs let)
  tracks.map(function(track){
    track.playDates = [];
    track.lastPlayDate = null;
    track.fourWeekPlays = 0;
    track.twoWeekPlays = 0;
    track.oneWeekPlays = 0;
    track.nativeOrder;
    track.activeStat = {
      counter: 0,
      spanText: "four weeks"}
    trackBatch.push(track);
  });
  return developPlayListStats(allCallSongs, trackBatch);
}

// this function maps over the last.fm scrobble list and compares it to the tracks on a playlist (PLT)
// it then returns the PLT array with date-range-specific stats, ready to be drawn to the playlist panel.
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

// this handy little function passes an id and returns the track from the current playlist (PLT). This is key for the onclick listener which displays a track's stats
// (and can be used to redraw the track stat panel when we update our range!).
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
  console.log(track);
  var trackStats = "<img id=\"albumThumb\" src="+ track.track.album.images[0].url +" height=\"250px\"><h3 id=\"trackTitle\">" + track.track.name + "</h3><span class=\"trackFacts\">by "+ track.track.artists[0].name +"</span><br><span class=\"trackFacts\">from "+ track.track.album.name + "</span><br><br><span class=\"trackStatistics\">Added on "+ convertIsoToLastPlayed(track.added_at) +".</span><br><span class=\"trackStatistics\">Played "+ track.activeStat.counter + " times in the last </span><span id=\"dateRange\" class=\"trackStatistics\">" + track.activeStat.spanText + ".</span>"
  if (track.lastPlayDate){
    trackStats += "<br><br><br>Last played " + convertUnixToText(track.lastPlayDate) + "."
  };
  trackStats += "<br><br><button type=\"button\" id=\"pruneButton\">prune</button>";
  console.log(track);


  document.getElementById('songInfo').innerHTML = trackStats;
  $('#pruneButton').click(function(){
    console.log('click!');
    console.log(track);
    pruneTrack(track);
  });
  // $(".spanButton").click(function(track){
  //   displayTrackStats(track);
  // })
}

// This function prepares our playlist panel for the instance of a user changing the date range, so the active track being viewed will
function readyRangeChange(track){
  $(".spanButton").click(function(){
    console.log(track);
    displayTrackStats(track);
  })
}
