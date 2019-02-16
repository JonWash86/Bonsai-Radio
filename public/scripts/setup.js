function initializeUser(access_token, refresh_token){
  // checkForExistingHistory();
  var userLastId = $("#lastId").val();
  localStorage.setItem("userLastId", userLastId);
  getTrackForUser(getFourWeeks(), getYesterday());
  // getPlaylists(access_token);
  $("#authenticatorPanel").hide();
  $("#overlay").hide();
  $("#playlistFetcher").show();
  $("#controlPanel").show();
};
