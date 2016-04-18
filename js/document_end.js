jQuery(function ($){
  var howMany = 3
  var tried = 0
  artAdder.getSelectors()
  .then(function name(selectors){
    ;(function checkIFrames() {
      var found = $(selectors.join(',')).each(function (){
        artAdder.processAdNode(this)
      })
      if (++tried < howMany) {
        setTimeout(checkIFrames, 3000)
      }
    })()
  })
})
