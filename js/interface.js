$(function() {
  var defaultShowData = chrome.storage.sync.get("defaultShowData", function(object){
    console.log(object['defaultShowData']);
  });
});


// var subscriptions = [];

// //needs to be triggered
// function addSubscriptions(shows,count) {
//   subscriptions.push(shows);
//   if(subscriptions.length == count) {
//     buildInterface(subscriptions);
//   }
// }

// function buildInterface(subs) {
//   var $shows = $('ul#shows');
//   var $showTemplate = $('ul#shows li.show');
//   for(var i = 0; i < subs.length; i++) {
//     addSub(subs[i],i);
//     if(i!=subs.length-1) {
//       $shows.append($showTemplate.clone());
//     } else {
//       $('body').removeClass('loading');
//     }
//   }
// }

// function addSub(show,i) {
//   var $row = $('ul#shows li.show').eq(i);
//   $row.find('h1.title').html(show.title);
//   $row.find('.date').html('Last updated on '+ show.date );
//   $row.find('.thumb img').attr('src', show.thumbnail);
// }


