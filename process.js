const call = (fn, ...args) => fn (args)
const identity = (x) => x
const always = (x) => () => x
const prop = (p) => (o) => o[p]
const chain = (fn) => (xs) => xs .flatMap (fn)
const last = (xs) => xs [xs .length - 1]
const clamp = (min, max) => (n) => Math .min (Math .max (min, n), max)
const matches = (regex) => (str) => regex .test (str)
const equals = (s1) => (s2) => s1 === s2
const startsWith = (prefix) => s => s .startsWith (prefix)
const noop = () => {}
const hasId = (id) => (target) => !!target .closest (`#${id}`)
const countBy = (fn) => (xs) =>
  xs .reduce ((a, x) => (fn (x) || []) .reduce ((a, v) => ((a[v] = (a[v] || 0) + 1), a), a), {})
const groupBy = (fn) => (xs) => Object .entries (xs .reduce (
  (a, x) => call ((key) => ((a[key] = a[key] || []), (a [key] .push (x)), a), fn(x)), {}
))
const shortDate = (ds) =>  
  `${Number(ds.slice(5, 7))}/${Number(ds.slice(8,10))}/${ds.slice(2, 4)}`
const longDate = ((months) => (ds) => 
  `${months[Number(ds.slice(5, 7) - 1)]} ${Number(ds.slice(8,10))}, ${ds.slice(0, 4)}`
) (['January', 'February', 'March', 'April', 'May', 'June', 'July',  'August', 'September', 'October', 'November', 'December']) 
const getYear = ({Date}) => Date .slice (0, 4)
const findAllIndices = (x) => (xs, pos = 0, idx = xs .indexOf (x, pos)) =>
  idx == -1 ? [] : [idx, ...findAllIndices (x) (xs, idx + 1)]
const oxfordJoin = (xs) =>
  xs .length == 0
    ? ''
  : xs .length == 1
    ? xs[0]
  : xs.length == 2
    ? xs .join (' and ')
  : [xs.slice(0, -1).join(', '), last(xs)] .join(', and ')

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
  `<li><a href="#/${type}/${t.replace(/ /g, '+')}">${t} <span>(${c} letter${c > 1 ? 's' : ''})</span></a></li>`
const letterLink = ({Date, Title}) =>
  `<li><a href="#/${Date}">${Title} <span>(${shortDate(Date)})</span></a></li>`
const makeTopicLink = (Topic) =>
  `<a href="#/topic/${Topic.replace(/ /g, '+')}">${Topic}</a>`


const makeSidebarButtons = (themes) =>
  `<p id="searchWidget">
  <button id="swb" type="button" title="Search">\u2315</button>
  <button id="thm" type="button" title="Change Theme">${themes.icons[themes.defaultTheme]}</button>
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

const makeSidebarLetters = (
  content,
  lettersAboveFold,
  yearsAboveFold,
) =>
  `<h2><a href="#/letters/">Letters</a></h2>
  ${makeRecentSidebarLetters(content, lettersAboveFold)}
  ${makeOlderSidebarLetters(content, lettersAboveFold, yearsAboveFold)}`

makeSidebarTopics = (
  content,
  topicsAboveFold,
  topics = gather ('Topics', content, topicSort)
) =>
  `<h2><a href="#/topics/">Topics</a></h2>
  <ul>
  ${topics .slice (0, topicsAboveFold) .map (makeLink ('topic')) .join ('\n')}
  </ul>
  ${topics.length > topicsAboveFold ? `    <details class="more">
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
  `<h2><a href="#/people/">Other Letter Writers</a></h2>
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
  themes, 
  {lettersAboveFold = 5, yearsAboveFold = 3, topicsAboveFold = 8, peopleAboveFold = 4}
) => 
  `<div class="sidebar box">
    ${makeSidebarButtons (themes)}
    ${makeSidebarLetters (content, lettersAboveFold, yearsAboveFold)}
    ${makeSidebarTopics (content, topicsAboveFold)}
    ${makeSidebarPeople (content, peopleAboveFold)}
  </div>`

const makeLetterBody = ({Title, Topics = [], Date, Content}) =>
  `<h1>${Title}</h1>
  ${Topics.length 
    ? `<ul class="topics">
        ${Topics .map (topic => `<li><a href="#/topic/${topic .replace (/ /g, '+')}">${topic}</a></li>`) .join ('\n    ')}
      </ul>` 
    : ``
  }
  <p class="date">${longDate(Date)}</p>
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
    <div id="prev"${prev ? `title="${shortDate (prev .Date)}` : ``}">${prev ? `<a href="#/${prev .Date}">« ${prev .Title}</a>` : ``}</div>
    <div id="home" title="Overview"><a href="#/">Home</a></div>
    <div id="next"${next ? `title="${shortDate (next .Date)}` : ``}">${next ? `<a href="#/${next .Date}">${next .Title} »</a>` : ``}</div>
  </nav>`

const makeLetter = (lookups) => (
  contents, 
  hash,
  letter = lookups [hash .slice (2)],
) => 
  letter
    ? `${makeLetterBody (letter)}
       ${makeLetterNav (contents, letter)}` 
    : `<h1>Not Found</h1>
      <p>No letter found for ${longDate(hash.slice(2))}`


const makeTopic = (
  content, 
  hash,
  topic = hash .slice (8) .replaceAll('+', ' '),
  letters = content .filter (({Topics}) => Topics .includes (topic))
) => 
  `<h1>Letters with topic "${topic}"</h1>
  <ul class="long">
    ${letters .map (({Date, Title}) => 
      `<li><a href="#/${Date}">${Title} <span>(${shortDate (Date)})</span></a></li>`
    ) .join ('\n')}
  </ul>`


const makePerson = (
  content, 
  hash,
  person = hash .slice (9) .replaceAll('+', ' '),
  letters = content .filter (({People}) => People .includes (person))  
) => 
  `<h1>Letters mentioning Rivereast letter writer ${person}</h1>
  <ul class="long">
    ${letters .map (letter => 
      `<li><a href="#/${letter .Date}">${letter .Title} (${shortDate (letter .Date)})</a></li>`
    ) .join ('\n')}
  </ul>`

const makeTopics = (content) => 
  `<h1>All Topics</h1>
    <ul class="long">
      ${gather ('Topics', content, alphaTopicSort) .map (makeLink ('topic')) .join ('\n        ')}
    </ul>`

const makePeople = (content) => 
  `<h1>All Letter Writers</h1>
  <ul class="long">
    ${gather ('People', content, alphaPersonSort) .map (makeLink ('person')) .join ('\n        ')}
  </ul>`

const makeLetters = (content) => 
  `<h1>All Letters</h1>
  <ul class="long">
    ${content .map (letterLink) .join ('\n        ')}
  </ul>`

const chooseTheme = (name) => {
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

const themeClicked = (e) =>
  chooseTheme (decodeURIComponent (e .target .closest ('.themes button') .dataset .theme))

const themesFocus = () =>
  document .querySelector ('div.themes button') .focus()

const makeThemeSwitcher = () => 
  `<h1>Choose Theme</h1><div class="themes">
  ${Object.entries (themes .icons) .map (([name, icon]) => 
    `<button data-theme="${encodeURIComponent(name)}">${icon}<span>${name}</span></button>`
  ) .join ('\n    ')}</div>`


const isThemeButton = (target) => 
  !!target.closest('.themes button')

const newSearch = () => 
  document.location.href = `#/search/${
    encodeURIComponent (document .getElementById ('search') .value) .replace (/\%20/g, '+')
  }`


// TODO: Question: is this minor randomization of matches actually helpful?
const getMatches = (
  content, 
  query,
  test = query .toLowerCase ()
) => 
  content .map (({Title, Date, Text, TextLower}) => {
    const max = TextLower.length - 1
    return [Title, Date, findAllIndices (test) (TextLower) .map (i => {
      const start = clamp (0, max) (i - Math.floor (Math.random() * 50 + 50))
      const end = clamp (0, max) (i + query.length + Math.floor (Math.random() * 50 + 50))
      return `${Text .slice (start, i) .replace (/^\S*\s/, '') .replace (/\n/g, ' ')
             }<span class="match">${Text.slice (i, i + query.length)}</span>${
              Text .slice (i + query.length, end).replace(/\s\S*$/, '') .replace(/\n/g, ' ')}`
    })] 
  })
  .filter (([_, __, r]) => r .length > 0) 
  .map (([Title, Date, Snippets]) => ({Title, Date, Snippets}))


const makeSnippet = ({Date, Title, Snippets}) =>
  `<li>
    <a href="#/${Date}">${Title} <span>(${shortDate(Date)})</span></a>
    <div class="snippet">... ${Snippets .slice(0, 3).join(' ... <br/> ...')} ...</div>  
  </li>`

const searchFocus = () =>
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
  `<h1>Search</h1>
  ${makeSearchWidget (query)}
  ${makeSearchResults (content, query.toLowerCase())}`


const updateCurrent = ({Date, Topics, Title}) => 
  `The most recent letter, from ${longDate(Date)
  }, is titled "<a href="#/${Date}">${Title
  }</a>", and discusses the ${Topics.length == 1 ? 'subject' : 'subjects'
  } of ${oxfordJoin (Topics .map (makeTopicLink))}.`


const enhanceContent = (content, div = document.createElement('div')) =>  
  content .map ((letter) => (
    (div .innerHTML = letter .Content), ({
      ...letter,
      Text: div .textContent,
      TextLower:  div .textContent .toLowerCase ()
    }))
  )

const addEvents = (cfg) =>
  Object .entries (cfg) .forEach (
    ([name, actions]) => window .addEventListener (
      name, 
      (e) => (actions .find (([pred]) => pred (e.target)) || [, noop]) [1] (e)
    )
  )

const router = (content) => {
  const lookups = Object .fromEntries (content .map (letter => [letter.Date, letter]))
  const base = document .getElementById ('main') .innerHTML

  const routes = [
    [equals      ('#/'),                      always (base),        noop],
    [matches     (/^#\/\d{4}-\d{2}-\d{2}$/),  makeLetter (lookups), noop],
    [equals      ('#/topics/'),               makeTopics,           noop],
    [startsWith  ('#/topic/'),                makeTopic,            noop],
    [equals      ('#/people/'),               makePeople,           noop],
    [startsWith  ('#/person/'),               makePerson,           noop],
    [equals      ('#/letters/'),              makeLetters,          noop],
    [startsWith  ('#/search/'),               makeSearch,           searchFocus],
    [startsWith  ('#/themes/'),               makeThemeSwitcher,    themesFocus],
  ]
  return () => {
    const hash = document.location.hash
    window .scrollTo (0, 0)
    const [_, getContent, after] = routes .find (([pred]) => pred (hash)) ||
          [, returnHome, noop]
    document .getElementById ('main') .innerHTML = getContent (content, hash)
    after () // TODO: replace these with a DOM event listener
  }
}

((rawContent, themes) => {
  const content = enhanceContent (rawContent)

  document .getElementById ('currentLetter') .innerHTML = updateCurrent (content[0])

  const route = router (content)
 
  document .getElementById ('root') .innerHTML += makeSidebar (
    content,
    themes,
    {lettersAboveFold: 10, yearsAboveFold: 3, topicsAboveFold: 6, peopleAboveFold: 6}
  )
  
  addEvents ({
    click: [
      [hasId ('swb'), (e) => document.location.href = '#/search/'],
      [hasId ('thm'), (e) => document.location.href = '#/themes/' + document.location.hash],
      [hasId ('sbb'), newSearch],
      [isThemeButton, themeClicked],
    ],
    keyup: [
      [hasId ('search'), (e) => {if (e .key == 'Enter') {newSearch ()}}],
    ]
  })

  window .addEventListener ('popstate', () => setTimeout (route, 0))

  route ()
}) (content, themes)
