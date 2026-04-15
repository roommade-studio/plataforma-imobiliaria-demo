import { getAuth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { type NextRequest } from 'next/server'

export function GET(req: NextRequest) {
  const { GET: handler } = toNextJsHandler(getAuth().handler)
  return handler(req)
}

export function POST(req: NextRequest) {
  const { POST: handler } = toNextJsHandler(getAuth().handler)
  return handler(req)
}
