var trackListSorted = false;
var currentRange = "playTracker"

function fourWeeks(){
  console.log('four weeks! (whoawhoa!)');
}

$('#sortByMostPlays').click(function(){
  trackListSorted = "byTop";
  playListTracks.sort(function(obj1, obj2){
    return obj2.playTracker - obj1.playTracker;
  });
  $("#trackList").children().remove();
  playListTracks.map(function(track){
    writePlayListToPanel(track);
  })
})

$('#sortByFewestPlays').click(function(){
  trackListSorted = "byBottom";
  playListTracks.sort(function(obj1, obj2){
    return obj1.playTracker - obj2.playTracker;
  });
  $("#trackList").children().remove();
  playListTracks.map(function(track){
    writePlayListToPanel(track);
  })
})

// this function manipulates the playcount stat and $('#dateRange') to reflect the previous two weeks.
$('#twoWeekButton').click(function(){
  currentRange = "twoWeekPlays";
  if (trackListSorted = "byTop"){
    playListTracks.sort(function(obj1, obj2){
      return obj2.twoWeekPlays - obj1.twoWeekPlays;
    })
    $("#trackList").children().remove();
    playListTracks.map(function(track){
      track.activeStat.counter = track.twoWeekPlays;
      track.activeStat.spanText = "two weeks";
      writePlayListToPanel(track);
    })
  }

})
