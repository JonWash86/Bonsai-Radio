
document.getElementById('playlistButton').addEventListener('click', function() {
  var access_token = localStorage.getItem("access_token")
  getTopTracks(access_token);
});

function getTopTracks(access_token) {
  console.log('getting playlists')
  $.ajax({
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'Authorization':'Bearer ' + access_token
    },
    success: function(response) {
      console.log('hi!')
      console.log(response.items);
      $(".recommendations").show();
      mapOverPlaylists(response.items);
    }
  });
}

function mapOverPlaylists(playlists){
  playlists.map(function(playlist){
    var list = "<li id=" + playlist.id + " class='playlistItem'> <img src='" + playlist.images[0].url + "' height='75px'>" + playlist.name + "</li>"
    document.getElementById('playlistList').innerHTML += list;
  })
  $('.playlistItem').click(function() {
    var access_token = localStorage.getItem("access_token");
    getPlaylistTracks(access_token);
  })
}

function getPlaylistTracks(access_token){
  console.log('getting tracks' + this.id)
  $.ajax({
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'Authorization':'Bearer ' + access_token
    },
    success: function(response) {
      console.log('hi!')
      console.log(response.items);
      $(".recommendations").show();
      mapOverPlaylists(response.items);
    }
  });
}
