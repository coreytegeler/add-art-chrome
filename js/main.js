if (typeof chrome !== 'undefined') {
  chrome.runtime.onInstalled.addListener(function(event) {
    init(event);
  });

  chrome.runtime.onStartup.addListener(function(event) {
    init(event)
    .then(function (){
      return artAdder.localGet('exhibitionUpdated')
    })
    .then(function (d){
      if (Date.now() - d.exhibitionUpdated > 1000*60*60*24*14) { // fortnight
        artAdder.chooseMostRecentExhibition()
      }
    })
  });

  chrome.runtime.onMessage.addListener(function (msg) {
    var key = msg.msg.what
    if (artAdder[key] && typeof artAdder[key] === 'function') {
      artAdder[key](msg.msg[key])
    }
  })
}

function init(event) {
  return syncDefaultList()
  .then(artAdder.getExhibition) // have we chosen a show?
  .then(function (exhibition) {
    // no
    if (!exhibition) {
      artAdder.chooseMostRecentExhibition()
    }
  })
}

// set default show list from add-art feed
function syncDefaultList() {
  var d = Q.defer()
  $.ajax({
    url : 'https://raw.githubusercontent.com/owise1/add-art-exhibitions/master/exhibitions.json',
    dataType : 'json',
    success : function (items) {
      items = items.sort(function (a,b) {
                     if (Date.parse(a.date) < Date.parse(b.date)) return -1
                     if (Date.parse(a.date) > Date.parse(b.date)) return 1
                     return 0
                   })
      if (items.length > 0) {
        artAdder.localSet('defaultShowData', items).then(d.resolve)
      }
    }
  })
  return d.promise
}
