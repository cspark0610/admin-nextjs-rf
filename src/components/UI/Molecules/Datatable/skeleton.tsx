// prime components
import { Column } from 'primereact/column'
import { Skeleton } from 'primereact/skeleton'
import { DataTable } from 'primereact/datatable'

export const DatatableSkeleton = () => {
  const products = Array.from({ length: 10 })
  const bodyTemplate = () => <Skeleton />

  return (
    <DataTable value={products} className='p-datatable-striped'>
      <Column selectionMode='multiple' headerStyle={{ width: '3em' }} />
      <Column body={bodyTemplate}></Column>
    </DataTable>
  )
}
