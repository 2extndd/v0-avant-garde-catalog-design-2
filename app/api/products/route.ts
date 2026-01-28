import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Helper to get user_id from request context (slug or host)
async function getUserIdFromRequest(request: Request): Promise<number | null> {
    try {
        const url = new URL(request.url)
        
        // 1. Check for slug in query params (e.g., ?slug=username)
        const slugParam = url.searchParams.get('slug')
        if (slugParam) {
            const user = await prisma.$queryRaw<Array<{ id: number }>>`
                SELECT id FROM users WHERE site_slug = ${slugParam} LIMIT 1
            `
            if (user.length > 0) return user[0].id
        }
        
        // 2. user_id query param is intentionally NOT supported in public multi-tenant mode.
        // It would allow enumerating and accessing other tenants' data.
        // Use slug (path/query) or subdomain instead.
        
        // 3. Parse subdomain from host (e.g., username.site.com)
        const host = (request.headers.get('host') || '').split(':')[0]
        const subdomain = host.split('.')[0]
        if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
            // Support both pure slugs ("username") and composite slugs ("1234/username")
            // when using subdomain routing.
            const user = await prisma.$queryRaw<Array<{ id: number }>>`
                SELECT id FROM users
                WHERE site_slug = ${subdomain}
                   OR site_slug LIKE ${'%/' + subdomain}
                LIMIT 1
            `
            if (user.length > 0) return user[0].id
        }
        
        // 4. No fallback - require explicit slug or user_id for multi-tenant isolation
        // Users must be registered (is_registered = 1) to have a site
        
        return null
    } catch (error) {
        console.error('Error getting user_id:', error)
        return null
    }
}

export async function GET(request: Request) {
    try {
        // Get user_id for multi-tenant isolation
        const userId = await getUserIdFromRequest(request)
        
        if (!userId) {
            return NextResponse.json([])
        }
        
        // Fetch products ONLY for this user
        const productsInDb = await prisma.$queryRaw<any[]>`
            SELECT 
                id, name, size, description, price, original_price, condition,
                images, status, telegram_message_id, CAST(telegram_channel_id AS TEXT) as telegram_channel_id,
                created_at, updated_at, is_featured, year, material, layout_index
            FROM products 
            WHERE user_id = ${userId}
            ORDER BY created_at DESC, id DESC
        `

        const formattedProducts = productsInDb.map((p: any) => {
            let images = []
            try {
                images = JSON.parse(p.images || '[]')
            } catch (e) {
                images = []
            }

            return {
                id: p.id,
                name: p.name ? p.name.toUpperCase() : 'NO NAME',
                price: p.price,
                originalPrice: p.original_price,
                // Raw numeric price for sorting
                priceValue: parseInt(String(p.price).replace(/\D/g, '')) || 0,
                // Raw date for sorting
                createdAt: p.created_at,
                updatedAt: p.updated_at,
                size: p.size,
                condition: p.condition,
                image: images[0] || '/placeholder.svg',
                images: images,
                description: p.description,
                year: p.year || '',
                material: p.material || '',
                status: p.status,
                is_featured: p.is_featured,
                layout_index: p.layout_index,
                category: '' // Placeholder
            }
        })

        return NextResponse.json(formattedProducts)
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Error fetching products', details: String(error) }, { status: 500 })
    }
}
