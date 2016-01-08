jQuery(function ($){
  var howMany = 3
  var tried = 0
  ;(function checkIFrames() {
    $('iframe[id^=google_ads],ins.adsbygoogle,ins[id^=aswift]').each(function (){
      artAdder.processAdNode(this)
    })
    if (++tried < howMany) {
      setTimeout(checkIFrames, 3000)
    }
  })()
})
