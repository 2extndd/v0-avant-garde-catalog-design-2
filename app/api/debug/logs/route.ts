import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

function redactSecrets(input: string): string {
  if (!input) return input
  let s = input
  // Telegram bot token pattern: <digits>:<35-ish urlsafe>
  s = s.replace(/\b\d{6,12}:[A-Za-z0-9_-]{20,}\b/g, '***REDACTED_BOT_TOKEN***')
  // Common env-style tokens
  s = s.replace(/(BOT_TOKEN\s*=\s*)([^\s\n]+)/g, '$1***REDACTED***')
  s = s.replace(/(DEBUG_TOKEN\s*=\s*)([^\s\n]+)/g, '$1***REDACTED***')
  return s
}

function tailLines(filePath: string, maxLines: number): string[] {
  // Simple implementation: read file and take last N lines.
  // For large files this is not optimal, but acceptable for short-term debug.
  const raw = fs.readFileSync(filePath, 'utf-8')
  const lines = raw.split(/\r?\n/)
  return lines.slice(Math.max(0, lines.length - maxLines)).filter(Boolean)
}

export async function GET(request: Request) {
  const debugToken = process.env.DEBUG_TOKEN
  const url = new URL(request.url)

  // TEMPORARY: if DEBUG_TOKEN is not set, allow access (unsafe). Set DEBUG_TOKEN to lock it down.
  if (debugToken) {
    const token = url.searchParams.get('token') || request.headers.get('x-debug-token')
    if (!token || token !== debugToken) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
  }

  const maxLines = Math.min(parseInt(url.searchParams.get('lines') || '300', 10) || 300, 2000)

  // Bot writes logs into /app/data (same docker volume as sqlite)
  const logPath = path.join('/app', 'data', 'bot.log')

  try {
    if (!fs.existsSync(logPath)) {
      return NextResponse.json({ error: 'log file not found', logPath }, { status: 404 })
    }

    const lines = tailLines(logPath, maxLines).map(redactSecrets)
    return NextResponse.json({ logPath, lines })
  } catch (e: any) {
    return NextResponse.json({ error: 'read_failed', details: String(e) }, { status: 500 })
  }
}
