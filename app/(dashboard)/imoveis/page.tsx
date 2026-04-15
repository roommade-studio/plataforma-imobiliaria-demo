import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import Card, { CardBody } from '@/components/ui/Card'
import styles from '../_shared/page.module.css'

export default function ImoveisPage() {
  return (
    <>
      <Topbar
        title="Imóveis"
        actions={<Button size="sm">+ Novo Imóvel</Button>}
      />
      <div className={styles.page}>
        <Card>
          <CardBody>
            <p className={styles.empty}>
              Nenhum imóvel cadastrado ainda. Clique em &quot;Novo Imóvel&quot; para começar.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
