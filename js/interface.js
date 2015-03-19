chrome.storage.sync.get("defaultShowData", function(object) {
	if (!chrome.runtime.error) {
		console.log(object);
		addSubscriptions(object['defaultShowData']);
	}
});

var subscriptions = [];
function addSubscriptions(shows) {
	for(var i=0; i<shows.length; i++) {
		subscriptions.push(shows[i]);
		if(subscriptions.length == shows.length) {
			buildInterface(subscriptions);
		}
	}
}

function buildInterface(subs) {
	$shows = $('ul#shows');
	$showTemplate = $('ul#shows li.show');
	$infoPages = $('#infoPages');
	$infoPageTemplate = $('#infoPages .infoPage');

	for(var i = 0; i < subs.length; i++) {
	addModules(subs[i],i);
	if(i!=subs.length-1) {
	  $shows.append($showTemplate.clone());
	  $infoPages.append($infoPageTemplate.clone());
	} else {
	  $('body').removeClass('loading');
	}
	}

	$('#close').click(function() {
		$('header#top #close').removeClass('visible');
	  	$('.infoPage.opened').removeClass('opened');
	});	

}

function addModules(show, i) {
  var $square = $('ul#shows li.show').eq(i);
  $square.attr('data-title', show.title);
  $square.find('.thumb img').attr('src', show.thumbnail);

  $square.click(function() {
  	var title = $(this).attr('data-title');
  	$('header#top #close').addClass('visible');
  	$('.infoPage[data-title="' + title + '"').addClass('opened');
  });

  var $infoPage = $('.infoPage').eq(i);
  $infoPage.attr('data-title', show.title);
  $infoPage.find('h1.title').html(show.title);
  $infoPage.find('.date').html('Last updated on '+ show.date );
  $infoPage.find('.description').html(show.description);
  $infoPage.find('.link a').attr('href', show.link);
}