var trackListSorted = false;
var currentRange = "fourWeekPlays"


// JR: here is my playlist control initializer. I try to pass PLT to it every time I pull a ne PL's Ts, in order to manipulate that Pl's data. It seems like if I call it in the wrong place (as I tried on statistics.js 76, and commented out), it'll start looping over and over, and if you click the buttons enough it'll hang indefinitely.
function initializePlayListControl(playListTracks){
  console.log(playListTracks[0].track.name);
  $('#sortByMostPlays').click(function(){
    console.log(playListTracks[0].track.name);
    trackListSorted = "byTop";
    $('button').removeClass('activeSort');
    $(this).addClass('activeSort');
    redrawTrackList(playListTracks);
    // initializePlayListControl(playListTracks);

  })

  $('#sortByFewestPlays').click(function(){
    trackListSorted = "byBottom";
    $('button').removeClass('activeSort');
    $(this).addClass('activeSort');
    restoreSort(playListTracks);
    redrawTrackList(playListTracks);
    // initializePlayListControl(playListTracks);

  })

  $("#sortByNative").click(function(){
    trackListSorted = "byNative";
    $('button').removeClass('activeSort');
    $(this).addClass('activeSort');
    restoreSort(playListTracks);
    redrawTrackList(playListTracks);
    // initializePlayListControl(playListTracks);

  })

  // this function manipulates the playcount stat and $('#dateRange') to reflect the previous four weeks.
  $('#fourWeekButton').click(function(){
    currentRange = "fourWeekPlays";
    $('button').removeClass('activeSpan');
    $(this).addClass('activeSpan');
    updateActiveStat(playListTracks, "fourWeekPlays", "four weeks");
    restoreSort(playListTracks);
    redrawTrackList(playListTracks);
  })

  // this function manipulates the playcount stat and $('#dateRange') to reflect the previous two weeks.
  $('#twoWeekButton').click(function(){
    currentRange = "twoWeekPlays";
    $('button').removeClass('activeSpan');
    $(this).addClass('activeSpan');
    updateActiveStat(playListTracks, "twoWeekPlays", "two weeks");
    restoreSort(playListTracks);
    redrawTrackList(playListTracks);
  })

  // this function manipulates the playcount stat and $('#dateRange') to reflect the previous week.
  $('#oneWeekButton').click(function(){
    currentRange = "oneWeekPlays";
    $('button').removeClass('activeSpan');
    $(this).addClass('activeSpan');
    updateActiveStat(playListTracks, "oneWeekPlays", "week");
    restoreSort(playListTracks);
    redrawTrackList(playListTracks);
  })
}

// JR - This little guy seems to be the root of the issue, or at least where my bugs make themselves apparent. Most specifically, if you load up a playlist and adjust the sort order, then call a new playlist and change that one's sort order, the previous playlist gets drawn to the playlist panel on the left, and in our console we get an error at line 76, "can't read property "top" of undefined"

function redrawTrackList(playListTracks){
  console.log(playListTracks);
  $("#trackList").children().remove();
  writePlayListToPanel(playListTracks);
  // TODO: w/o initializePLControl here, the previous plt remains active when redrawing the playlist based on top/bottom, and shows the last pl used. With this line here, the listeners appear to be stacking. I may need to remove listeners from my playlist buttons, then re-initialize?
  // initializePlayListControl(playListTracks);
  $("#" + activeTrack).addClass('activeTrack');
  // Here we call a variable to offset the control panel above the tracklist, then scroll to the active track after a redraw.
  if (activeTrack !== null){
    var targetOffset = $('#' + activeTrack).offset().top - 60;
    $("div#listPane").scrollTop(targetOffset - $("div#listPane").offset().top + $("div#listPane").scrollTop());
  }
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
