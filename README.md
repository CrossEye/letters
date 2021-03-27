Scott Sauyet's Letters to the Editor
====================================

This is a small app to house my letters to the editor.

I am one of those gadflies who regularly writes letters to the local weekly newspaper, covering mostly U.S. national policy discussions, an occasional local issues.

They are now hosted on GitHub pages, and available at http://letters.sauyet.com/ (and also at an alias, http://letters.fourwindssoft.com/, for reasons not worth explaining here.)

The actual letter text is in the [folder `content`][co] alongside some metadata.


Building
--------

This content is regenerated by a build step called by [the rebuild workflow][rb].  This calls the file [build.js][bu] which does two things:

- it parses all the files in the `content` folder, and generates a simple JS file [content.js][cn]

- it merges that file as well as the CSS and the main script in a copy of the [index file][in], [letters.html][ht], to offer a single-file version of the UI

Then the workflow checks these generated files back into the repository, and this main branch will now be served GitHub Pages.

  [bu]: ./build.js
  [cn]: ./content.js
  [co]: ./content
  [ht]: ./letters.html
  [in]: ./index.html
	[rb]: ./.github/workflows/rebuild.yml
