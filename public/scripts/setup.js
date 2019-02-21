function initializeUser(access_token, refresh_token){
  // checkForExistingHistory();
  getTrackForUser(getFourWeeks(), getYesterday());
  // getPlaylists(access_token);
  $("#authenticatorPanel").hide();
  $("#overlay").hide();
  $("#progressDisplay").show();
  $("#playlistFetcher").show();
};

$('#spotifyButton').on('click', function(){
  if (!$("#lastId").val()){
    $("#inputError").show();
  }
  else {
    var userLastId = $("#lastId").val();
    console.log(userLastId);
    localStorage.setItem("userLastId", userLastId);
    window.location.href = ('/login');
  };

});
