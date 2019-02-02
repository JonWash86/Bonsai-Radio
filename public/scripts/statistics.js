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
