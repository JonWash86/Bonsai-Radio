
document.getElementById('playlistButton').addEventListener('click', function() {
  var access_token = localStorage.getItem("access_token")
  getTopTracks(access_token);
});

function getTopTracks(access_token) {
  console.log('getting tracks')
  $.ajax({
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: {
      'Authorization':'Bearer ' + access_token
    },
    success: function(response) {
      console.log('hi!')
      console.log(response.items);
      $(".recommendations").show();
      mapOverSongs(response.items);
    }
  });
}
