chrome.runtime.onInstalled.addListener(function(event) {
	init(event);
});

chrome.runtime.onStartup.addListener(function(event) {
	init(event);
});

chrome.extension.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    var key = msg.msg.what
    if (vAPI.artAdder[key] && typeof vAPI.artAdder[key] === 'function') {
      vAPI.artAdder[key](msg.msg[key])
    }
  })
})


//gets RSS feed links for default shows in local JSON file
function init(event) {
	reason = event.reason;
	currentDate = Date.now();
	twoWeeks = 14 * 24 * 60 * 60 * 1000;
	twoWeeksAgo = currentDate - twoWeeks;
	twoWeeksFromNow = currentDate + twoWeeks;

	if (reason == 'update') {
		var defaultShowsAdded = chrome.storage.sync.get("defaultShowsAdded", function(object){
		 	return object['defaultShowsAdded'];
		});

		// if (defaultShowsAdded instanceof Date && defaulShowsAdded > twoWeeksAgo) {

		// }
	}

  syncDefaultList()
  .then(vAPI.artAdder.getExhibition) // have we chosen a show?
  .then(function (exhibition) {
    // no
    if (!exhibition) {
      chrome.storage.sync.get('defaultShowData', function (feeds) {
        var rand = feeds.defaultShowData[Math.floor(feeds.defaultShowData.length * Math.random())].name
        vAPI.artAdder.exhibition(rand)
      })
    }
  })
	
}

// set default show list from add-art feed
function syncDefaultList() {
  var d = Q.defer()
  fetchFeed('http://add-art.org/feed/')
  .then(function (items) {
    items = items.filter(function (show) { return show.link !== '' && show.images !== '' })
    if (items.length > 0) {
      chrome.storage.sync.set({'defaultShowData': items}, d.resolve);
      chrome.storage.sync.set({'defaultShowsAdded': currentDate});
      chrome.storage.sync.set({'defaultShowsExpire': twoWeeksFromNow});
    }
  })
  return d.promise
}





