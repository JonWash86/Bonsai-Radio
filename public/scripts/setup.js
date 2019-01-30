function initializeUser(access_token, refresh_token){
  // checkForExistingHistory();
  // getTrackForUser(getSixMonths(), getYesterday()); For testing purposes, the six month grab is commented out and we'll be testing with a four-week grab.

  getTrackForUser(getFourWeeks(), getYesterday())
  getPlaylists(access_token);
  var userLastId = $("#lastId").val();
  localStorage.setItem("userLastId", userLastId);
  $("#authenticatorPanel").hide();
  $("#overlay").hide();
  $("#playlistFetcher").show();
};
