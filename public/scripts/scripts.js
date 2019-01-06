
document.getElementById('get-top-tracks').addEventListener('click', function() {
  var access_token = localStorage.getItem("access_token")
  getTopTracks(access_token);
});

function getTopTracks(access_token) {
  console.log('getting tracks')
  $.ajax({
    url: 'https://api.spotify.com/v1/me/top/tracks?limit=10',
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
