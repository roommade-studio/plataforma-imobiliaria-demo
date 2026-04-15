'use client'

import { useState } from 'react'
import { useSession } from '@/lib/auth/client'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { getInitials } from '@/lib/utils'
import styles from './page.module.css'

export default function PerfilPage() {
  const { data: session } = useSession()

  const name  = session?.user?.name  ?? ''
  const email = session?.user?.email ?? ''
  const role  = (session?.user as { role?: string })?.role === 'admin' ? 'Administrador' : 'Corretor'

  /* ── profile form state ── */
  const [profileForm, setProfileForm] = useState({
    nome:    name,
    email:   email,
    telefone: '',
    creci:    '',
    cidade:   '',
    bio:      '',
  })

  /* ── password form state ── */
  const [pwForm, setPwForm] = useState({
    senhaAtual:   '',
    novaSenha:    '',
    confirmarSenha: '',
  })

  const [saved, setSaved]     = useState(false)
  const [pwSaved, setPwSaved] = useState(false)

  function handleProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwSaved(true)
    setTimeout(() => setPwSaved(false), 2500)
  }

  return (
    <div className={styles.page}>

      {/* Page header */}
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Meu Perfil</h1>
        <p className={styles.page__subtitle}>Gerencie suas informações pessoais e credenciais de acesso</p>
      </div>

      <div className={styles.page__layout}>

        {/* ── Left column: avatar + identity ── */}
        <aside className={styles.page__aside}>
          <Card>
            <CardBody>
              <div className={styles.identity}>
                <div className={styles.identity__avatar}>
                  {getInitials(name)}
                </div>
                <div className={styles.identity__info}>
                  <p className={styles.identity__name}>{name || 'Usuário'}</p>
                  <p className={styles.identity__email}>{email || '—'}</p>
                  <span className={styles.identity__role}>{role}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className={styles.account__meta}>
                <div className={styles.account__item}>
                  <span className={styles.account__label}>Membro desde</span>
                  <span className={styles.account__value}>Janeiro 2025</span>
                </div>
                <div className={styles.account__item}>
                  <span className={styles.account__label}>Último acesso</span>
                  <span className={styles.account__value}>Hoje, 09:42</span>
                </div>
                <div className={styles.account__item}>
                  <span className={styles.account__label}>Negociações ativas</span>
                  <span className={styles.account__value}>4</span>
                </div>
                <div className={styles.account__item}>
                  <span className={styles.account__label}>Imóveis em carteira</span>
                  <span className={styles.account__value}>7</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </aside>

        {/* ── Right column: forms ── */}
        <div className={styles.page__forms}>

          {/* Profile edit */}
          <Card>
            <CardHeader>
              <span className={styles.card__title}>Informações Pessoais</span>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleProfile} className={styles.form}>
                <div className={styles.form__row}>
                  <Input
                    label="Nome completo"
                    value={profileForm.nome}
                    onChange={e => setProfileForm(f => ({ ...f, nome: e.target.value }))}
                    placeholder="Seu nome completo"
                    required
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    hint="O e-mail não pode ser alterado por aqui"
                  />
                </div>

                <div className={styles.form__row}>
                  <Input
                    label="Telefone / WhatsApp"
                    type="tel"
                    value={profileForm.telefone}
                    onChange={e => setProfileForm(f => ({ ...f, telefone: e.target.value }))}
                    placeholder="(11) 9 9999-9999"
                  />
                  <Input
                    label="CRECI"
                    value={profileForm.creci}
                    onChange={e => setProfileForm(f => ({ ...f, creci: e.target.value }))}
                    placeholder="Ex.: 123456-F"
                  />
                </div>

                <Input
                  label="Cidade / Estado"
                  value={profileForm.cidade}
                  onChange={e => setProfileForm(f => ({ ...f, cidade: e.target.value }))}
                  placeholder="São Paulo, SP"
                />

                <Textarea
                  label="Bio profissional"
                  value={profileForm.bio}
                  onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Descreva sua experiência, especialidades e diferencial no mercado imobiliário..."
                  rows={4}
                />

                <div className={styles.form__footer}>
                  {saved && <p className={styles.form__success}>Alterações salvas com sucesso.</p>}
                  <Button type="submit" variant="primary" size="md">
                    Salvar alterações
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Password change */}
          <Card>
            <CardHeader>
              <span className={styles.card__title}>Segurança</span>
            </CardHeader>
            <CardBody>
              <form onSubmit={handlePassword} className={styles.form}>
                <Input
                  label="Senha atual"
                  type="password"
                  value={pwForm.senhaAtual}
                  onChange={e => setPwForm(f => ({ ...f, senhaAtual: e.target.value }))}
                  placeholder="••••••••"
                  required
                />

                <div className={styles.form__row}>
                  <Input
                    label="Nova senha"
                    type="password"
                    value={pwForm.novaSenha}
                    onChange={e => setPwForm(f => ({ ...f, novaSenha: e.target.value }))}
                    placeholder="••••••••"
                    hint="Mínimo 8 caracteres"
                    required
                  />
                  <Input
                    label="Confirmar nova senha"
                    type="password"
                    value={pwForm.confirmarSenha}
                    onChange={e => setPwForm(f => ({ ...f, confirmarSenha: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className={styles.form__footer}>
                  {pwSaved && <p className={styles.form__success}>Senha alterada com sucesso.</p>}
                  <Button type="submit" variant="secondary" size="md">
                    Alterar senha
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
