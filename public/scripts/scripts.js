
// document.getElementById('playlistButton').addEventListener('click', function() {
//   var access_token = localStorage.getItem("access_token")
//   getPlaylists(access_token);
// });

//This function gets a list of the user's playlists
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
        // keep chaining getPlaylistTracks calls until
        // there isn't a response.next any more!
        // at that point, we've gotten all the tracks!
        getPlaylistTracks(access_token, response.next);
        //generateTrackList(response.items);
      }

      // to figure out num pages, an example:
      // 137 total items
      // 10 items per page
      // in that case, response.total will be 137
      // response.limit will be 10
      // the actual number of pages will be 14

      // then the code to figure out the number of pages is:
      // var pages = round_up(response.total / response.limit)

      // SO ALL THAT STUFF ABOVE was just assuming
      // that we really cared about the number of pages

    }
  });
}

var playListTracks =[];

// this function goes over every track and writes it to the list pane and adds an onclick listener to each track which will check the playcount and write the track's metadata to the infopane
function generateTrackList(tracks){
  tracks.map(function(track){
    var list = "<li id=\"" + track.track.id + "\" class='playlistItem'>" + track.track.name + "<br><span class=\"trackArtist\"> by " + track.track.artists[0].name + "</span></li>"
    document.getElementById('trackList').innerHTML += list;
    track.playDates = [];
    track.playTracker = 0;
    playListTracks.push(track);
  });
  developPlayListStats();
  $('li.playlistItem').click(function() {
    // idMatcher(this.id);
    displayTrackStats(idMatcher(this.id));
  });
}

function developPlayListStats(){
  for(i = 0; i < allCallSongs.length; i++){
    for(p = 0; p < playListTracks.length; p ++){
      if (playListTracks[p].track.name.toLowerCase() == allCallSongs[i].name.toLowerCase()){
        playListTracks[p].playTracker = (playListTracks[p].playTracker + 1);
        playListTracks[p].playDates.push(allCallSongs[i].date.uts);
      }
    }
  }
};

function idMatcher(identification){
  console.log('checking!')
  for (i = 0; i <= playListTracks.length; i++){
    console.log(playListTracks[i]);
    if (identification == playListTracks[i].track.id){
      console.log('id match!');
      var thisTrack = playListTracks[i];
      console.log(thisTrack);
      return(thisTrack);
    }
  }
}

function displayTrackStats(track){
  var trackStats = "<img id=\"albumThumb\" src="+ track.track.album.images[0].url +" height=\"250px\"><h3 id=\"trackTitle\">" + track.track.name + "</h3><span class=\"trackFacts\">by "+ track.track.artists[0].name +"</span><br><span class=\"trackFacts\">from "+ track.track.album.name + "</span><br><br><span class=\"trackStatistics\">Added on "+ track.added_at +"</span><br><br><span class=\"trackStatistics\">Played "+ track.playTracker +" times.</span>"
  document.getElementById('songInfo').innerHTML = trackStats;
  // return(allCallSongs);
}

// the following function will take the tracks from allCallSongs and check whether they have matching IDs. If they have matching IDs, the scrobble date will be saved to the allCallTrack track, as well as the timestamp of the scrobble.
// This means the first line of the function will need to wipe the existing data, natch.
