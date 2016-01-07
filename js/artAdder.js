(function() {

  'use strict';

  /******************************************************************************/

  function getExt (filename) {
    return filename.match(/\.(.+)$/)[1].toLowerCase()
  }

  // returns a random image of said dimensions
  function getImgSrc(imgList, width, height) {
    var howMany = imgList.map(function (e) { return e.i }).filter(onlyUnique)
    var rand = ( Math.floor(howMany.length * Math.random()) + 1 ) + ''
    return imgList.reduce(function (acc, curr, i) {
      return curr.size === width + 'x' + height && curr.i === rand  ? curr.image : acc
    }, {})
  }

  function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
  }

  var currentExhibition;


  var artAdder = {
    replacedCount : '',
    processAdNode : function (elem) {

      var goodBye = false
      if (elem.offsetWidth < 2) goodBye = true 
      if (elem.offsetHeight < 2) goodBye = true 
      if (elem.tagName !== 'IFRAME' 
          && elem.tagName !== 'IMG'
          && elem.tagName !== 'OBJECT'
          && elem.tagName !== 'A'
          && elem.tagName !== 'INS'
          ) goodBye = true 

      if ($(elem).data('replaced')) goodBye = true 
      $(elem).data('replaced', true)
      if (goodBye) return

      if (artAdder.replacedCount === '') {
        artAdder.replacedCount = 1
      } else {
        artAdder.replacedCount++
      }

      var that = this
      artAdder.getExhibition()
      .then(function (exhibition) {
        var origW = elem.offsetWidth
        var origH = elem.offsetHeight
        var bestSize = that.askLink(origW, origH)

        var $wrap = $('<div>').css({
          width: origW,
          height: origH,
          position : 'relative',
          perspective : '1000px'
        })
        var $inner = $('<div>').css({
          width: '100%',
          height : '100%',
          position : 'absolute',
          transformStyle : 'preserve-3d',
          transform : 'translateZ(-'+(Math.ceil(origH/2))+'px)',
          transition : 'transform 0.5s'
        })

        var art  = document.createElement('a')
        art.href = exhibition.info.link 
        art.title = 'Replaced by Add-Art'
        art.style.width = ( origW - 4 ) + 'px'
        art.style.height = ( origH - 4 ) + 'px'
        art.style.display = 'block'
        art.style.position = 'absolute'
        art.style.background = "url(" + getImgSrc(exhibition.entries, bestSize[0], bestSize[1])  + ")"
        art.style.backgroundSize = "cover"
        art.style.backgroundRepeat = "no-repeat"
        art.style.webkitTransform = "rotateX(-90deg) translateZ("+Math.ceil(origH/2)+"px)"

        elem.style.webkitTransform = 'rotateY(0deg) translateZ('+(Math.ceil(origH/2))+'px)'
        elem.style.width = origW + 'px'
        elem.style.height = origH + 'px'
        elem.style.display = 'block'
        elem.style.position = 'absolute'

        var clone = $(elem).clone()
        $inner.append(art).append(clone)
        $wrap.append($inner)
        $(elem.parentElement).append($wrap)

        // rotate it
        setTimeout(function () {
          $inner.css('transform', "translateZ(-"+(Math.ceil(origH/2))+"px) rotateX(90deg)")
            setTimeout(function () {
              $(elem).remove()
              clone.remove()
            }, 500)
        }, 50)

      })
      return true
    },
    // download exhibition and store it
    exhibition : function (name) {

      var that = this
      this.fetchExhibition(name)
      .then(function (info) {
        zip.workerScriptsPath = '../js/lib/zip/'
        zip.createReader(new zip.HttpReader(info.images), function(reader) {

          // get all entries from the zip
          reader.getEntries(function(entries) {
            if (entries.length) {

              var imgEntries = entries
                .filter(function (entry) {

                  if (/__MACOSX/.test(entry.filename)) return false
                  if (/DS_Store/.test(entry.filename)) return false
                  if (/\.zip$/.test(entry.filename)) return false
                  if (entry.uncompressedSize < 1) return false


                  return true
                })
                .map(function (entry) {
                  var d = Q.defer()
                  entry.getData(new zip.Data64URIWriter(getExt(entry.filename)), function(uri) {
                    entry.image = uri 
                    d.resolve(entry)
                  })
                  return d.promise
                })
               Q.all(imgEntries)
               .then(function (entries) {
                 reader.close(); // close the zip reader

                 var finalEntries = entries.map(function (entry) {
                   return {
                     i : entry.filename.match(/images\/([0-9]+)/)[1],
                     filename : entry.filename,
                     image : entry.image,
                     size : entry.filename.match(/images\/[0-9]+artbanner([^.]+)\./)[1]
                   }
                 })
                 var exhibition = {
                   info : info,
                   entries : finalEntries
                 }
                 that.setExhibition(exhibition)
               })
               .done()
            }
          });
        }, function(error) {
          // onerror callback
        });
      })
    },
    fetchExhibition : function (name) {
      var feed = 'http://add-art.org/category/' + name.replace(/ /g, '-') + '/feed/';
      return fetchFeed(feed)
      .then(function (items) {
        return items[0]
      })
    },
    setExhibition : function (exhibition) {
      currentExhibition = Q(exhibition)
      artAdder.localSet('exhibitionUpdated', Date.now())
      return artAdder.localSet('exhibition', exhibition)
    },
    getExhibition : function () {
      if (currentExhibition) return currentExhibition
      var d = Q.defer()
      artAdder.localGet('exhibition')
      .then(function (exhibition) {
        currentExhibition = Q(exhibition.exhibition)
        d.resolve(exhibition.exhibition)
      })
      return d.promise
    },
    chooseMostRecentExhibition : function () {
      artAdder.localGet('defaultShowData')
      .then(function (feeds) {
        var latest = feeds.defaultShowData[0].title
        artAdder.exhibition(latest)
      })
    },
    // abstract storage for different browsers
    localSet : function (key, thing) {
      var d = Q.defer()
      if (typeof chrome !== 'undefined') {
        var save = {}
        save[key] = thing
        chrome.storage.local.set(save, d.resolve)
      }
      return d.promise
    },
    localGet : function (key) {
      var d = Q.defer()
      if (typeof chrome !== 'undefined') {
        chrome.storage.local.get(key, d.resolve)
      }
      return d.promise
    },

    /*  from original add-art */
    loadImgArray : function() {
      this.ImgArray = new Array();
      // taken from: https://en.wikipedia.org/wiki/Web_banner
      // 19 images sizes total

      // Rectangles
      this.ImgArray.push( [ 336, 280 ] ); // Large Rectangle
      this.ImgArray.push( [ 300, 250 ] ); // Medium Rectangle
      this.ImgArray.push( [ 180, 150 ] ); // Rectangle
      this.ImgArray.push( [ 300, 100 ] ); // 3:1 Rectangle
      this.ImgArray.push( [ 240, 400 ] ); // Vertical Rectangle

      // Squares
      this.ImgArray.push( [ 250, 250 ] ); // Square Pop-up

      // Banners
      this.ImgArray.push( [ 720, 300, ] ); // Pop-Under
      this.ImgArray.push( [ 728, 90, ] ); // Leaderboard
      this.ImgArray.push( [ 468, 60, ] ); // Full Banner
      this.ImgArray.push( [ 234, 60, ] ); // Half Banner
      this.ImgArray.push( [ 120, 240 ] ); // Vertical Banner

      //Buttons
      this.ImgArray.push( [ 120, 90 ] ); // Button 1
      this.ImgArray.push( [ 120, 60 ] ); // Button 2
      this.ImgArray.push( [ 88, 31 ] ); // Micro Bar
      this.ImgArray.push( [ 88, 15 ] ); // Micro Button
      this.ImgArray.push( [ 125, 125 ] ); // Square Button

      //Skyscrapers
      this.ImgArray.push( [ 120, 600 ] ); // Standard Skyscraper
      this.ImgArray.push( [ 160, 600 ] ); // Wide Skyscraper
      this.ImgArray.push( [ 300, 600 ] ); // Half-Page

    },
    askLink : function(width, height) {
      // Find this.ImgArray with minimal waste (or need - in this case it will be shown in full while mouse over it) of space
      var optimalbanners = null;
      var minDiff = Number.POSITIVE_INFINITY;
      for ( var i = 0; i < this.ImgArray.length; i++) {
          var diff = Math.abs(width / height - this.ImgArray[i][0] / this.ImgArray[i][1]);
          if (Math.abs(diff) < Math.abs(minDiff)) {
              minDiff = diff;
              optimalbanners = [ i ];
          } else if (diff == minDiff) {
              optimalbanners.push(i);
          }
      }

      var optimalBanner = [];
      minDiff = Number.POSITIVE_INFINITY;
      for (i = 0; i < optimalbanners.length; i++) {
          var diff = Math.abs(width * height - this.ImgArray[optimalbanners[i]][0] * this.ImgArray[optimalbanners[i]][1]);
          if (diff < minDiff) {
              minDiff = diff;
              optimalBanner = [ optimalbanners[i] ];
          } else if (diff == minDiff) {
              optimalBanner.push(optimalbanners[i]);
          }
      }
      return this.ImgArray[optimalBanner[Math.floor(Math.random() * optimalBanner.length)]];
    }

  }

  
  artAdder.loadImgArray() // loadImgArray

  if (typeof vAPI !== 'undefined') vAPI.artAdder = artAdder
  else window.artAdder = artAdder
  
})();


