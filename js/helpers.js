function cleanDate(date) {
	var dateObj = new Date(date);
	var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var day = dateObj.getDate();
	var month = months[dateObj.getMonth()];
	var year = dateObj.getUTCFullYear();
	var date = month + ' ' + day + ', ' + year;
	return date;
}

function stripHTML(html) {
    return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '');
}

function stripCDATA(html) {
    return html.replace('<![CDATA[','').replace(']]>','');
}

//parses through a show's RSS data to get content that populates the interface
function parseRSS(rss) {
	var item = rss.getElementsByTagName('item')[0]
  return parseItemRss(item)
}

function parseAllRSS(rss){
  return [].slice.call(rss.getElementsByTagName('item')).map(parseItemRss)
}

function parseItemRss (item) {
	var get = function(type) {
		return item.getElementsByTagName(type)[0].innerHTML;
	};

	var title = get('title');
	var description = stripCDATA(get('encoded'));
	var thumbnail = get('thumbnail');
	var images = get('artshow');
	var date = cleanDate(get('pubDate'));
	var link = get('showurl');

	var showObject = {
		'title' : title,
		'description' : description,
		'thumbnail' : thumbnail,
		'images' : images,
		'date' : date,
		'link' : link
	};

	return showObject
}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function fetchFeed (url) {
  var d = Q.defer()
  $.get(url, function (rss) {
     d.resolve(parseAllRSS(rss))
  })
  return d.promise
}
