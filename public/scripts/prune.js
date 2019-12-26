function pruneTrack(track){
  var access_token = localStorage.getItem("access_token");
  var request_uri = 'spotify:track:' + track.track.id;
  var activePlaylist = $('select option:selected').val();
  var request_url = 'https://api.spotify.com/v1/playlists/' + activePlaylist + '/tracks';

  $.ajax({
    url: request_url,
    data: '{\"tracks\": [{\"uri\": \"' + request_uri + '\"}]}',
    headers: {
      'Authorization':'Bearer ' + access_token,
      'content-Type': 'application/json',
    },
    type: 'DELETE',
    success: function(response){
      console.log('song deleted!');
      $('#' + track.track.id).hide();
      $('#songInfo').empty();
    },
    error: function(response){
      console.log(response);
    }
  })
}
