import { NextRequest, NextResponse } from 'next/server'

// When the app is accessed under a tenant path prefix (e.g. /2170/extndd/...),
// browsers may request static assets with that same prefix:
//   /2170/extndd/images/uploads/...
// Next serves files from /public only at the root:
//   /images/uploads/...
//
// This middleware rewrites prefixed asset URLs to the root paths so images work
// for all tenants regardless of reverse-proxy configuration.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const m = pathname.match(/^\/(\d+)\/([^\/]+)\/(images\/.*)$/)
  if (m) {
    const dest = request.nextUrl.clone()
    dest.pathname = `/${m[3]}`
    return NextResponse.rewrite(dest)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:number/:name/images/:path*'],
}
