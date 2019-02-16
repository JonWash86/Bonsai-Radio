function initializeUser(access_token, refresh_token){
  // checkForExistingHistory();
  var userLastId = $("#lastId").val();
  localStorage.setItem("userLastId", userLastId);
  getTrackForUser(getFourWeeks(), getYesterday());
  $("#authenticatorPanel").hide();
  $("#overlay").hide();
  $("#playlistFetcher").show();
  $('#controlPanel').show();
};
