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

  $("#sortByNative").click(function(){
    trackListSorted = "byNative";
    $('button').removeClass('activeSort');
    $(this).addClass('activeSort');
    playListTracks.sort(function(obj1, obj2){
      return obj1.nativeOrder - obj2.nativeOrder;
    });
    $("#trackList").children().remove();
    writePlayListToPanel(playListTracks);
  })

  // this function manipulates the playcount stat and $('#dateRange') to reflect the previous four weeks.
  $('#fourWeekButton').click(function(){
    currentRange = "fourWeekPlays";
    $('button').removeClass('activeSpan');
    $(this).addClass('activeSpan');
    updateActiveStat(playListTracks, "fourWeekPlays", "four weeks");
    restoreSort(playListTracks);
    $("#trackList").children().remove();
    writePlayListToPanel(playListTracks);
  })

  // this function manipulates the playcount stat and $('#dateRange') to reflect the previous two weeks.
  $('#twoWeekButton').click(function(){
    currentRange = "twoWeekPlays";
    $('button').removeClass('activeSpan');
    $(this).addClass('activeSpan');
    updateActiveStat(playListTracks, "twoWeekPlays", "two weeks");
    restoreSort(playListTracks);
    $("#trackList").children().remove();
    writePlayListToPanel(playListTracks);
  })

  // this function manipulates the playcount stat and $('#dateRange') to reflect the previous week.
  $('#oneWeekButton').click(function(){
    currentRange = "oneWeekPlays";
    $('button').removeClass('activeSpan');
    $(this).addClass('activeSpan');
    updateActiveStat(playListTracks, "oneWeekPlays", "week");
    restoreSort(playListTracks);
    $("#trackList").children().remove();
    writePlayListToPanel(playListTracks);
  })
}

function restoreSort(playListTracks){
  if (trackListSorted === "byTop"){
    playListTracks.sort(function(obj1, obj2){
      return obj2.activeStat.counter - obj1.activeStat.counter;
    });
  }
  else if (trackListSorted === "byBottom"){
    playListTracks.sort(function(obj1, obj2){
      return obj1.activeStat.counter - obj2.activeStat.counter;
    });
  }
  else if (trackListSorted === "byNative"){
    playListTracks.sort(function(obj1, obj2){
      return obj1.nativeOrder - obj2.nativeOrder;
    });
  }
}


function updateActiveStat(playListTracks, newStat, newText){
  var tracks = playListTracks
  tracks.map(function(track){
    track.activeStat.counter = track[newStat];
    track.activeStat.spanText = newText;
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
