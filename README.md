![REPLACED!](images/cover.gif)

# Add-Art

Chrome (and now Firefox) development of the [add-art][2] extension. Feel free to [fork][3] and contribute.

The extension is currently functional for [Chrome](https://chrome.google.com/webstore/detail/add-art/jplogjalofjlkendelkacpekloflkfeg) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/add-art/)

We'd love for you to help with this.

1. Work on an [issue](https://github.com/coreytegeler/add-art-chrome/issues)
2. Test. Then create an issue of your own

[How to load source code of extension in the browser for testing.](https://developer.chrome.com/extensions/getstarted#unpacked)

#### How it currently works

An "essay" (or exhibition) within add-art is simply a JSON file. [This repo](https://github.com/owise1/addendum-exhibitions) lays out an essay's JSON schema.  

Kadist's [Addendum](http://addendum.kadist.org/) visual essays ship with the extension. The configuration for those essays are kept [here](https://github.com/owise1/addendum-exhibitions). 

Users can also create their own essays on the [add-art site](http://add-art.org/essays/).  They receive a link to the JSON for the essay and can use it to import the show into their extension.

[1]: http://visitsteve.com
[2]: https://add-art.org/
[3]: https://github.com/coreytegeler/Add-Art-chrome/fork
