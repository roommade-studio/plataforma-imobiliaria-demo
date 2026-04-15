import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import Card, { CardBody } from '@/components/ui/Card'
import styles from '../_shared/page.module.css'

export default function NegociacoesPage() {
  return (
    <>
      <Topbar
        title="Negociações"
        actions={<Button size="sm">+ Nova Negociação</Button>}
      />
      <div className={styles.page}>
        <Card>
          <CardBody>
            <p className={styles.empty}>
              Nenhuma negociação cadastrada ainda. Clique em &quot;Nova Negociação&quot; para começar.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
