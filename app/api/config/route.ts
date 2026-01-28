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
            return NextResponse.json({ error: 'catalog_not_found' }, { status: 404 })
        }

        // Check if user is registered
        const userCheck = await prisma.$queryRaw<Array<{ is_registered: number }>>`
            SELECT is_registered FROM users WHERE id = ${userId} LIMIT 1
        `
        
        if (userCheck.length === 0 || userCheck[0].is_registered === 0) {
            return NextResponse.json({ error: 'catalog_not_registered' }, { status: 404 })
        }

        // 1. Get Settings for this specific user
        const settings = await prisma.$queryRaw<Array<{ key: string, value: string }>>`
            SELECT key, value FROM settings 
            WHERE user_id = ${userId}
        `;

        // 2. Get User Info (Project Name, Links) directly from users table
        const user = await prisma.$queryRaw<Array<{ project_name: string, link_direct: string, link_telegram: string }>>`
            SELECT project_name, link_direct, link_telegram FROM users 
            WHERE id = ${userId} LIMIT 1
        `;

        const config = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {} as Record<string, string>)

        // Ensure defaults if missing
        if (user.length > 0) {
            if (!config.project_name && user[0].project_name) config.project_name = user[0].project_name;
            if (!config.link_direct && user[0].link_direct) config.link_direct = user[0].link_direct;
            if (!config.link_telegram && user[0].link_telegram) config.link_telegram = user[0].link_telegram;
        }

        return NextResponse.json(config)
    } catch (error) {
        console.error('Config fetch error:', error)
        return NextResponse.json({ error: 'server_error' }, { status: 500 })
    }
}
