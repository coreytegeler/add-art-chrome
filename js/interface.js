chrome.storage.sync.get("defaultShowData", function(object) {
	if (!chrome.runtime.error) {
		console.log(object);
		insertSources(object['defaultShowData']);
	}
});

var port = chrome.extension.connect({ name : 'popup' })

var sources = [];
function insertSources(shows) {
	for(var i=0; i<shows.length; i++) {
		sources.push(shows[i]);
		if(sources.length == shows.length) {
			buildInterface(sources);
		}
	}
}

function buildInterface(sources) {
	$shows = $('ul#shows');
	$showTemplate = $('ul#shows li.show');
	$infoPages = $('#infoPages');
	$infoPageTemplate = $('#infoPages .infoPage');

	for(var i = 0; i < sources.length; i++) {
		addModules(sources[i],i);
		if(i!=sources.length-1) {
		  $shows.append($showTemplate.clone());
		  $infoPages.append($infoPageTemplate.clone());
		} else {
		  $('body').removeClass('loading');
		}
	}

	$('#close').click(function() {
		$('header#top #close').removeClass('visible');
	  	$('.infoPage.opened').removeClass('opened');
	  	$('#newSource').removeClass('opened');
	});	

	$('#addSource').click(function() {
		$('header#top #close').addClass('visible');
	  	$('#newSource').addClass('opened');
	});

}

function addModules(show, i) {
	console.log(show);
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

	$selectBtn = $infoPage.children('.selectSource');
	$selectBtn.attr('data-show', show.title);
	$selectBtn.click(event, selectSource);
}

function selectSource(event) {
	var selectedSource = $(event.currentTarget).attr('data-show');

  port.postMessage({ msg : { what : 'exhibition', exhibition : selectedSource }})
  self.close()
}
