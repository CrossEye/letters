const themes = ((defaultTheme = 'Sandy Beach', colors = {
  'Sandy Beach': {
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
  'Mellow Yellow': {
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
  'Tangled Up in Blue': {
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
  'Lazy Sunday': {
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
  'Infrared': {
    'neutral': '#333333',
    'primary': '#de534c',
    'secondary': '#3c1874',
    'tertiary': '#283747',
    'highlight': '#cb3c3f',
    'text-primary':  '#f3f3f3',
    'text-secondary': '#cccccc',
    'text-tertiary': '#dddddd',
    'text-highlight': '#eeeeee',
  },
  'Grape': {
    'neutral': '#e5eaf5',
    'primary': '#a0d2eb',
    'secondary': '#d0bdf4',
    'tertiary': '#8458b3',
    'highlight': '#bdc7cf',
    'text-primary': '#494d5f',
    'text-secondary': '#333333',
    'text-tertiary': '#000000',
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
    choose: (name) => {
        const style = document.querySelector(':root').style
        Object.entries(colors[name] || {}) .forEach (
          ([key, value]) => style .setProperty(`--${key}`, value)
        )  
    },
    defaultTheme
}))()

const config = JSON.parse(localStorage .getItem ('letters') || "{}")
if (config.theme) {themes .choose (config .theme)}