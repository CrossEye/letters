const themes = ((defaultTheme = 'Echo Beach', colors = {
  "Echo Beach": {
    "neutral": "#d7e3e5",
    "border": "#aa938f",
    "accent": "#666666",
    "primary-background": "#edd8c8",
    "primary-text": "#555555",
    "primary-highlight": "#e4cbb7",
    "primary-accent": "#b7ccd2",
    "secondary-background": "#b7ccd2",
    "secondary-text": "#555555",
    "secondary-highlight": "#b7ccd2",
    "secondary-accent": "#dabea6",
    "tertiary-background": "#dabea6",
    "tertiary-text": "#555555",
    "tertiary-highlight": "#dabea6",
    "tertiary-accent": "#b7ccd2"
  },
  "Mellow Yellow": {
    "neutral": "#f8f8f8",
    "border": "#000000",
    "accent": "#666666",
    "primary-background": "#ffff73",
    "primary-text": "#5f2580",
    "primary-highlight": "#e5e557",
    "primary-accent": "#bfbf30",
    "secondary-background": "#bfbf30",
    "secondary-text": "#5f2580",
    "secondary-highlight": "#bfbf30",
    "secondary-accent": "#a6a600",
    "tertiary-background": "#a6a600",
    "tertiary-text": "#5f2580",
    "tertiary-highlight": "#a6a600",
    "tertiary-accent": "#bfbf30"
  },
  "Tangled Up in Blue": {
    "neutral": "#DDDDDD",
    "border": "#000000",
    "accent": "#666666",
    "primary-background": "#63BCE5",
    "primary-text": "#0F2557",
    "primary-highlight": '#4B9FE1',
    "primary-accent": "#3778C2",
    "secondary-background": "#3778C2",
    "secondary-text": "#0F2557",
    "secondary-highlight": "#3778C2",
    "secondary-accent": "#7ED5EA",
    "tertiary-background": "#7ED5EA",
    "tertiary-text": "#0F2557",
    "tertiary-highlight": "#7ED5EA",
    "tertiary-accent": "#3778C2"
  },
  "Lazy Sunday": {
    "neutral": "#ece5f4",
    "border": "#98b8c6",
    "accent": "#666666",
    "primary-background": "#ffe1de",
    "primary-text": "#444444",
    "primary-highlight": "#fbd2d2",
    "primary-accent": "#c1d7e1",
    "secondary-background": "#c1d7e1",
    "secondary-text": "#444444",
    "secondary-highlight": "#c1d7e1",
    "secondary-accent": "#d9b5c2",
    "tertiary-background": "#d9b5c2",
    "tertiary-text": "#444444",
    "tertiary-highlight": "#d9b5c2",
    "tertiary-accent": "#c1d7e1"
  },
  "Radioactive": {
    "neutral": "#333333",
    "border": "#dddddd",
    "accent": "#eeeeee",
    "primary-background": "#de534c",
    "primary-text": "#f3f3f3",
    "primary-highlight": '#cb3c3f',
    "primary-accent": "#3c1874",
    "secondary-background": "#3c1874",
    "secondary-text": "#f3f3f3",
    "secondary-highlight": "#3c1874",
    "secondary-accent": "#283747",
    "tertiary-background": "#283747",
    "tertiary-text": "#f3f3f3",
    "tertiary-highlight": "#283747",
    "tertiary-accent": "#3c1874"
  },
  "Purple Haze": {
    "neutral": "#e5eaf5",
    "border": "#000000",
    "accent": "#666666",
    "primary-background": "#a0d2eb",
    "primary-text": "#494d5f",
    "primary-highlight": "#86ccf0",
    "primary-accent": "#d0bdf4",
    "secondary-background": "#d0bdf4",
    "secondary-text": "#494d5f",
    "secondary-highlight": "#d0bdf4",
    "secondary-accent": "#af8ad3",
    "tertiary-background": "#8458b3",
    "tertiary-text": "#e5eaf5",
    "tertiary-highlight": "#8458b3",
    "tertiary-accent": "#af8ad3"
  }
}) => ({
    colors,
    icons: Object .fromEntries (
        Object .entries (colors) .map (
            ([k, {neutral, 'primary-background': primary, 'secondary-background': secondary, 'tertiary-background': tertiary, border}]) => 
      [k, 
`<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" rx="30" ry="30" width="300" height="200"
      style="fill: ${neutral};"/>
    <rect x="20" y="80" rx="15" ry="15" width="160" height="100"
      style="fill: ${primary}; stroke-width: 2; stroke: ${border};"/>
    <rect x="200" y="80" rx="15" ry="15" width="80" height="100"
      style="fill: ${secondary}; stroke-width: 2; stroke: ${border};"/>
    <rect x="20" y="20" rx="15" ry="15" width="260" height="40"
      style="fill: ${tertiary}; stroke-width: 2; stroke: ${border};"/>
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