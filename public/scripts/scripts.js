
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
      mapOverPlaylists(response.items);
    }
  });
}


function mapOverPlaylists(playlists){
  playlists.map(function(playlist){
    var list = "<option value=" + playlist.id + " class='playlistItem'>" + playlist.name + "</option>"
    document.getElementById('playlistList').innerHTML += list;
  })
  $('#playlistList').on('change', function() {
    console.log('you selected a playlist!')
    var access_token = localStorage.getItem("access_token");
    getPlaylistTracks(access_token);
  })
}

//This function will use the access token to retrieve a list of the songs in a given playlist.
function getPlaylistTracks(access_token){
  console.log('getting tracks' + $('select option:selected').val())
  $.ajax({
    url: 'https://api.spotify.com/v1/playlists/' + $('select option:selected').val() + '/tracks',
    headers: {
      'Authorization':'Bearer ' + access_token
    },
    success: function(response) {
      console.log('hi!')
      console.log(response.items);
      $("#trackList").children().remove();
      mapOverTracks(response.items);
    }
  });
}

function mapOverTracks(tracks){
  tracks.map(function(track){
    var list = "<li id=\"" + track.track.name + "\" class='playlistItem'>" + track.track.name + "<br><span class=\"trackArtist\"> by " + track.track.artists[0].name + "</span></li>"
    document.getElementById('trackList').innerHTML += list;
  })
  $('li.playlistItem').click(function() {
    var access_token = localStorage.getItem("access_token");
    // getPlaylistTracks(access_token);
    var playCount = 0;
    for (i = 0; i <= (allCallSongs.length - 1); i++){
      console.log("we have just processed number"+ i +", which is " + allCallSongs[i].name)
      if (this.id == allCallSongs[i].name){
        console.log('we have a match!')
        playCount ++;
      }
    }
    console.log(this.id);
    console.log("This song has been played " + playCount + " times.");
  })
}
