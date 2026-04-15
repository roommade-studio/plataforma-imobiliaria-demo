import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import Card, { CardBody } from '@/components/ui/Card'
import styles from '../../(dashboard)/_shared/page.module.css'

export default function UsuariosPage() {
  return (
    <>
      <Topbar
        title="Usuários"
        actions={<Button size="sm">+ Novo Usuário</Button>}
      />
      <div className={styles.page}>
        <Card>
          <CardBody>
            <p className={styles.empty}>
              Nenhum usuário adicional cadastrado.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
