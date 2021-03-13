const themes = ((defaultTheme = 'A', colors = {
  'A': {
        'neutral': '#d7e3e5',
        'primary': '#edd8c8',
        'secondary': '#b7ccd2',
        'tertiary': '#dabea6',
        'highlight': '#e4cbb7',
        'text-primary':  '#555555',
        'text-secondary': '#333333',
        'text-tertiary': '#aa938f',
        'text-highlight': '#666666',
     },
  'B': {
     'neutral': '#f8f8f8',
     'primary': '#ffff73',
     'secondary': '#bfbf30',
     'tertiary': '#a6a600',
     'highlight': '#e5e557',
     'text-primary': '#5f2580',
     'text-secondary': '#333333',
     'text-tertiary': '#000000',
     'text-highlight': '#666666',
  },
  'C': {
    'neutral': '#DDDDDD',
    'primary': '#63BCE5',
    'secondary': '#3778C2',
    'tertiary': '#7ED5EA',
    'highlight': '#4B9FE1',
    'text-primary': '#0F2557',
    'text-secondary': '#150734',
    'text-tertiary': '#000000',
    'text-highlight': '#666666',
 },
 'D': {
    'neutral': '#ece5f4',
    'primary': '#ffe1de',
    'secondary': '#c1d7e1',
    'tertiary': '#d9b5c2',
    'highlight': '#fbd2d2',
    'text-primary': '#444444',
    'text-secondary': '#150734',
    'text-tertiary': '#98b8c6',
    'text-highlight': '#666666',
 },
}) => ({
    colors,
    icons: Object .fromEntries (
        Object .entries (colors) .map (
            ([k, {neutral, primary, secondary, tertiary, 'text-tertiary': tt}]) => 
      [k, 
`<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" rx="30" ry="30" width="300" height="200"
      style="fill: ${neutral};"/>
    <rect x="20" y="80" rx="15" ry="15" width="160" height="100"
      style="fill: ${primary}; stroke-width: 2; stroke: ${tt};"/>
    <rect x="200" y="80" rx="15" ry="15" width="80" height="100"
      style="fill: ${secondary}; stroke-width: 2; stroke: ${tt};"/>
    <rect x="20" y="20" rx="15" ry="15" width="260" height="40"
      style="fill: ${tertiary}; stroke-width: 2; stroke: ${tt};"/>
</svg>`])),
    change: (name) => {
        const style = document.querySelector(':root').style
        Object.entries(colors[name] || {}) .forEach (
          ([key, value]) => style .setProperty(`--${key}`, value)
        )  
    },
    defaultTheme
}))()
