// prime components
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Badge } from 'primereact/badge'

// styles
import classes from 'styles/Families/import.module.scss'

export const ResumeTable = (props: any) => (
  <DataTable loading={props.loading} value={props.value}>
    <Column
      className={classes.tableColumn}
      header='Status'
      field='status'
      body={(item) =>
        item.status && (
          <Badge
            value={item.status}
            severity={item.status === 'Success' ? 'success' : 'danger'}
          />
        )
      }
    />
    <Column className={classes.tableColumn} header='User' field='user' />
    <Column className={classes.tableColumn} header='Message' field='message' />
  </DataTable>
)
