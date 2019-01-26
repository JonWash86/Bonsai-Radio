function initializeUser(access_token, refresh_token){
  getTrackForUser(getLastWeek(), getYesterday());
  // getTrackForUser(getSixMonths(), getYesterday()); For testing purposes, the six month grab is commented out and we'll be testing with a week grab.

  localStorage.setItem("lastPullDate", getYesterday());
  getPlaylists(access_token);
  var userLastId = $("#lastId").val();
  localStorage.setItem("userLastId", userLastId);
  $("#authenticatorPanel").hide();
  $("#overlay").hide();
  $("#playlistFetcher").show();
  localStorage.setItem("playHistory", JSON.stringify(allCallSongs));
};
