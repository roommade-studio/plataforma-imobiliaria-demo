import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import Card, { CardBody } from '@/components/ui/Card'
import styles from '../_shared/page.module.css'

export default function ClientesPage() {
  return (
    <>
      <Topbar
        title="Clientes"
        actions={<Button size="sm">+ Novo Cliente</Button>}
      />
      <div className={styles.page}>
        <Card>
          <CardBody>
            <p className={styles.empty}>
              Nenhum cliente cadastrado ainda. Clique em &quot;Novo Cliente&quot; para começar.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
