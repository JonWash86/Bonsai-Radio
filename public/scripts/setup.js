function initializeUser(access_token, refresh_token){
  getTrackForUser(getSixMonths(), getYesterday())
  getPlaylists(access_token);
  var userLastId = $("#lastId").val();
  localStorage.setItem("userLastId", userLastId);
  $("#authenticatorPanel").hide();
  $("#overlay").hide();
  $("#playlistFetcher").show();


}
