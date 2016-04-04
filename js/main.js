if (typeof chrome !== 'undefined') {
  chrome.runtime.onInstalled.addListener(function(event) {
    init(event);
  });

  chrome.runtime.onStartup.addListener(function(event) {
    init(event)
    .then(function (){
      return artAdder.localGet('disableAutoUpdate')
    })
    .then(function (res){
      if (!res.disableAutoUpdate) {
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
    // no, this is the first time
    if (!exhibition) {
      artAdder.chooseMostRecentExhibition()
      chrome.tabs.create({
        url : 'http://add-art.org/update'
      })
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
      items = items.sort(artAdder.exhibitionsSort)
      if (items.length > 0) {
        artAdder.localSet('defaultShowData', items).then(d.resolve)
      }
    }
  })
  return d.promise
}
