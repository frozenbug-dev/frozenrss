import {performance} from 'node:perf_hooks'

import type {Context, Next} from 'hono'

import {log} from '../logger.ts'

export interface RequestContext {
  userAgent?: string
  clientIp?: string
  country?: string
  region?: string
  city?: string
  lat?: string
  lon?: string
}

export function withRequestContext() {
  return async (c: Context<{Variables: {request: RequestContext}}>, next: Next) => {
    const xForwardedFor = c.req.header('x-forwarded-for')
    const xRealIp = c.req.header('x-real-ip')

    // cloudflare-specific headers
    const cfIp = c.req.header('cf-connecting-ip')
    const cfVisitor = c.req.header('cf-visitor')
    const visitorData: {country: string} | undefined = cfVisitor ? JSON.parse(cfVisitor) : undefined

    // aws cloudfront-specific headers
    // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/adding-cloudfront-headers.html
    const cloudfrontCountry = c.req.header('CloudFront-Viewer-Country')
    const cloudfrontRegion = c.req.header('CloudFront-Viewer-Country-Region')
    const cloudfrontCity = c.req.header('CloudFront-Viewer-City')
    const cloudfrontLat = c.req.header('CloudFront-Viewer-Latitude')
    const cloudfrontLon = c.req.header('CloudFront-Viewer-Longitude')

    c.set('request', {
      userAgent: c.req.header('user-agent'),
      clientIp: cfIp || (xForwardedFor?.split(',')[0] || xRealIp)?.trim(),
      country: visitorData?.country || cloudfrontCountry,
      region: cloudfrontRegion,
      city: cloudfrontCity,
      lat: cloudfrontLat,
      lon: cloudfrontLon,
    })

    const startMs = performance.now()
    log.info(`req: ${c.req.method} ${c.req.path}`)

    await next()

    const elapsedMs = performance.now() - startMs
    log.info(`res: ${c.res.status} ${c.req.method} ${c.req.path} ${elapsedMs.toFixed(0)}ms`)
  }
}
