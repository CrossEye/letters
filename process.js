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


const makeSidebar = (content, ltrNbr = 5, moreYears = 3, tagNbr = 8, prsnNbr = 4) => {
    const tags = gather ('Tags', content, tagSort)
    const people = gather ('People', content, personSort)
    const recentLetters = content .slice (0, ltrNbr)
    const years = groupBy (getYear) (content .slice (ltrNbr)) .sort (([a], [b]) => b - a)
    const initialYears = years .slice (0, moreYears)
    const laterYears = years .slice (moreYears)

    const html = `<div class="sidebar box">
    <p id="searchWidget">
    <input id="sw" type="text"/>
    <button id= 'swb' type="button" method="get" onClick="newSearch('sw')">🔍</button>
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
    <h2><a href="#/tags/">Tags</a></h2>
    <ul>
    ${tags .slice (0, tagNbr) .map (makeLink ('tag')) .join ('\n    ')}
    </ul>
    ${tags.length > tagNbr ? `    <details class="more">
        <summary>More...</summary>
        <ul>
            ${tags .slice (tagNbr) .map (makeLink ('tag')) .join ('\n        ')}
        </ul>
    </details>` : ``}
    <h2><a href="#/people/">Other Letter Writers</a></h2>
    <ul>
    ${people .slice (0, prsnNbr) .map (makeLink ('person')) .join ('\n    ')}
    </ul>
    ${people.length > prsnNbr ? `    <details class="more">
        <summary>More...</summary>
        <ul>
            ${people .slice (prsnNbr) .map (makeLink ('person')) .join ('\n        ')}
        </ul>
    </details>` : ``}

</div>
`
  document .getElementById ('root') .innerHTML += html
  const button = document.getElementById('swb')
  document .getElementById ('sw') .addEventListener ('keyup', (e) => {
    if (e.key == 'Enter') {button. click ()}
  })

}

const makeLetter = (contents, letter) => {
    const prev = contents [contents .indexOf (letter) - 1]
    const next = contents [contents .indexOf (letter) + 1]
    return `
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
    </nav>
`
}

const makeTag = (content, tag) => {
    const letters = content .filter (({Tags}) => Tags .includes (tag))
    return `
    <h1>Letters tagged "${tag}"</h1>
    <ul>
      ${letters .map (letter => 
        `<li><a href="#/${letter .Date}">${letter .Title} (${shortDate (letter .Date)})</a></li>`
      ) .join ('\n        ')}
    </ul>`
}

const makePerson = (content, person) => {
    const letters = content .filter (({People}) => People .includes (person))
    return `
    <h1>Letters mentioning Rivereast letter writer ${person}</h1>
    <ul>
      ${letters .map (letter => 
        `<li><a href="#/${letter .Date}">${letter .Title} (${shortDate (letter .Date)})</a></li>`
      ) .join ('\n        ')}
    </ul>`
}

const makeTags = (content) => `    <h1>All Tags</h1>
    <ul class="long">
      ${gather ('Tags', content, alphaTagSort) .map (makeLink ('tag')) .join ('\n        ')}
    </ul>`

const makePeople = (content) => `    <h1>All Letter Writers</h1>
  <ul class="long">
    ${gather ('People', content, alphaPersonSort) .map (makeLink ('person')) .join ('\n        ')}
  </ul>`

const makeLetters = (content) => `    <h1>All Letters</h1>
  <ul class="long">
    ${content .map (letterLink) .join ('\n        ')}
  </ul>`

const newSearch = (id) => {
  document.location.href = `#/search/${encodeURIComponent(document.getElementById(id || 'search').value).replace(/\%20/g, '+')}`
}

const makeSearch = (el, content, query) => {
  const matches =
    query .length 
      ? content.filter(({TextLower}) => TextLower.includes (query.toLowerCase()))
      : []
  el .innerHTML =  `    <h1>Search</h1>
  <p id="searchBox">
    <input id="search" type="text" value="${query}"/>
    <button id="sbb" type="button" method="get" onClick="newSearch()">🔍</button>
  </p>
  <h2>${matches .length > 0 ? '' : 'No '}Results</h2>
  ${matches .length > 0 ? `<h3>Letters</h3>
  <ul class="long">
  ${matches .map (letterLink) .join ('\n        ')}
  </ul>` : ``}`
  const button = document.getElementById('sbb')
  document .getElementById ('search') .addEventListener ('keyup', (e) => {
      if (e.key == 'Enter') {button .click ()}
  })
}

const updateCurrent = ({Date, Tags, Title}) => {
  document .getElementById ('currentLetter') .innerHTML = 
      `The <a href="#/${Date}">most recent letter</a>, from ${longDate(Date)}, is titled "${Title}", and discusses the ${Tags.length == 1 ? 'subject' : 'subjects'} of ${oxfordJoin (Tags .map (makeTagLink))}.`
}  

((content) => {
    const lookups = Object.fromEntries(content .map (letter => [letter.Date, letter]))
    updateCurrent (content[0])
    const base = document .getElementById ('main') .innerHTML
    const route = () => {
      const main = document .getElementById ('main')
      const hash = document.location.hash
      window .scrollTo (0, 0)
      if (hash) {
        if (hash == '#/') {
            main .innerHTML = base
        } else if (/#\/\d{4}-\d{2}-\d{2}/ .test (hash)) {
            const letter = lookups [hash .slice (2)];
            if (letter) {
             main .innerHTML = makeLetter (content, letter)
            } else {
              document.location.hash = '#/'
            }
        } else if (hash.startsWith('#/tag/')) {
            main .innerHTML = makeTag (content, hash .slice (6) .replaceAll('+', ' '))
        } else if (hash.startsWith('#/person/')) {
            main .innerHTML = makePerson (content, hash .slice (9) .replaceAll('+', ' '))
        } else if (hash == '#/tags/') {
            main .innerHTML = makeTags (content)
        } else if (hash == '#/people/') {
            main .innerHTML = makePeople (content)
        } else if (hash == '#/letters/') {
            main .innerHTML = makeLetters (content)
        } else if (hash .startsWith('#/search/')) {
            makeSearch (main, content, decodeURIComponent (hash .slice (9).replace(/\+/g, ' ')))
        }
      } else {
        document.location.hash = '#/'
      }
    }
    const div = document.createElement('div')
    content .forEach (letter => {
      div .innerHTML = letter .Content
      letter .Text = div .textContent
      letter .TextLower = letter .Text .toLowerCase ()
    })
     
    makeSidebar (content, 8, 3, 5, 5)
    window .addEventListener ('popstate', () => setTimeout (route, 0))
    route ()
}) (content)

