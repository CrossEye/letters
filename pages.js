const pages = [
  {
    "Title": "About",
    "Slug": "about",
    "Sort Order": 1,
    "Content": "<h1 id=\"about-this-site\">About this Site</h1>\n<p>I am one of those gadflies who writes often to the local weekly paper. I&#39;ve been\ndoing it for years.  This page is collecting those letters for posterity.  At\nthe moment, the letters from 2007 to the present are included.  I will add more\nas I find time (and, often, as I find the letters themselves.)</p>\n<!-- subtitute: currentLetter -->\n\n<h2 id=\"notes\">Notes</h2>\n<p>I&#39;m a politically-involved, progressive citizen with strong opinions. That comes\nthrough in those letters.  I have covered topics such as <a href=\"#/topic/Global+Warming/\">Global Warming</a>,\nthe ideas of <a href=\"#/topic/Progressivism/\">Progressivism</a>, <a href=\"#/topic/Fact+Checking/\">Fact Checking</a>, the presidency of\n<a href=\"#/topic/Donald+Trump/\">Donald Trump</a>, as well as <a href=\"#/topics/\">many others</a>.</p>\n<p>I do try to include a modicum of humor in many of these letters.  But please\nremember that I am serious, that I think the issues discussed are often very\nimportant, the local ones, the national ones, and the global ones.</p>\n<p>Although I have in the past served in the local government of Andover,\nConnecticut (on the Board of Education, the Capital Improvements and Planning\nCommission, the town Website Committee as well as the Democratic Town\nCommittee), all of the letters here represent my own views and not those of\nthese organizations.</p>\n<p>These are letters as submitted to the paper.  The titles are what I gave them,\nnot the headers supplied by the <em>Rivereast</em>.  The dates are the dates I\nwrote them, not the issue date in which they appeared.  A few were never\npublished, and I never did try to determine why.  There may have been mild\nediting by the <em>Rivereast</em> so that these don&#39;t exactly match what was\npublished, but that&#39;s rare, and it never changes the meaning.</p>\n<p>Feel free to <a href=\"mailto:scott@sauyet.com\">email me</a> with any comments or suggestions.</p>\n<p>Details of how this is built are on the <a href=\"#/pages/technical\">technical page</a>.</p>\n"
  },
  {
    "Title": "Technical details",
    "Slug": "technical",
    "Content": "<h1 id=\"technical-details\">Technical Details</h1>\n<p>This site is an experiment.  I&#39;m a computer programmer, and have over the years\nsometimes specialized in building web applications, but for some time now I\nhave only built web sites / web applications to the specifications of others.</p>\n<p>I was looking for a quick project to get my hands back in the entirety of web\ndevelopment, when another Rivereast letter-writer pointed to his website which\nincluded copies of his letters.  That sounded like the start of a good project\nfor me, since I have published many dozens of letters.  This has grown from\nthat concept.</p>\n<h2 id=\"the-code\">The Code</h2>\n<p>The code is stored on <a href=\"https://github.com/CrossEye/letters\">GitHub</a> and served through <a href=\"https://pages.github.com/\">GitHub Pages</a>.  A\nsimple <a href=\"https://github.com/CrossEye/letters/blob/main/.github/workflows/rebuild.yml\">GitHub Action</a> rebuilds the static site.  There is no back end and\nthis is one step beyond a single-page app, as it&#39;s actually able to be served as\na single file, <a href=\"/letters.html\">letters.html</a>, although it&#39;s <a href=\"https://github.com/CrossEye/letters/blob/main/index.html\">usually viewed</a> as a\nstandard HTML file with links to separate CSS and JS files.</p>\n<p>The main content, the letters, are stored in the <a href=\"https://github.com/CrossEye/letters/tree/main/content/letters\">content directory</a> in files\nformatted like this:</p>\n<blockquote>\n<pre><code>\nTitle: A Simple Description\nDate: 2020-10-19\nTopics: Donald Trump, [More Topics]\nPeople: [Comma-separated list of people mentioned]\nContent:\n----------------------------------------------------------------------------\n\nNarcissist, con artist, tax evader, pathological liar, cheat, bully, adulterer,\nfraud, egomaniac, hate-monger, misogynist, xenophobe.\n\nYou don't need to know anything about me to know who I'm describing.\n\nSo why in the world would you consider voting for him?\n\n----------------------------------------------------------------------------\n</code></pre>\n</blockquote>\n<p>This site is built by calling <a href=\"https://github.com/CrossEye/letters/blob/main/build.js\">build.js</a>, which parses those files (as well as\nthose in the <a href=\"https://github.com/CrossEye/letters/tree/main/content/pages\">pages folder</a>) turning them into <code>content.js</code> (and <code>pages.js</code>).\nThese are merged alongside the CSS, the main JS, and the themes into <code>index.html</code>,\ncreating that stand-alone <code>letters.html</code> file.</p>\n<h2 id=\"application-design\">Application Design</h2>\n<p>Since this is mainly for myself, I was willing to make this a JS-only site.  If\nit were to expand toward a more general static site generation tool (unlikely,\nbut possible), I would have to include some server-side generation, especially\nif SEO was a real concern.  I&#39;m simply happy not to have to do this at the\nmoment.</p>\n<p>Although <a href=\"https://github.com/CrossEye/letters/blob/main/themes.js\"><code>themes.js</code></a> includes a little bit of code, at the moment, almost\nthe entire logic is contained in <a href=\"https://github.com/CrossEye/letters/blob/main/process.js\"><code>process.js</code></a></p>\n<p>With the exception of a few static pages, everything is generated on the fly by\nthe JS, based on the data stored in <a href=\"/content.js\"><code>content.js</code></a>.</p>\n<h2 id=\"web-design\">Web Design</h2>\n<p>I am not a graphical designer.  Note even close.</p>\n<p>I&#39;ve tried to make an aestheically pleasing site, and offer multiple color\nschemes for two reasons: one because my own tastes are probably not shared by\nmany, and two, because I wanted to play around with CSS variables, which I\nhaven&#39;t had the time to do recently.  The actual color schemes (except for\n<em>Mellow Yellow</em>, which I made years ago) are shamelessly ripped off from sites\naround the web.  I can&#39;t give credit as there aren&#39;t single sources for any of\nthem.  I&#39;m pretty happy with the default theme, <em>I Feel the Earth Move</em>, and\nsomewhat satisfied with <em>Purple Haze</em>.  The others I have varying degrees of\nfrustration with.</p>\n<p>The rest of the visual design: layout, typography, and so on, feels fairly\nnatural to me, but as I said, I am not a graphical designer.</p>\n<p>There is not much obvious interactivity here.  The only actions outside of\n&quot;page&quot; navigation is search and theme switching.  Search still needs a bit\nof work as it right now only finds exact matches.  I&#39;m very happy with the\ntheme switching, though, and it gave me the chance to combine theme switching\nwith dynamic SVGs.</p>\n<h2 id=\"feedback\">Feedback</h2>\n<p>I&#39;d love to hear any feedback of a technical nature, suggestions for the code,\nbetter UX or graphical designs, or anything else.  Feel free to <a href=\"mailto:scott@sauyet.com\">email me</a>\nor to raise a <a href=\"https://github.com/CrossEye/letters/issues/new\">new issue</a> or <a href=\"https://github.com/CrossEye/letters/issues/new\">pull request</a>.</p>\n<p>Thank you to <a href=\"https://github.com/buzzdecafe\">Mike H</a> for helpful feedback already given!</p>\n"
  }
]