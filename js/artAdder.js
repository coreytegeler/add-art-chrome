(function() {

  'use strict';

  /******************************************************************************/


  if (!vAPI) return

  vAPI.artAdder = {
    processAdNode : function (elem) {

      if (elem.offsetWidth < 1) return
      if (elem.offsetHeight < 1) return
      if (elem.tagName !== 'IFRAME' 
          && elem.tagName !== 'IMG'
          && elem.tagName !== 'OBJECT'
          && elem.tagName !== 'A'
          ) return

      var art = new Image
      art.style.width = elem.offsetWidth + 'px'
      art.style.height = elem.offsetHeight + 'px'
      art.style.display = 'block'
      art.src = chrome.extension.getURL('/images/970x90.png')
      elem.parentElement.appendChild(art)
      elem.parentElement.removeChild(elem)
      return true
    }

  }

})();


