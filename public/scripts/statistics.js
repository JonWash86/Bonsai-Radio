var trackListSorted = false;
var currentRange = "fourWeekPlays"

function fourWeeks(){
  console.log('four weeks! (whoawhoa!)');
}

function initializePlayListControl(playListTracks){
  $('#sortByMostPlays').click(function(){
    trackListSorted = "byTop";
    $('button').removeClass('activeSort');
    $(this).addClass('activeSort');
    playListTracks.sort(function(obj1, obj2){
      return obj2.activeStat.counter - obj1.activeStat.counter;
    });
    $("#trackList").children().remove();
    writePlayListToPanel(playListTracks);
  })

  $('#sortByFewestPlays').click(function(){
    trackListSorted = "byBottom";
    $('button').removeClass('activeSort');
    $(this).addClass('activeSort');
    playListTracks.sort(function(obj1, obj2){
      return obj1.activeStat.counter - obj2.activeStat.counter;
    });
    $("#trackList").children().remove();
    writePlayListToPanel(playListTracks);
  })

  // this function manipulates the playcount stat and $('#dateRange') to reflect the previous four weeks.
  $('#fourWeekButton').click(function(){
    currentRange = "fourWeekPlays";
    restoreSort(playListTracks, "fourWeekPlays");
    $("#trackList").children().remove();
    updateActiveStat(playListTracks, "fourWeekPlays");
  })

  // this function manipulates the playcount stat and $('#dateRange') to reflect the previous two weeks.
  $('#twoWeekButton').click(function(){
    currentRange = "twoWeekPlays";
    restoreSort(playListTracks, "twoWeekPlays");
    $("#trackList").children().remove();
    updateActiveStat(playListTracks, "twoWeekPlays");
  })

  // this function manipulates the playcount stat and $('#dateRange') to reflect the previous week.
  $('#oneWeekButton').click(function(){
    currentRange = "oneWeekPlays";
    $("#trackList").children().remove();
    restoreSort(playListTracks, "oneWeekPlays");
    updateActiveStat(playListTracks, "oneWeekPlays");
  })

}

function restoreSort(playListTracks, range){
  if (trackListSorted === "byTop"){
    playListTracks.sort(function(obj1, obj2){
      return obj2.range - obj1.range;
    });
  }
  else if (trackListSorted === "byBottom"){
    playListTracks.sort(function(obj1, obj2){
      return obj1.range - obj2.range;
    });
  }
}


function updateActiveStat(playListTracks, newStat){
  var tracks = playListTracks
  tracks.map(function(track){
    track.activeStat.counter = track.newStat;
    track.activeStat.spanText = "week";
    writePlayListToPanel(track);
    initTrackListener(tracks);
  })
}

function oneWeekInit(playListTracks){
  trackListSorted = "byTop";
  playListTracks.sort(function(obj1, obj2){
    return obj2.activeStat.counter - obj1.activeStat.counter;
  });
  $("#trackList").children().remove();
  playListTracks.map(function(track, playListTracks){
    writePlayListToPanel(track);
    initTrackListener(playListTracks);
    initializePlayListControl(playListTracks);
  })
}
