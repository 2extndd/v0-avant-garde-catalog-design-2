import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureOrdersSchema } from './migrations'

export const dynamic = 'force-dynamic'

async function getUserIdFromRequest(request: Request): Promise<number | null> {
  try {
    const url = new URL(request.url)

    // 1) slug in query
    const slugParam = url.searchParams.get('slug')
    if (slugParam) {
      const user = await prisma.$queryRaw<Array<{ id: number }>>`
        SELECT id FROM users WHERE site_slug = ${slugParam} LIMIT 1
      `
      if (user.length > 0) return user[0].id
    }

    // 2) subdomain
    const host = (request.headers.get('host') || '').split(':')[0]
    const subdomain = host.split('.')[0]
    if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
      const user = await prisma.$queryRaw<Array<{ id: number }>>`
        SELECT id FROM users
        WHERE site_slug = ${subdomain}
           OR site_slug LIKE ${'%/' + subdomain}
        LIMIT 1
      `
      if (user.length > 0) return user[0].id
    }

    return null
  } catch (e) {
    console.error('Error getting user_id:', e)
    return null
  }
}

function normalizeBuyerContact(value: string): string {
  const v = (value || '').trim()
  if (!v) return ''
  // store without leading @ to keep consistent
  return v.startsWith('@') ? v.slice(1) : v
}

export async function POST(request: Request) {
  try {
    await ensureOrdersSchema()

    const userId = await getUserIdFromRequest(request)
    if (!userId) return NextResponse.json({ error: 'catalog_not_found' }, { status: 404 })

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 })
    }

    const buyerTelegram = normalizeBuyerContact(String((body as any).buyerTelegram || ''))
    const items = (body as any).items as Array<{ productId: number; qty?: number }> | undefined

    if (!buyerTelegram) {
      return NextResponse.json({ error: 'buyer_telegram_required' }, { status: 400 })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items_required' }, { status: 400 })
    }

    // Fetch products for this tenant to prevent cross-tenant access
    const productIds = [...new Set(items.map(i => Number(i.productId)).filter(Boolean))]
    
    if (productIds.length === 0) {
      return NextResponse.json({ error: 'no_products_specified' }, { status: 400 })
    }
    
    // Build safe SQL for IN clause (SQLite doesn't support arrays directly)
    const placeholders = productIds.map(() => '?').join(', ')
    const products = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, price, images, status
       FROM products
       WHERE user_id = ?
         AND id IN (${placeholders})`,
      userId,
      ...productIds
    )

    const byId = new Map<number, any>(products.map(p => [p.id, p]))

    // Build order lines, ignoring unknown ids
    const lines: any[] = []
    for (const it of items) {
      const pid = Number(it.productId)
      const qty = Math.max(1, Number(it.qty || 1))
      const p = byId.get(pid)
      if (!p) continue
      lines.push({ product_id: pid, qty })
    }

    if (lines.length === 0) {
      return NextResponse.json({ error: 'no_valid_items' }, { status: 400 })
    }

    const order = await prisma.$transaction(async (tx) => {
      // Create order
      await tx.$executeRaw`
        INSERT INTO orders (user_id, buyer_telegram, status)
        VALUES (${userId}, ${buyerTelegram}, 'NEW')
      `

      // SQLite compatibility: do not rely on RETURNING (not available on older versions).
      const row = await tx.$queryRaw<Array<{ id: number }>>`
        SELECT last_insert_rowid() as id
      `
      const orderId = row?.[0]?.id
      if (!orderId) throw new Error('order_create_failed')

      for (const line of lines) {
        await tx.$executeRaw`
          INSERT INTO order_items (order_id, product_id, qty)
          VALUES (${orderId}, ${line.product_id}, ${line.qty})
        `
      }

      return orderId
    })

    // Convert BigInt to number for JSON serialization
    return NextResponse.json({ ok: true, orderId: Number(order) })
  } catch (e: any) {
    console.error('Order create error:', e)
    console.error('Stack:', e?.stack)

    // Provide stable error codes for UI.
    const msg = (e?.message || String(e) || '').toLowerCase()
    const errCode = msg.includes('sqlite') && msg.includes('locked')
      ? 'db_locked'
      : msg.includes('no such table')
        ? 'db_schema_missing'
        : 'server_error'

    return NextResponse.json(
      {
        error: errCode,
        details: String(e),
        message: e?.message || 'Unknown error',
      },
      { status: 500 },
    )
  }
}
