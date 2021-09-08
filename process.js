// Utility functions
const always = (x) => () => x
const call = (fn, ...args) => fn (args)
const chain = (fn) => (xs) => xs .flatMap (fn)
const chooseIndex = (xs, tot = 0) => 
  xs .map ((x) => [x, tot += x [1]]) .findIndex (((r = tot * Math .random ()) => ([, w]) => w >= r)())
const clamp = (min, max) => (n) => Math .min (Math .max (min, n), max)
const countBy = (fn) => (xs) =>
  xs .reduce ((a, x) => (fn (x) || []) .reduce ((a, v) => ((a[v] = (a[v] || 0) + 1), a), a), {})
const equals = (s1) => (s2) => s1 === s2
const excluding = (i) => (xs) => 
  [... xs .slice (0, i), ... xs .slice (i + 1)]
const findAllIndices = (x) => (xs, pos = 0, idx = xs .indexOf (x, pos)) =>
  idx == -1 ? [] : [idx, ...findAllIndices (x) (xs, idx + 1)]
const firstParas = (text, TeaserParagraphs = 1) => 
  text.slice(0, nthIndexOf (Number(TeaserParagraphs), '</p>')(text) + 4) 
const getYear = ({Date}) => Date .slice (0, 4)
const groupBy = (fn) => (xs) => Object .entries (xs .reduce (
  (a, x) => call ((key) => ((a[key] = a[key] || []), (a [key] .push (x)), a), fn(x)), {}
))
const hasId = (id) => (target) => !!target .closest (`#${id}`)
const head = (xs) => xs[0]
const identity = (x) => x
const last = (xs) => xs [xs .length - 1]
const longDate = ((months) => (ds) => 
  `${months[Number(ds.slice(5, 7) - 1)]} ${Number(ds.slice(8,10))}, ${ds.slice(0, 4)}`
) (['January', 'February', 'March', 'April', 'May', 'June', 'July',  'August', 'September', 'October', 'November', 'December']) 
const matches = (regex) => (str) => regex .test (str)
const noop = () => {}
const nRandom = (n, [x, ...xs]) =>
  n == 0 ? [] : Math.random() < n / (xs.length + 1) ? [x, ... nRandom (n - 1, xs)] : nRandom (n, xs)
const nthIndexOf = (n, sub) => (s, idx = s .indexOf (sub)) =>
  n <= 1 ? idx : nthIndexOf (n - 1, sub) (s.slice(idx + sub.length)) + idx 
const oxfordJoin = (xs) =>
  xs .length == 0 ? '' : xs .length == 1 ? xs[0]: xs.length == 2 ? xs .join (' and ') : [xs.slice(0, -1).join(', '), last(xs)] .join(', and ')
const prop = (p) => (o) => o[p]
const pluralize = (singular, plural) => (n) => n == 1 ? singular : plural
const randomInt = (a, b) => Math.floor((b - a) * Math.random() + a)
const shortDate = (ds) =>  
  `${Number(ds.slice(5, 7))}/${Number(ds.slice(8,10))}/${ds.slice(2, 4)}`
const sortBy = (fn) => (xs) => xs.sort ((a, b, aa = fn(a), bb = fn(b)) => aa < bb ? -1 : aa > bb ? 1 : 0)
const split = (sep) => (s) => s.split(sep)
const startsWith = (prefix) => s => s .startsWith (prefix)
const today = (date = new Date()) => `${
  String(date .getFullYear ()) .padStart (4, '0')}-${
  String(date .getMonth () + 1) .padStart (2, '0')}-${
  String(date .getDate ()) .padStart (2, '0')}`
const weightedRandom = (n) => (xs, i = chooseIndex (xs)) => 
  n == 0 ? [] : [xs[i], ...weightedRandom (n - 1) (excluding (i) (xs))]


// Helper functions
const returnHome = () => document.location.hash = '#/'

const topicSort = ([a, x], [b, y]) => 
  y - x || (a < b ? -1 : a > b ? 1 : 0)
const personSort = ([a, x], [b, y], aa = last (a.split(' ')), bb = last (b.split(' '))) => 
  y - x || (aa < bb ? -1 : aa > bb ? 1 : 0)

const alphaTopicSort = ([a], [b]) =>
  a < b ? -1 : a > b ? 1 : 0 
const alphaPersonSort = ([a], [b], aa = last (a.split(' ')), bb = last (b.split(' '))) => 
  aa < bb ? -1 : aa > bb ? 1 : 0

const gather = (name, content, sorter=topicSort) =>
  Object.entries (countBy (prop (name)) (content)) .sort (sorter)

const makeLink = (type) => ([t, c]) => 
  `<li><a href="#/${type}/${t.replace(/ /g, '+')}/">${t} <span class="extra">(${c}&nbsp;letter${c > 1 ? 's' : ''})</span></a></li>`
const letterLink = ({Date, Title}) =>
  `<li><a href="#/${Date}/">${Title} <span class="extra">(${shortDate(Date)})</span></a></li>`
const makeTopicLink = (Topic) =>
  `<a href="#/topic/${Topic.replace(/ /g, '+')}/">${Topic}</a>`
const makeTopicListLink = (Topic) =>
  `<li>${makeTopicLink(Topic)}</li>`


// Sidebar Setup
const makeSidebarButtons = (themes, theme, defaultTheme) =>
  `<p id="searchWidget">
  <button id="swb" type="button" title="Search">\u2315</button>
  <button id="thm" type="button" title="Change Theme">${themes.icons[theme] || themes.icons[defaultTheme]}</button>
  <button id="cls" type="button" title="Close Menu">×</button>
  </p>`

const makeRecentSidebarLetters = (
  content,
  lettersAboveFold,
  recentLetters = content .slice (0, lettersAboveFold),
) =>
  `<details open>
  <summary>Recent</summary>
  <ul>
      ${recentLetters .map (letterLink) .join ('\n')}
  </ul>
  </details>
`

const makeOlderSidebarLetters = (
  content,
  lettersAboveFold,
  yearsAboveFold,
  years = groupBy (getYear) (content .slice (lettersAboveFold)) .sort (([a], [b]) => b - a),
  initialYears = years .slice (0, yearsAboveFold),
  laterYears = years .slice (yearsAboveFold),
) => 
  `<details>
  <summary>Older</summary>
  ${initialYears .map (([year, letters]) => `<details>
    <summary>${year}</summary>
    <ul>
      ${letters .map (letterLink) .join ('\n')}
    </ul>
  </details>`).join ('\n')}
  ${laterYears.length > 0
    ? `<details>
      <summary>More...</summary>
      ${laterYears .map (([year, letters]) => `    <h4>${year}</h4>
        <ul>
          ${letters .map (letterLink) .join ('\n')}
        </ul>`).join ('\n    ')}
      </details>` 
    : ``
  }
  </details>`

const makeSidebarPages = (pages) =>
  `<h3><a href="#/">Home</a></h3>
  ${pages 
    .filter (p => 'Sort Order' in p)
    .sort (({'Sort Order': a}, {'Sort Order': b}) => a - b)
    .map (({Title, Slug}) => `<h3><a href="#/pages/${Slug}/">${Title}</a></h3>`) .join ('\n')
  }`

const makeSidebarLetters = (
  content,
  lettersAboveFold,
  yearsAboveFold,
) =>
  `<h3><a href="#/letters/">Letters</a></h3>
  ${makeRecentSidebarLetters(content, lettersAboveFold)}
  ${makeOlderSidebarLetters(content, lettersAboveFold, yearsAboveFold)}`

const makeSidebarSeries = (
  content,
  series = [... new Set (content .map (prop ('Series')) .filter (Boolean))]
) =>
  `<h3><a href="#/series/">Series</a></h3>
   <ul>
     ${series .map (s => `<li><a href="#/series/${s .replace (/ /g, '+')}/">${s}</a></li>`) .join ('\n')}
   </ul>`

const makeSidebarTopics = (
  content,
  topicsAboveFold,
  topics = gather ('Topics', content, topicSort)
) =>
  `<h3><a href="#/topics/">Topics</a></h3>
  <ul>
  ${topics .slice (0, topicsAboveFold) .map (makeLink ('topic')) .join ('\n')}
  </ul>
  ${topics.length > topicsAboveFold ? `<details class="more">
      <summary>More...</summary>
      <ul>
          ${topics .slice (topicsAboveFold) .map (makeLink ('topic')) .join ('\n')}
      </ul>
  </details>` : ``}`

const makeSidebarPeople = (
  content,
  peopleAboveFold,
  people = gather ('People', content, personSort)
) => 
  `<h3><a href="#/people/">Other Letter Writers</a></h3>
  <ul>
    ${people .slice (0, peopleAboveFold) .map (makeLink ('person')) .join ('\n')}
  </ul>
  ${people.length > peopleAboveFold 
    ? `<details class="more">
        <summary>More...</summary>
        <ul>
          ${people .slice (peopleAboveFold) .map (makeLink ('person')) .join ('\n')}
        </ul>
      </details>` 
    : ``
  }`

const makeSidebar = (
  content,
  pages,
  themes, 
  {lettersAboveFold = 5, yearsAboveFold = 3, topicsAboveFold = 8, peopleAboveFold = 4, theme, defaultTheme}
) => 
  `<div id="sidebar" class="sidebar box">
    ${makeSidebarButtons (themes, theme, defaultTheme)}
    ${makeSidebarPages (pages)}
    ${makeSidebarLetters (content, lettersAboveFold, yearsAboveFold)}
    ${makeSidebarSeries (content)}
    ${makeSidebarTopics (content, topicsAboveFold)}
    ${makeSidebarPeople (content, peopleAboveFold)}
  </div>`


// Letter Route
const makeLetterBody = ({Title, Topics = [], Date, Content, Series = ''}) =>
  `<h2>${Title}</h2>
  ${Series ? `<p class="series">(Part of the series "<a href="#/series/${Series .replace (/ /g, '+')}/">${Series}</a>")</p>` : ``}
  ${Topics.length 
    ? `<ul class="topics">
        ${Topics .map (topic => `<li><a href="#/topic/${topic .replace (/ /g, '+')}/">${topic}</a></li>`) .join ('\n    ')}
      </ul>` 
    : ``
  }
  <p class="letter-date">${longDate(Date)}</p>
  <p class="salutation">
    To The Editor:
  </p>
  ${Content}
  <p class="signature"> -- Scott Sauyet</p>`

const makeLetterNav = (
  contents,
  letter,
  prev = letter && contents [contents .indexOf (letter) + 1],
  next = letter && contents [contents .indexOf (letter) - 1]
) => 
  `<nav>
    ${prev ? `<a class="prev" title="${shortDate (prev .Date)}" href="#/${prev .Date}/">◄</a>` : ``}
    ${next ? `<a class="next" title="${shortDate (next .Date)}" href="#/${next .Date}/">►</a>` : ``}
  </nav>`

const makeLetterNote = ({Note = ''}) =>
  Note ? `<div class="note"><h4>Note</h4>${Note}</div>` : ``

const formatLetter = (content, hash, letter) =>
  letter
    ? `${makeLetterNav (content, letter)}
       ${makeLetterBody (letter)}
       ${makeLetterNote (letter)}
    ` 
    : `<h2>Not Found</h2>
      <p>No letter found for ${longDate(hash.slice(2, -1))}`

const makeLetter = (lookups) => (content, hash) => 
  `<div class="main box">${formatLetter (content, hash, lookups [hash .slice (2, -1)])}</div>`

const makeCurrent = (content) => 
  formatLetter (content, content [0])


// Page Route
const makePage = (pages) => (
  content, 
  hash,
  slug = hash .slice (8, -1) .replace (/\+/g, ' '),
  {Title, Content} = pages .find (({Slug}) => Slug == slug)
) => `<div class="main box">${Content}</div>`
      

// Topic Route
const makeTopic = (
  content, 
  hash,
  topic = hash .slice (8, -1) .replace (/\+/g, ' '),
  letters = content .filter (({Topics}) => Topics .includes (topic))
) => 
  `<div class="main box"><h1>Letters with topic "${topic}"</h1>
  <ul class="long">
    ${letters .map (({Date, Title}) => 
      `<li><a href="#/${Date}/">${Title} <span class="extra">(${shortDate (Date)})</span></a></li>`
    ) .join ('\n')}
  </ul></div>`


// Person Route
const makePerson = (
  content, 
  hash,
  person = hash .slice (9, -1) .replace(/\+/g, ' '),
  letters = content .filter (({People}) => People .includes (person))  
) => 
  `<div class="main box"><h1>Letters mentioning ${person}</h1>
  <ul class="long">
    ${letters .map (letter => 
      `<li><a href="#/${letter .Date}/">${letter .Title} <span class="extra">(${shortDate (letter .Date)})</span></a></li>`
    ) .join ('\n')}
  </ul></div>`


// Topics Route
const makeTopics = (content) => 
  `<div class="main box"><h1>All Topics</h1>
    <ul class="long">
      ${gather ('Topics', content, alphaTopicSort) .map (makeLink ('topic')) .join ('\n')}
    </ul></div>`


// People Route
const makePeople = (content) => 
  `<div class="main box"><h1>All Letter Writers</h1>
  <ul class="long">
    ${gather ('People', content, alphaPersonSort) .map (makeLink ('person')) .join ('\n')}
  </ul></div>`


// Letters Route
const makeLetters = (content) => 
  `<div class="main box"><h1>All Letters</h1>
  ${groupBy (({Date}) => Date .slice (0, 4)) (content) .sort (([a], [b]) => b - a) .map (([Year, letters]) =>
    `<h3>${Year}</h3>
     <ul class="long">
        ${letters .map (letterLink) .join ('\n')}
     </ul>`  
  ) .join('\n')}</div>`


// Series Route
const makeSeries = (
  content,
  hash,
  series = groupBy (prop ('Series')) (content .filter (({Series = ''}) => Series))
) =>
  `<div class="main box">
    <h1>Letter Series</h1>${series .map (([Series, letters]) => 
      `<h3>${Series}</h3>
       <ul class="long">
         ${letters .reverse () .map (letterLink) .join ('\n')}
       </ul>`)}
    </div>`

const makeSingleSeries = (
  content,
  hash,
  series = hash .slice (9, -1) .replace (/\+/g, ' '),
  letters = content .filter (({Series}) => Series == series)
) =>
  `<div class="main box">
     <h1>Series "${series}"</h1> 
     ${letters .reverse () .map (letterLink) .join ('\n')}
   </div>`
    
// Themes Route
const chooseTheme = (themes) => (name) => {
  themes .choose (name);
  localStorage .setItem (
    'letters', 
    JSON .stringify ({...JSON .parse (localStorage .getItem ('letters')), theme: name})
  )
  document.getElementById('thm').innerHTML = themes.icons[name]
  document .location .hash = 
    document .location .hash 
      .slice (document .location .hash .slice (1) .indexOf('#') + 1) 
    || '#/'
}

const themeClicked = (themes) => (e) => {
  chooseTheme (themes) (decodeURIComponent (e .target .closest ('.themes button') .dataset .theme))
}

const themesFocus = () =>
  document .querySelector ('div.themes button') .focus()

const makeThemeSwitcher = (themes) => () => 
  `<div class="main box"><h1>Choose Theme</h1><div class="themes">
  ${Object.entries (themes .icons) .map (([name, icon]) => 
    `<button data-theme="${encodeURIComponent(name)}">${icon}<span>${name}</span></button>`
  ) .join ('\n    ')}</div></div>`


const isThemeButton = (target) => 
  !!target.closest('.themes button')


// Search
const newSearch = () => {
  document.location.href = `#/search/${
    encodeURIComponent (document .getElementById ('search') .value) .replace (/\%20/g, '+')
  }`
  document .getElementById ('search') .blur ()
}

const getMatches = (
  content, 
  query,
  test = query .toLowerCase ()
) => 
  content .map (({Title, Date, Text, TextLower}) => 
    [Title, Date, findAllIndices (test) (TextLower) .map (i => {
        const start = clamp (0, TextLower.length - 1) (i - Math.floor (Math.random() * 50 + 25))
        const end = clamp (0, TextLower.length - 1) (i + query.length + Math.floor (Math.random() * 50 + 25))

        return `${Text .slice (start, i) .replace (/^\S*\s/, '') .replace (/\n/g, ' ')
          }<span class="match">${Text.slice (i, i + query.length)}</span>${
          Text .slice (i + query.length, end).replace(/\s\S*$/, '') .replace(/\n/g, ' ')}`
    })] 
  )
  .filter (([_, __, r]) => r .length > 0) 
  .map (([Title, Date, Snippets]) => ({Title, Date, Snippets}))


const makeSnippet = ({Date, Title, Snippets}) =>
  `<li>
    <a href="#/${Date}/">${Title} <span class="extra">(${shortDate(Date)})</span></a>
    <div class="snippet">... ${Snippets .slice(0, 3).join(' ... <br/> ...')} ...</div>  
  </li>`

const searchFocus = () =>
  (
    document .getElementById ('search-results') && 
    document .getElementById ('search').blur()
  ) ||
  document .getElementById ('search') .focus ()

const makeSearchTopicsResult = (topics) =>
  `${topics.length > 0 
    ? `<h4>Topics</h4>
       <ul class="long topics">
         ${topics .map ((Topic) => `<li>${makeLink('topic')(Topic)}</li>`) .join ('\n')}
       </ul>`
    : ``
  }`

const makeSearchPeopleResult = (people) =>
  `${people.length > 0 
    ? `<h4>People</h4>
       <ul class="long people">
         ${people .map ((Person) => `<li>${makeLink('person')(Person)}</li>`) .join ('\n')}
       </ul>`
    : ``
  }`

const makeSearchLettersResult = (matches) =>
  `${matches.length > 0 
    ? `<h4>Letters</h4>
       <ul class="long letters">
         ${matches .map (makeSnippet) .join ('\n')}
       </ul>`
    : ``
  }`

const makeSearchWidget = (query) =>
  `<p id="searchBox">
    <input id="search" type="text" value="${query}"/>
    <button id="sbb" type="button" class="search" title="Search"">\u2315</button>
  </p>`
  
const makeSearchResults = (
  content, 
  query,
  matches = query .length ? getMatches (content, query) : [],
  topics = gather ('Topics', content, topicSort) .filter (([topic]) => topic .toLowerCase () .includes (query)) ,
  people = gather ('People', content, personSort) .filter (([person]) => person .toLowerCase () .includes (query))
) => 
  `${query 
    ? matches .length > 0  || topics.length > 0 || people.length > 0 
      ? `<h2>Results</h2>
         <div id="search-results">
           ${makeSearchTopicsResult (topics)}
           ${makeSearchPeopleResult (people)}
           ${makeSearchLettersResult (matches)}
         </div>`
      : `<h2>No Results</h2>`
    : ``
  }`

const makeSearch = (
  content, 
  hash,
  query = decodeURIComponent (hash .slice (9).replace(/\+/g, ' ')),
) => 
  `<div class="main box"><h1>Search</h1>
  ${makeSearchWidget (query)}
  ${makeSearchResults (content, query.toLowerCase())}</div>`


const makeAbstract = ({Title, Date, Topics, Content, TeaserParagraphs}) =>
  `<div class="main box">
     <h2><a href="#/${Date}/">${Title}</a> <span class="extra">(${shortDate (Date)})</span></h2>
     <ul class="topics">${Topics .map (
      topic => `<li><a href="#/topic/${topic .replace (/ /g, '+')}/">${topic}</a></li>`).join(``)
    }</ul>
    <p>${firstParas (Content, TeaserParagraphs)}</p>
    <p class="more"><a href="#/${Date}/">&hellip;more</a></p>
   </div>`

const makeRandomLetter = (
  config,
  content,
  {Title, Date, Topics, Content} = content [randomInt (config .lettersAboveFold, content .length)],
) => 
  `<h2>Random Letter</h2>
  <p>There are <a href="#/letters/">${content.length} letters</a> available.  Here's one:</p>
  <p><a href="#/${Date}/">${Title} (<span>${longDate (Date)}</span>)</a> discussed the ${
    pluralize ('topic', 'topics') (Topics.length)
  } of ${oxfordJoin(Topics .map (topic => `"${topic}"`))}.
  </p>`

const makeRandomTopics = (
  config, 
  content,
  allTopics = gather ('Topics', content, alphaTopicSort),
  chosenTopics = sortBy (head) (weightedRandom (config.topicsAboveFold) (allTopics)) 
) => 
  `<h2>Random Topics</h2>
   <p>Letter here discuss <a href="#/topics/">${allTopics.length} topics</a>.  Here are a few:</p>
   <ul>${chosenTopics.map(makeLink('topic')).join('')}</ul>`

const makeMain = (config) => (
  content, 
) =>
  `<div id="leader">
    ${content .slice (0, 2) .map (makeAbstract) .join('\n')}
   </div>
   <div id="follower">
     ${makeAbstract(content[2])}
     <div id="random" class="main box">
     ${makeRandomLetter(config, content)}
     ${makeRandomTopics(config, content)}
   <div>`

// Setup
const enhanceContent = (content, config, div = document.createElement('div'), now = today()) =>  
  content.filter(config.showAll ? () => true : ({Date}) => Date <= now) // for prepublication
    .map ((letter) => (
    (div .innerHTML = letter .Content), ({
      ...letter,
      Text: div .textContent,
      TextLower:  div .textContent .toLowerCase ()
    }))
  )

const updateCurrent = ({Date, Topics, Title}) => 
  `The most recent letter, from ${longDate(Date)
  }, is titled "<a href="#/${Date}/">${Title
  }</a>", and discusses the ${Topics.length == 1 ? 'subject' : 'subjects'
  } of ${oxfordJoin (Topics .map (makeTopicLink))}.`

const getSubs = (content) => ({
  currentLetter: updateCurrent (content [0])
})

const enhancePages = (content, pages, substitutions = getSubs (content)) =>
  pages.map (({Content, ...rest}) => ({
    ...rest,
    Content: Content.replace(/\<\!\-\-\s*subtitute\:\s*(\w+)\s*\-\-\>/g, (s, k) => substitutions[k] || ``)
  }))

const updateBasePage = (content) => { // TODO -- anything else here?
  document .getElementById ('copyright') .innerHTML = 
    `Copyright &copy; ${
      last (content) .Date .slice (0, 4)
    }&nbsp;-&nbsp;${
      content[0] .Date .slice (0, 4)
    }, Scott&nbsp;Sauyet`
}

// TODO: add titles for About, Letters, Topics, etc.
const changeTitle = (lookups) => (hash) =>
  document.title = 
    (matches (/^\d{4}-\d{2}-\d{2}$/) (hash) ? (lookups [hash] .Title + ' : ') : '') + 
    'Scott Sauyet : Letters to the Editor'

const buildThemes = (colors, {defaultTheme}) => {
  
  const icons= Object .fromEntries (
    Object .entries (colors) .map (
      ([k, {neutral, 'primary-background': primary, 'secondary-background': secondary, 'tertiary-background': tertiary, border}]) => 
      [k, 
`<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" rx="30" ry="30" width="300" height="200"
    style="fill: ${neutral}; stroke-width: 2; stroke: #ccc;"/>
  <rect x="20" y="80" rx="15" ry="15" width="160" height="100"
    style="fill: ${primary}; stroke-width: 2; stroke: ${border};"/>
  <rect x="200" y="80" rx="15" ry="15" width="80" height="100"
    style="fill: ${secondary}; stroke-width: 2; stroke: ${border};"/>
  <rect x="20" y="20" rx="15" ry="15" width="260" height="40"
    style="fill: ${tertiary}; stroke-width: 2; stroke: ${border};"/>
</svg>`
      ]))
  return {
    colors,
    icons,
    choose: (name) => {
      const style = document.querySelector(':root').style
      Object.entries(colors[name] || {}) .forEach (
        ([key, value]) => style .setProperty(`--${key}`, value)
      )
      if (colors[name]) {
        document .getElementById ('favicon') .href = `data:image/svg+xml;base64,${btoa (icons [name])}`
      }  
    },
    defaultTheme
  }
}

const afterNav = (content, pages, lookups, config) => ((
  actions = [
    [() => true, changeTitle (lookups)],
    [() => true, () => document .getElementById ("sidebar") .classList .remove ('open')],
    [startsWith ('search'),           searchFocus],
    [startsWith ('themes'),           themesFocus],
  ]
) => (e, hash = e .detail .hash .slice(2, -1)) => 
  actions .filter (([pred]) => pred (hash)) .forEach(([_, fn]) => fn (hash))
)()

const toggleNav = () => {
  const sidebar = document .getElementById ("sidebar")
  sidebar .classList .toggle ('open')
  sidebar .scrollTo (0, 0)
}

const parseSearch = () => 
  Object .fromEntries (
    decodeURIComponent (document .location .search) 
      .slice (1) .split ('&') .map (split('='))
      .map (([k, v]) => [k,
        v == "true" 
          ? true 
        : v == "false" 
          ? false
        : /^\d+$/ .test (v)
          ? Number(v)
        : (v || '').replace(/\+/g, ' ')
      ])
  )

const removeSearch = (loc = window.location, newurl = loc .protocol + "//" + loc .host +  loc.pathname + loc .hash) =>
  window .history .pushState ({path: newurl}, '', newurl);

  // DOM Events
const addEvents = (content, pages, lookups, themes, config) => ((cfg = {
  click: [
    [hasId ('swb'), (e) => document.location.href = '#/search/'],
    [hasId ('thm'), (e) => document.location.href = '#/themes/' + document.location.hash.replace('#/themes/', '')],
    [hasId ('sbb'), newSearch],
    [hasId ('cls'), toggleNav],
    [hasId ('opn'), toggleNav],
    [isThemeButton, themeClicked (themes)],
  ],
  keyup: [
    [hasId ('search'), (e) => {if (e .key == 'Enter') {newSearch ()}}],
  ],
  nav: [
    [() => true, afterNav (content, pages, lookups, config)]
  ]
}) => 
  Object .entries (cfg) .forEach (
    ([name, actions]) => window .addEventListener (
      name, 
      (e) => (actions .find (([pred]) => pred (e.target)) || [, noop]) [1] (e)
    )
  ))()

// Routing
const router = (content, pages, lookups, themes, config) => {
  const routes = [
    [equals      ('#/'),                        makeMain (config)           ],
    [startsWith  ('#/pages/'),                  makePage (pages)            ],
    [matches     (/^#\/\d{4}-\d{2}-\d{2}\/$/),  makeLetter (lookups)        ],
    [equals      ('#/current/'),                makeCurrent                 ],
    [equals      ('#/topics/'),                 makeTopics                  ],
    [startsWith  ('#/topic/'),                  makeTopic                   ],
    [equals      ('#/people/'),                 makePeople                  ],
    [startsWith  ('#/person/'),                 makePerson                  ],
    [equals      ('#/letters/'),                makeLetters                 ],
    [startsWith  ('#/search/'),                 makeSearch                  ],
    [startsWith  ('#/themes/'),                 makeThemeSwitcher (themes)  ],
    [equals      ('#/series/'),                 makeSeries                  ],
    [startsWith  ('#/series/'),                 makeSingleSeries            ],
  ]

  return () => {
    const hash = document.location.hash
    window .scrollTo (0, 0)
    const [_, getContent] = routes .find (([pred]) => pred (hash)) ||
          [, returnHome]
    document .getElementById ('main') .innerHTML = getContent (content, hash)
    window .dispatchEvent (new CustomEvent ('nav', {detail: {hash}}))
  }
}

// Main
const main = (rawContent, rawPages, colors) => {
  const config = {
    lettersAboveFold: 10, yearsAboveFold: 3, topicsAboveFold: 6, peopleAboveFold: 6,
    defaultTheme: 'I Feel the Earth Move',
    ... JSON .parse (localStorage .getItem ('letters') || "{}"),
    ... parseSearch()
  }

  removeSearch()
  const content = enhanceContent (rawContent, config)
  const pages = enhancePages (content, rawPages)
  const themes = buildThemes (colors, config)
  themes .choose (config .theme || config .defaultTheme)
  const lookups = Object .fromEntries (content .map (letter => [letter.Date, letter]))

  updateBasePage (content)
  document .getElementById ('root') .innerHTML += makeSidebar (content, pages, themes, config) 

  addEvents (content, pages, lookups, themes, config)

  const route = router (content, pages, lookups, themes, config)
  window .addEventListener ('popstate', () => setTimeout (route, 0))
  route ()
}

main (content, pages, colors)

