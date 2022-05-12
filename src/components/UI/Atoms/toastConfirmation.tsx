// prime components
import { ConfirmDialog } from 'primereact/confirmdialog'

// types
import { ConfirmDialogProps } from 'primereact/confirmdialog'
import { FC } from 'react'

export const ToastConfirmation: FC<ConfirmDialogProps> = ({...props}) => {
  return (
    <ConfirmDialog
      {...props}
      rejectLabel='Reject'
      acceptLabel='Accept'
      header='Are you sure?'
      contentClassName='px-5'
      message='Confirm to proceed'
      icon="pi pi-exclamation-triangle"
      rejectClassName='p-button-danger p-button-text'
    />
  )
}