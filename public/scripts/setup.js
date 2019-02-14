function initializeUser(access_token, refresh_token){
  // checkForExistingHistory();
  var userLastId = $("#lastId").val();
  localStorage.setItem("userLastId", userLastId);
	// XXX maybe `getTrackForUser()` would be better named as `getLastFmHistory()` or similar?
  getTrackForUser(getFourWeeks(), getYesterday());
  $("#authenticatorPanel").hide();
  $("#overlay").hide();
  $("#playlistFetcher").show();
};
