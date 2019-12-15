function pruneTrack(){
  var access_token = localStorage.getItem("access_token");
  console.log('this button is online!' + access_token);
  var request_url = 'https://api.spotify.com/v1/playlists/' + activePlaylist + '/tracks';
  console.log(request_url)
  var request_uri = 'spotify:track:' + activeTrack;
  console.log(request_uri);
  // $.ajax({
  //   url: request_url,
  //   data: 'tracks':[{
  //     'uri':request_uri
  //   }],
  //   headers: {
  //     'Authorization':'Bearer ' + access_token,
  //     'content-Type': 'application/json'
  //   },
  //
  //   success: function(response){
  //     console.log('song deleted!');
  //   }
  // })
}
