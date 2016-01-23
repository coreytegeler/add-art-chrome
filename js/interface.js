
artAdder.localGet('defaultShowData')
.then(function (object) {
  insertSources(object['defaultShowData']);
})


var currentExhibition

function insertSources(shows) {
  artAdder.getExhibition()
  .then(function (exhibition) {
    currentExhibition = exhibition
    buildInterface(shows)
  })
}

function buildInterface(sources) {
	$shows = $('ul#shows');
	$showTemplate = $('ul#shows li.show');
	$infoPages = $('#infoPages');
	$infoPageTemplate = $('#infoPages .infoPage');
  $('body').addClass('loading')

	for(var i = 0; i < sources.length; i++) {
		addModules(sources[i],i);
    $shows.append($showTemplate.clone());
    $infoPages.append($infoPageTemplate.clone());
	}
  $('#shows li.show:last').remove() // sort of a strange way to do this, so we need to remove the last one

  $('body').removeClass('loading');


	$('#close').click(function() {
		$('header#top #close').removeClass('visible');
	  	$('.infoPage.opened').removeClass('opened');
	  	$('#newSource').removeClass('opened');
	});	

	$('#addSource').click(function() {
		$('header#top #close').addClass('visible');
	  	$('#newSource').addClass('opened');
	});
	$('body').on('click', '.selectSource', function(){
    var selectedSource = $(this).attr('data-show');
    chrome.runtime.sendMessage({ msg : { what : 'exhibition', exhibition : selectedSource }})
    self.close()
  });

}

function addModules(show, i) {
	var $square = $('ul#shows li.show').eq(i);
	$square.attr('data-title', show.title);
	$square.find('.thumb img').attr('src', show.thumbnail);
  $square.removeClass('active')

  if (currentExhibition === show.title) { 
    $square.addClass('active')
  }

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
}

