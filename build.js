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
const sort = (fn, dir = 'ascending') => (xs) => 
  xs.sort ((a, b, aa = fn (a), bb = fn (b)) => 
    (dir == 'descending' ? -1 : 1) * (aa < bb ? -1 : aa > bb ? 1 : 0))

const showSavedContent = () => console .log ('content.js written')
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
  People .reduce ((c, p) => c.replace(p, `[${p}](#/person/${p.replace(/ /g, '+')})`), Content)

const convert = ({Tags = '', People: ps = '', Content, ...rest}, 
    People = ps .trim () .split (/\,\s*/) .filter (Boolean)
) => ({
    ...rest,
    Tags: Tags .trim () .split (/\,\s*/),
    People,
    Content: marked (linkPeople (People, Content))
})

const combine = (content) => ([index, style, themes, process]) =>
  index 
    .replace (
      /\<link rel="stylesheet" href="style\.css" \/\>/,
      `<style type="text/css">
${style}
</style>`
    )
    .replace (
      /\<script src="content\.js"\>\<\/script\>/,
      `<script>
${content}
</script>`
    )
    .replace (
      /\<script src="themes\.js"\>\<\/script\>/,
      `<script>
${themes}
</script>`
    )
    .replace (
      /\<script src="process\.js"\>\<\/script\>/,
      `<script>
${process}
</script>`
    )

const makeAllInOne = (content) =>
  Promise.all (['./index.html', './style.css', './themes.js', './process.js'] .map (readFile))
    .then (combine (content))
    .then (writeFile ('./letters.html'))
    .then (() => content)

readdir ('./content') 
  .then (map (combinePaths ('./content')))
  .then (map (readFile))
  .then (allPromises)
  .then (map (parse))
  .then (map (convert))
  .then (sort (prop ('Date'), 'descending'))
  .then (stringify (null, 4))  
  //.then (stringify ())
  .then (prepend ('const content = '))
  .then (tap (writeFile ('content.js')))
  .then (tap (showSavedContent))
  .then (makeAllInOne)
  .then (tap (showSavedWrapper))
  .catch (warnOfError)
