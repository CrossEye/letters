const prop = (p) => (o) => o[p]
const chain = (fn) => (xs) => xs .flatMap (fn)
const counts = (fn) => (xs) =>
  xs .reduce ((a, x) => (fn (x) || []) .reduce ((a, v) => ((a[v] = (a[v] || 0) + 1), a), a), {})
const identity = (x) => x
const shortDate = (ds) =>  `${Number(ds.slice(5, 7))}/${Number(ds.slice(8,10))}/${ds.slice(2, 4)}`
const longDate = ((months) => (ds) => `${months[Number(ds.slice(5, 7) - 1)]} ${Number(ds.slice(8,10))}, ${ds.slice(0, 4)}`)
  (['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December']) 
const call = (fn, ...args) => fn (args)
const getYear = ({Date}) => Date .slice (0, 4)
const groupBy = (fn) => (xs) =>
  Object .entries (xs .reduce (
    (a, x) => call (
      (key) => ((a[key] = a[key] || []), (a [key] .push (x)), a), 
      fn(x)
    ),
    {}
  ))

const gather = (name, content) =>
  Object.entries (counts (prop (name)) (content))
    .sort (([a], [b]) => a < b ? -1 : a > b ? 1 :0)
    .sort (([, a], [, b]) => b - a)
const makeLink = (type) => ([t, c]) => 
  `<li><a href="#/${type}/${t.replace(/ /g, '+')}">${t} <span>(${c} letter${c > 1 ? 's' : ''})</span></a></li>`
const letterLink = ({Date, Title}) =>
  `<li><a href="#/${Date}">${Title} <span>(${shortDate(Date)})</span></a></li>`

const makeSidebar = (content, ltrNbr = 5, moreYears = 3, tagNbr = 8, prsnNbr = 4) => {
    const tags = gather ('Tags', content)
    const people = gather ('People', content)
    const recentLetters = content .slice (0, ltrNbr)
    const years = groupBy (getYear) (content .slice (ltrNbr)) .sort (([a], [b]) => b - a)
    const initialYears = years .slice (0, moreYears)
    const laterYears = years .slice (moreYears)

    return `<div class="sidebar box">
    <h2><a href="#/"><em>Rivereast</em> Letters</a></h2>
    <details open>
    <summary>Recent</summary>
    <ul>
        ${recentLetters .map (letterLink) .join ('\n        ')}
    </ul>
    </details>
    <details open>
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
             ${laterYears .map (([year, letters]) => `    <details>
             <summary>${year}</summary>
             <ul>
                 ${letters .map (letterLink) .join ('\n            ')}
             </ul>
         </details>`).join ('\n    ')}
        </details>` : ``}
    <h2>Tags</h2>
    <ul>
    ${tags .slice (0, tagNbr) .map (makeLink ('tag')) .join ('\n    ')}
    </ul>
    ${tags.length > tagNbr ? `    <details class="more">
        <summary>More...</summary>
        <ul>
            ${tags .slice (tagNbr) .map (makeLink ('tag')) .join ('\n        ')}
        </ul>
    </details>` : ``}
    <h2>Other Letter Writers</h2>
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
    <p class="signature">
      -- Scott Sauyet
    </p>
    <nav>
      <div id="prev"${prev ? `title="${shortDate(prev.Date)}` : ``}">${prev ? `<a href="#/${prev.Date}">« ${prev.Title}</a>` : ``}</div>
      <div id="home" title="All letters"><a href="#/">Home</a></div>
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

  

((content) => {
    const lookups = Object.fromEntries(content .map (letter => [letter.Date, letter]))
    const base = document .getElementById ('main') .innerHTML
    const route = () => {
      const hash = document.location.hash
      window .scrollTo (0, 0)
      if (hash) {
        if (hash == '#/') {
            document .getElementById ('main') .innerHTML = base
        } else if (/#\/\d{4}-\d{2}-\d{2}/ .test (hash)) {
            document .getElementById ('main') .innerHTML = makeLetter (content, lookups [hash .slice (2)])
        } else if (hash.startsWith('#/tag/')) {
            document .getElementById ('main') .innerHTML = makeTag (content, hash .slice (6) .replaceAll('+', ' '))
        } else if (hash.startsWith('#/person/')) {
            document .getElementById ('main') .innerHTML = makePerson (content, hash .slice (9) .replaceAll('+', ' '))
        }
      } else {
        document.location.hash = '#/'
      }
    }
    window.addEventListener ('popstate', () => setTimeout(route, 0))
    route()
    document.getElementById ('root') .innerHTML += makeSidebar(content, 6, 2, 5, 5)
}) (content)
