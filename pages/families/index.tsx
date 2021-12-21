// main tools
import Link from 'next/link'

// prime components
import { Button } from 'primereact/button'

// components
import Layout from 'components/Layout'
import Datatable from 'components/Families/datatable'

// styles
import classes from 'styles/Families/import.module.scss'

export default function FamilyPage() {
  return (
    <Layout>
      <div className={classes.pageTitle}>
        <h1>Families</h1>
        <Link href='families/import'>
          <a className='p-button-link export-button'>
            <Button
              label='Go to import'
              icon='pi pi-external-link'
              className='p-button-link export-button'
            />
          </a>
        </Link>
      </div>
      <Datatable />
    </Layout>
  )
}
