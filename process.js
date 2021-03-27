const prop = (p) => (o) => o[p]
const chain = (fn) => (xs) => xs .flatMap (fn)
const last = (xs) => xs [xs .length - 1]
const counts = (fn) => (xs) =>
  xs .reduce ((a, x) => (fn (x) || []) .reduce ((a, v) => ((a[v] = (a[v] || 0) + 1), a), a), {})
const identity = (x) => x
const shortDate = (ds) =>  `${Number(ds.slice(5, 7))}/${Number(ds.slice(8,10))}/${ds.slice(2, 4)}`
const longDate = ((months) => (ds) => `${months[Number(ds.slice(5, 7) - 1)]} ${Number(ds.slice(8,10))}, ${ds.slice(0, 4)}`)
  (['January', 'February', 'March', 'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December']) 
const call = (fn, ...args) => fn (args)
const getYear = ({Date}) => Date .slice (0, 4)
const groupBy = (fn) => (xs) =>
  Object .entries (xs .reduce (
    (a, x) => call ((key) => ((a[key] = a[key] || []), (a [key] .push (x)), a), fn(x)),
    {}
  ))
const clamp = (min, max) => (n) =>
  Math.min (Math.max (min, n), max)
const matches = (regex) => (str) =>
  regex .test (str)
const equals = (s1) => (s2) => 
  s1 === s2
const startsWith = (prefix) => s =>
  s .startsWith (prefix)
const noop = () => {}
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

const tagSort = ([a, x], [b, y]) => 
  y - x || (a < b ? -1 : a > b ? 1 : 0)
const personSort = ([a, x], [b, y], aa = last (a.split(' ')), bb = last (b.split(' '))) => 
  y - x || (aa < bb ? -1 : aa > bb ? 1 : 0)

const alphaTagSort = ([a], [b]) =>
  a < b ? -1 : a > b ? 1 : 0 
const alphaPersonSort = ([a], [b], aa = last (a.split(' ')), bb = last (b.split(' '))) => 
  aa < bb ? -1 : aa > bb ? 1 : 0

const gather = (name, content, sorter=tagSort) =>
  Object.entries (counts (prop (name)) (content)) .sort (sorter)

const makeLink = (type) => ([t, c]) => 
  `<li><a href="#/${type}/${t.replace(/ /g, '+')}">${t} <span>(${c} letter${c > 1 ? 's' : ''})</span></a></li>`
const letterLink = ({Date, Title}) =>
  `<li><a href="#/${Date}">${Title} <span>(${shortDate(Date)})</span></a></li>`
const makeTagLink = (Tag) =>
  `<a href="#/tag/${Tag.replace(/ /g, '+')}">${Tag}</a>`


const makeSidebar = (content, {letterAboveFold = 5, yearsAboveFold = 3, tagsAboveFold = 8, peopleAboveFold = 4}) => {
    const tags = gather ('Tags', content, tagSort)
    const people = gather ('People', content, personSort)
    const recentLetters = content .slice (0, letterAboveFold)
    const years = groupBy (getYear) (content .slice (letterAboveFold)) .sort (([a], [b]) => b - a)
    const initialYears = years .slice (0, yearsAboveFold)
    const laterYears = years .slice (yearsAboveFold)

    const html = `<div class="sidebar box">
    <p id="searchWidget">
    <!-- <input id="sw" type="text"/> -->
    <button id="swb" type="button" title="Search">\u2315</button>
    <button id="thm" type="button" title="Change Theme">${themes.icons[themes.defaultTheme]}</button>
    </p>

    <h2><a href="#/letters/">Letters</a></h2>
    <details open>
    <summary>Recent</summary>
    <ul>
        ${recentLetters .map (letterLink) .join ('\n        ')}
    </ul>
    </details>
    <details>
    <summary>Older</summary>
    ${initialYears .map (([year, letters]) => `    <details>
        <summary>${year}</summary>
        <ul>
            ${letters .map (letterLink) .join ('\n            ')}
        </ul>
    </details>
    `).join ('\n    ')}
    ${laterYears.length > 0 ? 
        `<details>
             <summary>More...</summary>
             ${laterYears .map (([year, letters]) => `    <h4>${year}</h4>
             <ul>
                 ${letters .map (letterLink) .join ('\n            ')}
             </ul>`).join ('\n    ')}
        </details>` : ``}
    </details>
    <h2><a href="#/tags/">Topics</a></h2>
    <ul>
    ${tags .slice (0, tagsAboveFold) .map (makeLink ('tag')) .join ('\n    ')}
    </ul>
    ${tags.length > tagsAboveFold ? `    <details class="more">
        <summary>More...</summary>
        <ul>
            ${tags .slice (tagsAboveFold) .map (makeLink ('tag')) .join ('\n        ')}
        </ul>
    </details>` : ``}
    <h2><a href="#/people/">Other Letter Writers</a></h2>
    <ul>
    ${people .slice (0, peopleAboveFold) .map (makeLink ('person')) .join ('\n    ')}
    </ul>
    ${people.length > peopleAboveFold ? `    <details class="more">
        <summary>More...</summary>
        <ul>
            ${people .slice (peopleAboveFold) .map (makeLink ('person')) .join ('\n        ')}
        </ul>
    </details>` : ``}

</div>
`
  document .getElementById ('root') .innerHTML += html
  const searchButton = document.getElementById('swb')
  searchButton.onclick = () => document.location.href = '#/search/'
  const themeButton = document.getElementById('thm')
  themeButton.onclick = () => document.location.href = '#/themes/' + document.location.hash
  }
const makeBase = (base) => (main, contents, hash) =>
  main .innerHTML = base

const makeLetter = (lookups) => (main, contents, hash) => {
  const letter = lookups [hash .slice (2)];
  if (letter) {
    const prev = contents [contents .indexOf (letter) + 1]
    const next = contents [contents .indexOf (letter) - 1]
    main .innerHTML = `
    <h1>${letter.Title}</h1>
    ${letter.Tags.length ? `<ul class="tags">
    ${letter.Tags .map (tag => `<li><a href="#/tag/${tag.replace(/ /g, '+')}">${tag}</a></li>`) .join ('\n    ')}
    </ul>` : ``}
    <p class="date">${longDate(letter.Date)}</p>
    <p class="salutation">
      To The Editor:
    </p>
    ${letter.Content}
    <p class="signature"> -- Scott Sauyet</p>
    <nav>
      <div id="prev"${prev ? `title="${shortDate(prev.Date)}` : ``}">${prev ? `<a href="#/${prev.Date}">« ${prev.Title}</a>` : ``}</div>
      <div id="home" title="Overview"><a href="#/">Home</a></div>
      <div id="next"${next ? `title="${shortDate(next.Date)}` : ``}">${next ? `<a href="#/${next.Date}">${next.Title} »</a>` : ``}</div>
    </nav>`
  } else {
    document.location.hash = '#/'
  }
}

const makeTag = (main, content, hash) => {
    const tag = hash .slice (6) .replaceAll('+', ' ')
    const letters = content .filter (({Tags}) => Tags .includes (tag))
    main.innerHTML = `
    <h1>Letters tagged "${tag}"</h1>
    <ul class="long">
      ${letters .map (letter => 
        `<li><a href="#/${letter .Date}">${letter .Title} (${shortDate (letter .Date)})</a></li>`
      ) .join ('\n        ')}
    </ul>`
}

const makePerson = (main, content, hash) => {
    const person = hash .slice (9) .replaceAll('+', ' ')
    const letters = content .filter (({People}) => People .includes (person))
    main.innerHTML = `
    <h1>Letters mentioning Rivereast letter writer ${person}</h1>
    <ul class="long">
      ${letters .map (letter => 
        `<li><a href="#/${letter .Date}">${letter .Title} (${shortDate (letter .Date)})</a></li>`
      ) .join ('\n        ')}
    </ul>`
}

const makeTags = (main, content, hash) => 
    main.innerHTML = `<h1>All Tags</h1>
    <ul class="long">
      ${gather ('Tags', content, alphaTagSort) .map (makeLink ('tag')) .join ('\n        ')}
    </ul>`

const makePeople = (main, content) => 
  main.innerHTML = `<h1>All Letter Writers</h1>
  <ul class="long">
    ${gather ('People', content, alphaPersonSort) .map (makeLink ('person')) .join ('\n        ')}
  </ul>`

const makeLetters = (main, content) => 
  main.innerHTML = `<h1>All Letters</h1>
  <ul class="long">
    ${content .map (letterLink) .join ('\n        ')}
  </ul>`

const chooseTheme = (name) => {
  themes.choose(name);
  localStorage .setItem ('letters', JSON.stringify({...JSON.parse(localStorage.getItem('letters')), theme: name}))
  document.location.hash = document.location.hash .slice (document.location.hash .slice(1).indexOf('#') + 1) || '#/'
}

const makeThemeSwitcher = (main, content, hash) => {
  main.innerHTML = `<h1>Choose Theme</h1><div class="themes">
  ${Object.entries(themes.icons).map(([name, icon]) => 
    `<button onClick="chooseTheme('${name}')">${icon}<span>${name}</span></button>`
  ) .join('\n    ')}</div>`
  document.querySelector('div.themes button').focus()
}

const newSearch = (id) => {
  document.location.href = `#/search/${encodeURIComponent(document.getElementById(id || 'search').value).replace(/\%20/g, '+')}`
}

const getMatches = (content, query) => {
  const test = query .toLowerCase ()
  return content .map (({Title, Date, Text, TextLower}) => {
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
}

const makeSnippet = ({Date, Title, Snippets}) =>
  `<li>
    <a href="#/${Date}">${Title} <span>(${shortDate(Date)})</span></a>
    <div class="snippet">... ${Snippets .slice(0, 3).join(' ... <br/> ...')} ...</div>  
  </li>`


const makeSearch = (main, content, hash) => {
  const q = decodeURIComponent (hash .slice (9).replace(/\+/g, ' '))
  const query = q.toLowerCase()
  const matches =
    query .length 
      ? getMatches (content, query)
      : []
  const tags = gather ('Tags', content, tagSort) .filter (([tag]) => tag .toLowerCase () .includes (query)) 
  const people = gather ('People', content, personSort) .filter (([person]) => person .toLowerCase () .includes (query))
  
  main .innerHTML =  `    <h1>Search</h1>
  <p id="searchBox">
    <input id="search" type="text" value="${q}"/>
    <button id="sbb" type="button" class="search" title="Search"">\u2315</button>
  </p>
  ${query 
      ? matches .length > 0  || tags.length > 0 || people.length > 0 
        ? `<h2>Results</h2>
           <div id="search-results">
            ${tags.length > 0 
               ? `<h4>Topics</h4>
                  <ul class="long topics">
                    ${tags .map ((Tag) => `<li>${makeLink('tag')(Tag)}</li>`) .join ('\n        ')}
                  </ul>`
               : ``
             }
             ${people.length > 0 
               ? `<h4>People</h4>
                  <ul class="long people">
                    ${people .map ((Person) => `<li>${makeLink('person')(Person)}</li>`) .join ('\n        ')}
                  </ul>`
               : ``
             }
            ${matches.length > 0 
               ? `<h4>Letters</h4>
                  <ul class="long letters">
                    ${matches .map (makeSnippet) .join ('\n        ')}
                  </ul>`
               : ``
             }
           </div>`
        : `<h2>No Results</h2>`
      : ``
  }`

  const button = document .getElementById ('sbb')
  button .onclick = () => newSearch()
  const searchBox = document .getElementById ('search') 
  searchBox .addEventListener ('keyup', (e) => {
      if (e.key == 'Enter') {button .click ()}
  })
  searchBox .focus ()
}

const updateCurrent = ({Date, Tags, Title}) => {
  document .getElementById ('currentLetter') .innerHTML = 
      `The most recent letter, from ${longDate(Date)}, is titled "<a href="#/${Date}">${Title}</a>", and discusses the ${Tags.length == 1 ? 'subject' : 'subjects'} of ${oxfordJoin (Tags .map (makeTagLink))}.`
}

const router = (content, lookups, base) => {
  const routes = [
    [equals      ('#/'),                      makeBase (base)],
    [matches     (/^#\/\d{4}-\d{2}-\d{2}$/),  makeLetter (lookups)],
    [equals      ('#/tags/'),                 makeTags],
    [startsWith  ('#/tag/'),                  makeTag],
    [equals      ('#/people/'),               makePeople],
    [startsWith  ('#/person/'),               makePerson],
    [equals      ('#/letters/'),              makeLetters],
    [startsWith  ('#/search/'),               makeSearch],
    [startsWith  ('#/themes/'),               makeThemeSwitcher],
  ]
  return () => {
    const main = document .getElementById ('main')
    const hash = document.location.hash
    window .scrollTo (0, 0)
    if (hash) {
      (routes .find (([pred]) => pred (hash)) || [, noop]) [1] (main, content, hash)
    } else {
      document.location.hash = '#/'
    }
  }
}

const enhanceContent = (content, div = document.createElement('div')) =>  
  content .map ((letter) => (
    (div .innerHTML = letter .Content), ({
      ...letter,
      Text: div .textContent,
      TextLower:  div .textContent .toLowerCase ()
    }))
  );


((rawContent) => {
    const content = enhanceContent (rawContent)

    updateCurrent (content[0])

    const lookups = Object .fromEntries (content .map (letter => [letter.Date, letter]))
    const base = document .getElementById ('main') .innerHTML

    makeSidebar (
      content, 
      {letterAboveFold: 10, yearsAboveFold: 3, tagsAboveFold: 6, peopleAboveFold: 6}
    )
    
    const route = router (content, lookups, base)

    window .addEventListener ('popstate', () => setTimeout (route, 0))

    route ()
    
}) (content)
