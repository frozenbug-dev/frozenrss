import {chromium} from 'playwright'

import {ENV} from '../../env.ts'
import {http} from './ky.ts'

/**
 * A small utility that tries to fetch the HTML from a page.
 *
 * Tries with normal HTTP request and if that fails it falls back to Playwright. This can help when
 * websites try to block certain request patterns but not bulletproof.
 *
 * @param url
 * @returns HTML string
 */
export async function fetchPage(url: string): Promise<string> {
  const response = await http.get(url, {throwHttpErrors: false})
  const text = await response.text()

  if (response.ok && text.trim().length > 0 && !looksLikeSPA(text)) {
    return text
  }

  try {
    const browser = await chromium.connect(ENV.PLAYWRIGHT_WS_URL)
    const page = await browser.newPage()
    await page.goto(url, {waitUntil: 'networkidle'})
    const html = await page.content()
    await browser.close()

    return html
  } catch {
    throw new Error(`Failed to fetch page. HTTP returned empty body and Playwright is not available.`)
  }
}

function looksLikeSPA(html: string): boolean {
  if (/<div[^>]*id=["'](root|app|__next|__nuxt)["'][^>]*>\s*<\/div>/i.test(html)) {
    return true
  }

  if (/<script[^>]*id=["'](__NEXT_DATA__|__NUXT__|__SAPPER__)["']/i.test(html)) {
    return true
  }

  return false
}
