jQuery(function ($){
  var howMany = 3
  var tried = 0
  ;(function checkIFrames() {
    console.log('here')
    $('iframe[id^=google_ads_iframe]').each(function (){
      artAdder.processAdNode(this)
    })
    if (++tried < howMany) {
      setTimeout(checkIFrames, 3000)
    }
  })()
})
