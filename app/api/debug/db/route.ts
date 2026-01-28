import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function requireDebugToken(request: Request): NextResponse | null {
  const debugToken = process.env.DEBUG_TOKEN
  const url = new URL(request.url)

  // Security: debug endpoint must ALWAYS be protected.
  // If DEBUG_TOKEN is not set, deny by default.
  if (!debugToken) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const token = url.searchParams.get('token') || request.headers.get('x-debug-token')
  if (!token || token !== debugToken) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  return null
}

export async function GET(request: Request) {
  const deny = requireDebugToken(request)
  if (deny) return deny

  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')

  try {
    const usersCount = await prisma.$queryRaw<Array<{ cnt: number }>>`
      SELECT COUNT(*) as cnt FROM users
    `
    const productsCount = await prisma.$queryRaw<Array<{ cnt: number }>>`
      SELECT COUNT(*) as cnt FROM products
    `

    let user: any = null
    let userProducts: any[] = []

    if (slug) {
      const users = await prisma.$queryRaw<any[]>`
        SELECT id, telegram_id, telegram_username, site_slug, project_name, is_registered, created_at
        FROM users WHERE site_slug = ${slug} LIMIT 1
      `
      user = users[0] || null

      if (user?.id) {
        userProducts = await prisma.$queryRaw<any[]>`
          SELECT id, name, status, created_at, updated_at
          FROM products
          WHERE user_id = ${user.id}
          ORDER BY id DESC LIMIT 20
        `
      }
    }

    const lastUsers = await prisma.$queryRaw<any[]>`
      SELECT id, telegram_id, telegram_username, site_slug, project_name, is_registered, created_at
      FROM users ORDER BY id DESC LIMIT 10
    `

    const lastProducts = await prisma.$queryRaw<any[]>`
      SELECT id, user_id, name, status, created_at, updated_at
      FROM products ORDER BY id DESC LIMIT 20
    `

    return NextResponse.json({
      counts: {
        users: usersCount?.[0]?.cnt ?? 0,
        products: productsCount?.[0]?.cnt ?? 0,
      },
      slug,
      user,
      userProducts,
      lastUsers,
      lastProducts,
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'db_debug_failed', details: String(e) }, { status: 500 })
  }
}
