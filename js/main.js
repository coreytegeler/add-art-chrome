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

	if (reason == 'install') {
		syncDefaultList();	
	}
	else if (reason == 'update') {
		var defaultShowsAdded = chrome.storage.sync.get("defaultShowsAdded", function(object){
		 	return object['defaultShowsAdded'];
		});

		// if (defaultShowsAdded instanceof Date && defaulShowsAdded > twoWeeksAgo) {

		// }
	}
  // have we chosen a show?
  vAPI.artAdder.getExhibition()
  .then(function (exhibition) {
    // no
    if (!exhibition) {
      chrome.storage.sync.get('defaultFeeds', function (feeds) {
        var rand = feeds.defaultFeeds[Math.floor(feeds.defaultFeeds.length * Math.random())].name
        vAPI.artAdder.exhibition(rand)
      })
    }
  })
	
}


//loops through default shows to access RSS data
defaultFeeds = [];
function syncDefaultList() {
	for(var i = 0; i < defaultSources.length; i++) {
		var source = defaultSources[i];
		var feed = 'http://add-art.org/category/' + source + '/feed/';
		var showObj = {
			name: source,
			feed: feed
		};
		defaultFeeds.push(showObj);

		if(i == defaultSources.length - 1) {
			chrome.storage.sync.set({'defaultFeeds': defaultFeeds});
			chrome.storage.sync.set({'defaultShowsAdded': currentDate});
			chrome.storage.sync.set({'defaultShowsExpire': twoWeeksFromNow});
			requestFeeds();
		}
	}
}

defaultShowData = [];
function requestFeeds() {
	chrome.storage.sync.get("defaultFeeds", function(object){
		defaultShows = object['defaultFeeds'];
		var count = defaultShows.length;
		$.each(defaultShows, function(i, feed) {
			console.log(i, feed);
			feed = feed.feed;
			$.get(feed, function(rss) {
				var parsedData = parseRSS(rss);
				defaultShowData.push(parsedData);
				chrome.storage.sync.set({'defaultShowData': defaultShowData});
			});
		});
	});
}





