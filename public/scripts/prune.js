function pruneTrack(){
  var access_token = localStorage.getItem("access_token");
  console.log('this button is online!' + access_token);
  var request_url = 'https://api.spotify.com/v1/playlists/' + activePlaylist + '/tracks';
  console.log(request_url)
  var request_uri = 'spotify:track:' + activeTrack;
  console.log(request_uri);
  $.ajax({
    method:'DELETE',
    url: request_url,
    tracks: [{
      'uri':request_uri
    }],
    contentType: 'application/json',
    headers: {
      'Authorization':'Bearer ' + access_token,
    },

    success: function(response){
      console.log('song deleted!');
    }
  })
}
