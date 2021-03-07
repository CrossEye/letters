const marked = require ('marked')
const {readdir, readFile: rf, writeFile: wf} = require ('fs') .promises
const makePath = require ('path')

const readFile = (path) => rf (path, 'utf8')
const writeFile = (path) => (content) => wf (path, content, 'utf8')
const combinePaths = (...paths) => (path) => makePath .join (...paths, path)
const map = (fn) => (xs) => xs .map (x => fn (x))
const allPromises = (ps) => Promise .all (ps)
const stringify = (...args) => (o) => JSON. stringify (o, ...args)
const prepend = (s1) => (s2) => s1 + s2
const success = () => console .log ('content.js written')
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

const convert = ({Tags, People, Content, ...rest}) => ({
    ...rest,
    Tags: Tags .trim () .split (/\,\s*/),
    People: People .trim () .split (/\,\s*/),
    Content: marked(Content)
})

readdir ('./content') 
  .then (map (combinePaths ('./content')))
  .then (map (readFile))
  .then (allPromises)
  .then (map (parse))
  .then (map (convert))
  // .then (stringify (null, 4))
  .then (stringify ())
  .then (prepend ('const content = '))
  .then (writeFile ('content.js'))
  .then (success)
  .catch (warnOfError)
