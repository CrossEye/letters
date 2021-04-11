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
const showSavedWrapper = () => console .log ('letters.html written')
const warnOfError = (err) => console .warn (`Error: ${err}`)

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

const linkPeople = (People, Content) => 
  People .reduce ((c, p) => c.replace(p, `[${p}](#/person/${p.replace(/ /g, '+')}/)`), Content)

const convertLetter = ({Topics = '', People: ps = '', Content, Note = '', ...rest}, 
    People = ps .trim () .split (/\,\s*/) .filter (Boolean)
) => ({
    ...rest,
    Topics: Topics .trim () .split (/\,\s*/),
    People,
    Content: marked (linkPeople (People, Content)),
    ...(Note.length ? {Note: marked (linkPeople (People, Note))} : {})
})
 
const convertPage = ({Content, 'Sort Order': so, ...rest}) => ({
    ...rest,
    ... (so ? {['Sort Order']: Number(so)} : {}),
    Content: marked (Content)
})

const parseThemes = (txt) =>
  txt .split ('\n') .filter (line => line .trim () != '')
    .reduce (({curr, all}, line) => 
      call (([k, v] = line .trim() .split (/:\s*/)) =>
        ((line .startsWith (' ') ? curr [k] = v : all [line .trim ()] = curr = {}
      ), {curr, all})), {all: {}}
    ) .all

const combine = (content, pages, themes) => ([index, style, process]) =>
  [
    [style, /\<link rel="stylesheet" href="style\.css" \/\>/, `<style type="text/css">$$</style>`],
    [content, /\<script src="content\.js"\>\<\/script\>/, `<script>$$</script>`],
    [pages, /\<script src="pages\.js"\>\<\/script\>/, `<script>$$</script>`],
    [themes, /\<script src="themes\.js"\>\<\/script\>/, `<script>$$</script>`],
    [process, /\<script src="process\.js"\>\<\/script\>/, `<script>$$</script>`],
  ] .reduce ((index, [c, r, h]) =>  index.replace(r, h.replace('$$', `\n${c}\n`)), index)

const makeAllInOne = ([content, pages, themes]) =>
  Promise.all (['./index.html', './style.css', './process.js'] .map (readFile))
    .then (combine (content, pages, themes))
    .then (writeFile ('./letters.html'))

const makeLetters = () =>
  readdir ('./content/letters') 
    .then (map (combinePaths ('./content/letters')))
    .then (map (readFile))
    .then (allPromises)
    .then (map (parse))
    .then (map (convertLetter))
    .then (sort (prop ('Date'), 'descending'))
    .then (stringify (null, 2))  
    //.then (stringify ())
    .then (prepend ('const content = '))
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
    .then (tap (writeFile ('pages.js')))
    .then (tap (showSavedPages))

const makeThemes = () =>
  readFile ('./content/themes.yml')
    .then (parseThemes)
    .then (stringify (null, 2))  
    //.then (stringify ())
    .then (prepend ('const colors = '))
    .then (tap (writeFile ('themes.js')))
    .then (tap (showSavedThemes))


Promise.all ([makeLetters(), makePages(), makeThemes()])
  .then (tap (makeAllInOne))
  .then (tap (showSavedWrapper))
  .catch (warnOfError)
