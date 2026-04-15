import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { randomUUID, randomBytes, scrypt } from 'node:crypto'

const sql = neon(process.env.DATABASE_URL!)

// Cópia exata de node_modules/@better-auth/utils/dist/password.node.mjs
function generateKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize('NFKC'),
      salt,
      64,
      { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 },
      (err, key) => { if (err) reject(err); else resolve(key) },
    )
  })
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const key  = await generateKey(password, salt)
  return `${salt}:${key.toString('hex')}`
}

async function run() {
  const name     = 'Admin'
  const email    = 'admin@imobiliaria.com'
  const password = 'Admin@123'

  console.log('Criando usuário admin...')

  const existing = await sql`SELECT id FROM "user" WHERE email = ${email} LIMIT 1`
  if (existing.length > 0) {
    const id = existing[0].id as string
    await sql`DELETE FROM profiles    WHERE id      = ${id}`
    await sql`DELETE FROM "account"   WHERE user_id = ${id}`
    await sql`DELETE FROM "session"   WHERE user_id = ${id}`
    await sql`DELETE FROM "user"      WHERE id      = ${id}`
    console.log('  Usuário anterior removido.')
  }

  const userId    = randomUUID()
  const accountId = randomUUID()
  const now       = new Date()
  const hashed    = await hashPassword(password)

  await sql`
    INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
    VALUES (${userId}, ${name}, ${email}, true, ${now}, ${now})
  `
  await sql`
    INSERT INTO "account" (id, account_id, provider_id, user_id, password, created_at, updated_at)
    VALUES (${accountId}, ${userId}, 'credential', ${userId}, ${hashed}, ${now}, ${now})
  `
  await sql`
    INSERT INTO profiles (id, name, email, role, is_active, created_at, updated_at)
    VALUES (${userId}, ${name}, ${email}, 'admin', true, ${now}, ${now})
  `

  // Verificar imediatamente
  const key2 = await generateKey(password, hashed.split(':')[0])
  const ok   = key2.toString('hex') === hashed.split(':')[1]
  console.log('  Verificação local do hash:', ok ? '✓ OK' : '✗ FALHOU')

  console.log('✓ Usuário admin criado!')
  console.log('  E-mail:', email)
  console.log('  Senha: ', password)
  console.log()
  console.log('  ⚠  Troque a senha após o primeiro login.')
}

run().catch(console.error)
