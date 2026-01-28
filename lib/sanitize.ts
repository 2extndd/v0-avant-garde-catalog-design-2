// Client-side sanitizer.
// We intentionally avoid JSDOM to keep the bundle small and avoid SSR issues.
import DOMPurify from 'dompurify'

const getSanitizer = () => {
  // DOMPurify expects a Window. In browser it uses global window.
  if (typeof window === 'undefined') {
    // During SSR/build we return a no-op (we only call sanitizeHtml in client components).
    return { sanitize: (x: string) => x }
  }
  return DOMPurify
}

// Keep a conservative allow-list. Add tags/attrs only when needed.
const DEFAULT_ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'br', 'p', 'span', 'a', 'h3']
const DEFAULT_ALLOWED_ATTR = ['href', 'target', 'rel', 'class']

export function sanitizeHtml(input: string): string {
  if (!input) return ''

  const purifier = getSanitizer()
  return purifier.sanitize(input, {
    ALLOWED_TAGS: DEFAULT_ALLOWED_TAGS,
    ALLOWED_ATTR: DEFAULT_ALLOWED_ATTR,
    // Prevent javascript: URLs
    ALLOW_UNKNOWN_PROTOCOLS: false,
  })
}
