import TurndownService from 'turndown'

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
})

turndown.remove(['script', 'style', 'iframe', 'form'])

export function htmlToMarkdown(html: string | null): string | null {
  if (!html) return null
  return turndown.turndown(html).trim() || null
}
