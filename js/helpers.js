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