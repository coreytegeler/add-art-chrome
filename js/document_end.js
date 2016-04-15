jQuery(function ($){
  var howMany = 3
  var tried = 0
  ;(function checkIFrames() {
    var selectors = [
      'iframe[id^=google_ads]',
      'div[id^=google_ads]',
      'iframe[src*=serving-sys]',
      'ins.adsbygoogle',
      'ins.addendum',
      'ins[id^=aswift]',
      'img[src*=decknetwork]'
    ]
    $(selectors.join(',')).each(function (){
      console.log(this);
      artAdder.processAdNode(this)
    })
    if (++tried < howMany) {
      setTimeout(checkIFrames, 3000)
    }
  })()
})
