jQuery(function ($){
  var howMany = 3
  var tried = 0
  artAdder.getSelectors()
  .then(function (obj){
    var selectors = obj.selectors
    var host = R.path(['location', 'host'],parent)
    var skips = []
    if (host) {
      host = host.replace('www.', '') 
      if (obj.blockedSites.indexOf(host) > -1) return // this site is blocked

      skips = obj.whitelist
        .filter(R.pipe(R.nth(0), R.split(','), R.contains(host)))
        .map(R.nth(1))
    }
    ;(function checkIFrames() {
      var found = $(selectors.join(',')).each(function (){
        var $this = $(this)
        var successfulSkips = skips.filter(function (sel){
                                      return $this.is(sel)
                                    })
        if (successfulSkips.length > 0) {
          return
        }
        artAdder.processAdNode(this)
      })
      if (++tried < howMany) {
        setTimeout(checkIFrames, 3000)
      }
    })()
  })
})
