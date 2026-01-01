import { URL } from 'url'
import path from 'path'
import * as utils from './utils'
import { Options, UrlObj, FullOptions } from './types'

// src: src/sitemap.xsl
const xmlStylesheet = Buffer.from('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjx4c2w6c3R5bGVzaGVldCB4bWxuczp4c2w9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvWFNML1RyYW5zZm9ybSIgeG1sbnM6c2l0ZW1hcD0iaHR0cDovL3d3dy5zaXRlbWFwcy5vcmcvc2NoZW1hcy9zaXRlbWFwLzAuOSIgeG1sbnM6Zm49Imh0dHA6Ly93d3cudzMub3JnLzIwMDUvMDIveHBhdGgtZnVuY3Rpb25zIiB2ZXJzaW9uPSIxLjAiPjx4c2w6dGVtcGxhdGUgbWF0Y2g9Ii8iPjxodG1sPjxoZWFkPjx0aXRsZT5TaXRlbWFwPC90aXRsZT48bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEsIG1heGltdW0tc2NhbGU9MSwgc2hyaW5rLXRvLWZpdD1ubyIvPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJCSAJCS5hLW5vLXVsOjpiZWZvcmUgew0KCQkgCQkJZGlzcGxheTogbm9uZTsNCgkJIAkJfQ0KCQkJPC9zdHlsZT48IS0tIE1EVUkgQ1NTIC0tPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tZHVpQDEuMC4xL2Rpc3QvY3NzL21kdWkubWluLmNzcyIgaW50ZWdyaXR5PSJzaGEzODQtY0xSck1xMzlIT1pkdkUwajZ5Qm9qTzQrMVBySGZCN2E5bDVxTGNtUm0vZmlXWFlZK0NuZEpQbXl1NUZWLzlUdyIgY3Jvc3NvcmlnaW49ImFub255bW91cyIvPjwvaGVhZD48Ym9keT48ZGl2IGNsYXNzPSJtZHVpLWNvbnRhaW5lciBtZHVpLXR5cG8iPjxoMSBzdHlsZT0idGV4dC1hbGlnbjpjZW50ZXIiPlNpdGVtYXA8L2gxPjxkaXYgY2xhc3M9Im1kdWktZGl2aWRlciIvPjx4c2w6aWYgdGVzdD0iY291bnQoc2l0ZW1hcDpzaXRlbWFwaW5kZXgvc2l0ZW1hcDpzaXRlbWFwKSAmbHQ7IDEiPjxhIGhyZWY9InNpdGVtYXAueG1sIiBjbGFzcz0ibWR1aS1idG4gYS1uby11bCI+PGkgY2xhc3M9Im1kdWktaWNvbiBtYXRlcmlhbC1pY29ucyI+7oybPC9pPmJhY2sgdG8gaW5kZXg8L2E+PC94c2w6aWY+PHhzbDppZiB0ZXN0PSJjb3VudChzaXRlbWFwOnNpdGVtYXBpbmRleC9zaXRlbWFwOnNpdGVtYXApICZsdDsgMSI+PHRhYmxlIGNsYXNzPSJtZHVpLXRhYmxlIj48dGhlYWQ+PHRyPjx0aCBzdHlsZT0id2lkdGg6NzAlIj5VUkw8L3RoPjx0aCBzdHlsZT0id2lkdGg6MjAlIj5MYXN0IG1vZGlmaWNhdGlvbiB0aW1lPC90aD48dGggc3R5bGU9IndpZHRoOjUlIj5DaGFuZ2UgZnJlcXVlbmNlPC90aD48dGggc3R5bGU9IndpZHRoOjUlIj5Qcmlvcml0eTwvdGg+PC90cj48L3RoZWFkPjx0Ym9keT48eHNsOmZvci1lYWNoIHNlbGVjdD0ic2l0ZW1hcDp1cmxzZXQvc2l0ZW1hcDp1cmwiPjx0cj48dGQ+PHhzbDp2YXJpYWJsZSBuYW1lPSJsb2NVcmwiPjx4c2w6dmFsdWUtb2Ygc2VsZWN0PSJzaXRlbWFwOmxvYyIvPjwveHNsOnZhcmlhYmxlPjxhIGhyZWY9InskbG9jVXJsfSI+PHhzbDp2YWx1ZS1vZiBzZWxlY3Q9InNpdGVtYXA6bG9jIi8+PC9hPjwvdGQ+PHRkPjx4c2w6dmFsdWUtb2Ygc2VsZWN0PSJzaXRlbWFwOmxhc3Rtb2QiLz48L3RkPjx0ZD48eHNsOnZhbHVlLW9mIHNlbGVjdD0ic2l0ZW1hcDpjaGFuZ2VmcmVxIi8+PC90ZD48dGQ+PHhzbDp2YWx1ZS1vZiBzZWxlY3Q9InNpdGVtYXA6cHJpb3JpdHkiLz48L3RkPjwvdHI+PC94c2w6Zm9yLWVhY2g+PC90Ym9keT48L3RhYmxlPjwveHNsOmlmPjx4c2w6aWYgdGVzdD0iY291bnQoc2l0ZW1hcDpzaXRlbWFwaW5kZXgvc2l0ZW1hcDpzaXRlbWFwKSAmZ3Q7IDAiPjx0YWJsZSBjbGFzcz0ibWR1aS10YWJsZSI+PHRoZWFkPjx0cj48dGggc3R5bGU9IndpZHRoOjgwJSI+VVJMPC90aD48dGggc3R5bGU9IndpZHRoOjIwJSI+TGFzdCBtb2RpZmljYXRpb24gdGltZTwvdGg+PC90cj48L3RoZWFkPjx0Ym9keT48eHNsOmZvci1lYWNoIHNlbGVjdD0ic2l0ZW1hcDpzaXRlbWFwaW5kZXgvc2l0ZW1hcDpzaXRlbWFwIj48dHI+PHRkPjx4c2w6dmFyaWFibGUgbmFtZT0ibG9jVXJsIj48eHNsOnZhbHVlLW9mIHNlbGVjdD0ic2l0ZW1hcDpsb2MiLz48L3hzbDp2YXJpYWJsZT48YSBocmVmPSJ7JGxvY1VybH0iPjx4c2w6dmFsdWUtb2Ygc2VsZWN0PSJzaXRlbWFwOmxvYyIvPjwvYT48L3RkPjx0ZD48eHNsOnZhbHVlLW9mIHNlbGVjdD0ic2l0ZW1hcDpsYXN0bW9kIi8+PC90ZD48L3RyPjwveHNsOmZvci1lYWNoPjwvdGJvZHk+PC90YWJsZT48L3hzbDppZj48L2Rpdj48IS0tIE1EVUkgSmF2YVNjcmlwdCAtLT48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tZHVpQDEuMC4xL2Rpc3QvanMvbWR1aS5taW4uanMiIGludGVncml0eT0ic2hhMzg0LWdDTVpjc2hZS09HUlg5cjZ3YkRydkYrVGNDQ3N3U0hGdWNVelVQd2thK0dyK3VIZ2psWXZrQUJyOTVUQ096M0EiIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiLz48L2JvZHk+PC9odG1sPjwveHNsOnRlbXBsYXRlPjwveHNsOnN0eWxlc2hlZXQ+DQo=', 'base64').toString()
const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>'
const xmlns = 'http://www.sitemaps.org/schemas/sitemap/0.9'

class SitemapManager {
  options: FullOptions
  #urlDatas: Record<string, string> = {}
  #urls: Set<string> = new Set()
  #isFinished: boolean = false

  constructor (options: Options) {
    this.options = {
      outDir: options.outDir || './public',
      siteURL: options.siteURL,
      pathPrefix: options.pathPrefix || '',
      hooks: {
        warningHandler: options.hooks?.warningHandler || utils.defaultHookSet.defaultWarningHandler,
        fileHandler: options.hooks?.fileHandler || utils.defaultHookSet.defaultFileHandler
      }
    }
  }

  addUrl (category: string, url: UrlObj[] | UrlObj): void {
    if (this.#isFinished) { throw new Error('[SitemapManager] Error: Lifecycle finished') }
    const urls = Array.isArray(url) ? url : [url]
    urls.forEach((value) => {
      const locString = value.loc.toString()
      if (this.#urls.has(locString)) {
        this.options.hooks.warningHandler(`Url ${locString} is repeated.`)
        return
      }

      this.#urls.add(locString)
      if (!this.#urlDatas[category]) {
        this.#urlDatas[category] = ''
      }
      this.#urlDatas[category] += `<url>${utils.objToString(value, this.options.hooks.warningHandler)}</url>`
    })
  }

  finish (): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.#isFinished) { reject(new Error('[SitemapManager] Error: Lifecycle finished')) }
      this.#isFinished = true

      // Create index sitemap
      let xmlContents = ''
      for (const category in this.#urlDatas) {
        xmlContents = xmlContents + `<sitemap>${utils.objToString({
          loc: new URL(
            path.join(this.options.pathPrefix || '', `sitemap-${category}.xml`),
            this.options.siteURL
          ),
          lastmod: new Date()
        }, this.options.hooks.warningHandler)
        }</sitemap>`
      }
      try {
        this.options.hooks.fileHandler(
          path.resolve(this.options?.outDir || './public', 'sitemap.xml'),
          xmlDeclaration + `<sitemapindex xmlns="${xmlns}">${xmlContents}</sitemapindex>`
        )
      } catch (e) {
        reject(new Error(`[SitemapManager] Failed to write file sitemap.xml: ${(e as Error).message}`))
      }

      // Create each sitemap
      for (const category in this.#urlDatas) {
        try {
          this.options.hooks.fileHandler(
            path.resolve(this.options?.outDir || './public', `sitemap-${category}.xml`),
            xmlDeclaration + `<urlset xmlns="${xmlns}">${this.#urlDatas[category]}</urlset>`
          )
        } catch (e) {
          reject(new Error(`[SitemapManager] Failed to write file sitemap.xml: ${(e as Error).message}`))
        }
      }

      // Create sitemap stylesheet
      try {
        this.options.hooks.fileHandler(path.resolve(this.options?.outDir || './public', 'sitemap.xsl'), xmlStylesheet)
      } catch (e) {
        reject(new Error(`[SitemapManager]: Failed to write file sitemap.xsl: ${(e as Error).message}`))
      }

      resolve()
    })
  }
}

export { SitemapManager }
