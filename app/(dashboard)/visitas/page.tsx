import Topbar from '@/components/layout/Topbar'
import Button from '@/components/ui/Button'
import Card, { CardBody } from '@/components/ui/Card'
import styles from '../_shared/page.module.css'

export default function VisitasPage() {
  return (
    <>
      <Topbar
        title="Visitas"
        actions={<Button size="sm">+ Agendar Visita</Button>}
      />
      <div className={styles.page}>
        <Card>
          <CardBody>
            <p className={styles.empty}>
              Nenhuma visita agendada. Clique em &quot;Agendar Visita&quot; para começar.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
