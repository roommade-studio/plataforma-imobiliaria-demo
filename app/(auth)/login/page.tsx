'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth/client'
import Card, { CardBody } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'
import styles from './page.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn.email({ email, password })
      if (result.error) {
        setError('E-mail ou senha incorretos. Tente novamente.')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Erro ao conectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Card>
          <div className={styles.header}>
            <Logo variant="dark" className={styles.logo} />
            <p className={styles.subtitle}>Entre com suas credenciais para acessar</p>
          </div>

          <CardBody>
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <p className={styles.error}>{error}</p>}

              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <Button type="submit" full disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
