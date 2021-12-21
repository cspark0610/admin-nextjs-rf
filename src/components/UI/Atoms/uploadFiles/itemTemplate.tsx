// prime components
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'

// styles
import classes from 'styles/Families/import.module.scss'

// types
import { ItemTemplateOptions } from 'primereact/fileupload'

type itemProps = {
  name: string
  type: string
  webkitRelativePath: string
  size: number
  lastModified: number
  lastModifiedDate: Date
}

export const itemTemplate = (file: itemProps, props: ItemTemplateOptions) => {
  if (file.type !== 'application/json') return null

  const formatSeverify = () => {
    if (file.size < 6500) return 'info'
    else if (file.size > 6500 && file.size < 13000) return 'warning'
    else return 'danger'
  }

  return (
    <div className={classes.itemTemplate}>
      <span>{file.name}</span>
      <Tag value={props.formatSize} severity={formatSeverify()} />
      <Button
        type='button'
        icon='pi pi-times'
        className='p-button-outlined p-button-rounded p-button-danger'
        onClick={props.onRemove}
      />
    </div>
  )
}
