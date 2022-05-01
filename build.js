const marked = require ('marked')
const {readdir, readFile: rf, writeFile: wf} = require ('fs') .promises
const makePath = require ('path')

const readFile = (path) => rf (path, 'utf8')
const writeFile = (path) => (content) => wf (path, content, 'utf8')
const combinePaths = (...paths) => (path) => makePath .join (...paths, path)
const allPromises = (ps) => Promise .all (ps)
const stringify = (...args) => (o) => JSON. stringify (o, ...args)

const tap = (fn) => (x) => ((fn (x)), x)
const map = (fn) => (xs) => xs .map (x => fn (x))
const prop = (p) => (o) => o [p]
const prepend = (s1) => (s2) => s1 + s2
const call = (fn, ...args) => fn (...args)
const sort = (fn, dir = 'ascending') => (xs) => 
  xs.sort ((a, b, aa = fn (a), bb = fn (b)) => 
    (dir == 'descending' ? -1 : 1) * (aa < bb ? -1 : aa > bb ? 1 : 0))

const showSavedLetters = () => console .log ('content.js written')
const showSavedPages = () => console .log ('pages.js written')
const showSavedThemes = () => console .log ('themes.js written')
const showSavedAliases = () => console .log ('aliases.js written')
const showSavedWrapper = () => console .log ('letters.html written')
const warnOfError = (err) => console .warn (`Error: ${err}`)

const WARNING = "// Auto-generated content.  Do not edit.\n\n"

const parse = (file) =>
  Object.fromEntries(file 
    .split (/\r?\n/) 
    .map (s => s .trim ()) 
    .reduce (
      ({pairs, state, curr, content, sep}, line, _, __, 
        parts = line.split (':') .map (s => s.trim()).filter(Boolean)
      ) => 
        state == 'md'
          ? line == sep
            ? {pairs: [...pairs, [curr, content.join('\n')]], state: 'meta'}
            : {pairs, state, curr, content: [...content, line], sep}
        : state == 'sep'
          ? {pairs, state: 'md', curr, content, sep: line}
        // state == 'meta'
        : line == ''
          ? {pairs, state, curr, content, sep}
        : parts .length == 1
            ? {pairs, state: 'sep', curr: parts[0], content: []}
            : {pairs: [...pairs, parts], state: 'meta'}
      , {pairs: [], state: 'meta'}
    ).pairs)

const linkPeople = (People, Content, aliases) => 
  console .log (aliases) ||
  People .reduce ((c, p) => c .replace (new RegExp (`(${[p, ...((aliases ||{}) [p] || [])].join('|')})`), (s, t) => `[${t}](#/person/${p.replace(/ /g, '+')}/)`), Content)

const convertLetter = (aliases) => ({Topics = '', People: ps = '', Content, Note = '', ...rest}, 
    People = ps .trim () .split (/\,\s*/) .filter (Boolean)
) => ({
    ...rest,
    Topics: Topics .trim () .split (/\,\s*/),
    People,
    Content: marked (linkPeople (People, Content, aliases)),
    ...(Note.length ? {Note: marked (linkPeople (People, Note))} : {})
})
 
const convertPage = ({Content, 'Sort Order': so, People: ps = '', ...rest},
  People = ps .trim () .split (/\,\s*/) .filter (Boolean)
) => ({
    ...rest,
    ... (so ? {['Sort Order']: Number(so)} : {}),
    People,
    Content: marked (linkPeople (People, Content))
})

// TODO: use real yml processor?
const parseThemes = (txt) =>
  txt .split ('\n') .filter (line => line .trim () != '')
    .reduce (({curr, all}, line) => 
      call (([k, v] = line .trim() .split (/:\s*/)) =>
        ((line .startsWith (' ') ? curr [k] = v : all [line. slice (0, -1) .trim ()] = curr = {}
      ), {curr, all})), {all: {}}
    ) .all

// TODO: use real yml processor?
const parseAliases = (txt) =>
  txt .split ('\n') 
    .filter (Boolean)
    .map (l => l.replace (/\s*:\s*$/, ''))
    .reduce (
      ({all, curr}, line) => line .startsWith (' ')
        ? {all: {...all, [curr]: [...all[curr], line.trim()]}, curr}
        : {all: {...all, [line]: []}, curr: line},
      {all: {}, curr: ''}
    ) .all

const combine = (content, pages, themes, aliases) => ([index, style, process]) =>
  [
    [style, /\<link rel="stylesheet" href="style\.css" \/\>/, `<style type="text/css">$$</style>`],
    [content, /\<script src="content\.js"\>\<\/script\>/, `<script>$$</script>`],
    [pages, /\<script src="pages\.js"\>\<\/script\>/, `<script>$$</script>`],
    [themes, /\<script src="themes\.js"\>\<\/script\>/, `<script>$$</script>`],
    [aliases, /\<script src="aliases\.js"\>\<\/script\>/, `<script>$$</script>`],
    [process, /\<script src="process\.js"\>\<\/script\>/, `<script>$$</script>`],
  ] .reduce ((index, [c, r, h]) =>  index.replace(r, h.replace('$$', `\n${c}\n`)), index)

const makeAllInOne = ([content, pages, themes, aliases]) =>
  Promise.all (['./index.html', './style.css', './process.js'] .map (readFile))
    .then (combine (content, pages, themes, aliases))
    .then (writeFile ('./letters.html'))

const makeLetters = (aliases) =>
  readdir ('./content/letters') 
    .then (map (combinePaths ('./content/letters')))
    .then (map (readFile))
    .then (allPromises)
    .then (map (parse))
    .then (map (convertLetter (aliases)))
    .then (sort (prop ('Date'), 'descending'))
    .then (stringify (null, 2))  
    //.then (stringify ())
    .then (prepend ('const content = '))
    .then (prepend (WARNING))
    .then (tap (writeFile ('content.js')))
    .then (tap (showSavedLetters))

// TODO: extact common features from makeLetters/makePages
const makePages = () =>
  readdir ('./content/pages') 
    .then (map (combinePaths ('./content/pages')))
    .then (map (readFile))
    .then (allPromises)
    .then (map (parse))
    .then (map (convertPage))
    .then (sort (prop ('Sort Order'), 'ascending'))
    .then (stringify (null, 2))  
    //.then (stringify ())
    .then (prepend ('const pages = '))
    .then (prepend (WARNING))
    .then (tap (writeFile ('pages.js')))
    .then (tap (showSavedPages))

const makeThemes = () =>
  readFile ('./content/themes.yml')
    .then (parseThemes)
    .then (stringify (null, 2))  
    //.then (stringify ())
    .then (prepend ('const colors = '))
    .then (prepend (WARNING))
    .then (tap (writeFile ('themes.js')))
    .then (tap (showSavedThemes))

const makeAliases = () =>
  readFile ('./content/aliases.yml')
    .then (parseAliases)
    // .then (tap (aliases => console .log ({msg: 'creation', aliases})))

const saveAliases = (aliases) =>
  Promise.resolve (aliases)
    .then (stringify (null, 2))  
    //.then (stringify ())
    .then (prepend ('const aliases = '))
    .then (prepend (WARNING))
    .then (tap (writeFile ('aliases.js')))
    .then (tap (showSavedAliases))

makeAliases() 
  .then (
    aliases => Promise.all ([makeLetters (aliases), makePages (), makeThemes (), saveAliases(aliases)])
      .then (tap (makeAllInOne))
      .then (tap (showSavedWrapper))
  )
//  .catch (warnOfError)
