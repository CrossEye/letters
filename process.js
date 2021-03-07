const uniq = (xs) => [... new Set(xs)]
const prop = (p) => (o) => o[p]
const chain = (fn) => (xs) => xs .flatMap (fn)
const counts = (fn) => (xs) =>
  xs .reduce ((a, x) => (fn (x) || []) .reduce ((a, v) => ((a[v] = (a[v] || 0) + 1), a), a), {})
const asNumber = (fn) => (x) => Number (fn (x))
const identity = (x) => x
const pipe = (fn = identity, ...fns) => (x) => fns.length > 0 ? pipe (fns) (fn (x)) : fn (x)
const shortDate = (ds) =>  `${Number(ds.slice(5, 7))}/${Number(ds.slice(8,10))}/${ds.slice(2, 4)}`
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
  `<li><a href="#/${type}/${t.replace(/ /g, '+')}">${t} (${c} letter${c > 1 ? 's' : ''})</a></li>`
const letterLink = ({Date, Title}) =>
  `<li><a href="#/${Date}">${Title} (${shortDate(Date)})</a></li>`
const makeSidebar = (content, ltrNbr = 5, moreYears = 3, tagNbr = 8, prsnNbr = 4) => {
    const tags = gather ('Tags', content)
    const people = gather ('People', content)
    const recentLetters = content .slice (0, ltrNbr)
    const years = groupBy (getYear) (content .slice (ltrNbr)) .sort (([a], [b]) => b - a)
    const initialYears = years .slice (0, moreYears)
    const laterYears = years .slice (moreYears)

    return `
<div class="sidebar box">
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
    <h2>Subjects</h2>
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

((content) => {
    
    const route = () => {
      const hash = document.location.hash
      if (hash) {
        console .log (hash)
      } else {
        document.location.hash = '#/'
      }
    }
    window.addEventListener ('popstate', () => setTimeout(route, 0))
    route()
    document.getElementById ('root') .innerHTML += makeSidebar(content, 2, 2, 6, 5)
}) (content)
