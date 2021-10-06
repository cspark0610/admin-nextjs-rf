import FileUploader from 'components/UI/Atoms/FileUploader'
import { ProgressBar } from 'primereact/progressbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { confirmDialog } from 'primereact/confirmdialog'
import { Button } from 'primereact/button'
//styles
import classes from 'styles/UI/Molecules/ImageUploader.module.scss'

export default function ImageUploader({
  id,
  name,
  onChange,
  onDelete,
  onSubmit,
  loading,
  progress,
  pictures,
  setPictures,
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }
  const confirmDelete = (data) => {
    confirmDialog({
      message: `Are you sure you want to delete this picture?`,
      header: 'Confirm Delete picture',
      icon: 'pi pi-exclamation-triangle',
      accept: () => onDelete(data),
      reject: () => {},
    })
  }
  const pictureThumbnail = (rowData) => {
    return <img src={rowData.src} alt='' style={{ width: '100px' }} />
  }
  const onEditorValueChange = (props, value) => {
    let updatedCaptions = [...props.value]
    updatedCaptions[props.rowIndex][props.field] = value
    setPictures(updatedCaptions)
  }
  const inputTextEditor = (props, field) => {
    return (
      <InputText
        type='text'
        value={props.rowData[field]}
        onChange={(e) => onEditorValueChange(props, e.target.value)}
      />
    )
  }
  const captionEditor = (props) => {
    return inputTextEditor(props, 'caption')
  }
  const deleteTemplate = (rowData) => {
    return (
      <Button
        icon='pi pi-trash'
        className='p-button-danger p-button-rounded'
        onClick={() => confirmDelete(rowData)}
        type='button'
      />
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.container}>
        <p>Drop your pictures here</p>
        <FileUploader
          id={id}
          name={name}
          onChange={(e) => {
            onChange(e)
          }}
          placeholder='Choose images'
        />
      </div>
      <DataTable value={pictures} style={{ marginBottom: '2em' }}>
        <Column
          body={pictureThumbnail}
          header='Picture'
          headerStyle={{ borderTop: 'none' }}
        ></Column>
        <Column
          header='Caption'
          field='caption'
          editor={(props) => captionEditor(props)}
          headerStyle={{ borderTop: 'none' }}
        ></Column>
        <Column
          header='Delete'
          body={deleteTemplate}
          headerStyle={{ textAlign: 'center', borderTop: 'none' }}
          bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
        ></Column>
      </DataTable>
      {loading && (
        <ProgressBar
          style={{ margin: '1em 0' }}
          value={Math.round(progress)}
        ></ProgressBar>
      )}
      <div>
        <Button type='submit'>Save</Button>
      </div>
    </form>
  )
}
