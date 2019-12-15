function pruneTrack(track){
  console.log(track);
  var access_token = localStorage.getItem("access_token");
  console.log('this button is online!' + access_token);
  console.log(' this is the track id = ' + track.track.id);

  var activePlaylist = $('select option:selected').val();
  var track = {
    'uri':'spotify:track' + 
  };
  var request_url = 'https://api.spotify.com/v1/playlists/' + activePlaylist + '/tracks';
  console.log(request_url);

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
