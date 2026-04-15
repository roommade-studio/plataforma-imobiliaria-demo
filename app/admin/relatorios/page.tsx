import Topbar from '@/components/layout/Topbar'
import Card, { CardBody } from '@/components/ui/Card'
import styles from '../../(dashboard)/_shared/page.module.css'

export default function RelatoriosPage() {
  return (
    <>
      <Topbar title="Relatórios" />
      <div className={styles.page}>
        <Card>
          <CardBody>
            <p className={styles.empty}>
              Os relatórios estarão disponíveis assim que os dados forem conectados.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
