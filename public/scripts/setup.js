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

// href="/login" just saving the href from the spotify button here for a sec while I figure out how to hide the login behind a handler function
