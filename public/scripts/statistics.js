function fourWeeks(){
  console.log('four weeks! (whoawhoa!)');
}

$('#sortByMostPlays').click(function(){
  playListTracks.sort(function(obj1, obj2){
    return obj2.playTracker - obj1.playTracker;
  });
  $("#trackList").children().remove();
  playListTracks.map(function(track){
    writePlayListToPanel(track);
  })
})

$('#sortByFewestPlays').click(function(){
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
  playListTracks.map(function(track){
    
  })
})
