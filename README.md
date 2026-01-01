# sitemap-manager
An easy way to create sitemaps!

## Features

- Easy to use 😲
- Work fast 🚀
- Xml with xsl. For search engines or for human visions? Don't choose, for both! 🥳
- Put different pages into different sitemaps. 🧺
- Duplicate URLs are skipped and surfaced via the warning hook.

## Usage

Step 1. Install sitemap-manager.
```zsh
// For npm users
npm install sitemap-manager --save

// For yarn users
yarn add sitemap-manager
```

Step2. Import sitemap-manager
```js
const { SitemapManager } = require('sitemap-manager')
// or
import { SitemapManager } from 'sitemap-manager'
```

Step3. "New" a class
```js
const MySitemap = new SitemapManager({
    /* Options here */
    siteURL: ''/*URL*/,
    pathPrefix: ''/*Site Prefix*/,
    outDir: ''/*Output dir*/,
})
```

Step4. Add urls
```js
MySitemap.addUrl(/*Category name here*/, [
    { loc: ''/*URL*/, lastmod: ''||new Date()/*Last modification time*/, changefreq: ''||1-7/*Change frequence*/, priority: 0.0-1.0 /*Priority*/ },
    /*You can add more!*/
])
```

Optional: customize lifecycle hooks (e.g. silence duplicate warnings):
```js
const MySitemap = new SitemapManager({
    siteURL: 'https://example.com',
    hooks: {
        warningHandler: (msg) => console.warn(msg)
    }
})
```

Step5. Finish!
```js
MySitemap.finish().then(()=>{/*sth here*/}).catch((e)=>{/*sth here*/})
```

Check [Wiki](https://github.com/CBW2007/sitemap-manager/wiki) for more information.

## LICENSE

MIT