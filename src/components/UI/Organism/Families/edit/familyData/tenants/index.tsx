//main tools
import { ChangeEvent, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'

// components
import { ToastConfirmation } from 'components/UI/Atoms/toastConfirmation'
import { DataTable } from 'components/UI/Molecules/Datatable'
import { TenantsData } from './tenantsData'

// bootstrap components
import { Pencil, Trash } from 'react-bootstrap-icons'
import { Modal } from 'react-bootstrap'

// prime components
import { Toast } from 'primereact/toast'

// validations
import { validateUpdateTenants } from 'validations/updateFamilyData'

// services
import { FamiliesService } from 'services/Families'

// utils
import { schema } from './utils'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DataTableRowEditParams } from 'primereact/datatable'
import { DropdownChangeParams } from 'primereact/dropdown'
import { TenantDataType } from 'types/models/Family'
import { ChangeType, SetStateType } from 'types'
import { FC, Dispatch } from 'react'

type EditTenantsTabProps = {
  tenantList: TenantDataType[]
  dispatch: Dispatch<{
    payload:
      | {
          ev:
            | ChangeType
            | DropdownChangeParams
            | ChangeEvent<HTMLTextAreaElement>
          idx?: number
        }
      | null
      | string[]
      | number
    type: string
  }>
  familyId: string
}

export const EditTenantsTab: FC<EditTenantsTabProps> = ({
  tenantList,
  familyId,
  dispatch,
}) => {
  const toast = useRef<Toast>(null)
  const { data: session } = useSession()
  const [tenantIndex, setTenantsIndex] = useState(0)
  const [action, setAction] = useState<string | null>(null)
  const [showtenantData, setShowTenantData] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selected, setSelected] = useState<TenantDataType[]>([])

  const showErrors = (errors: string[]) =>
    toast.current?.show({
      severity: 'error',
      summary: 'Required fields',
      detail: (
        <ul>
          {errors.map((err, idx: number) => (
            <li key={idx}>{err}</li>
          ))}
        </ul>
      ),
    })

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ index }: DataTableRowEditParams) => {
    setTenantsIndex(index)
    setAction('UPDATE')
    setShowTenantData(true)
  }

  /**
   * handle show create tenant form
   */
  const handleCreate = () => {
    setTenantsIndex(tenantList.length)
    dispatch({ type: 'addTenant', payload: tenantList.length })
    setAction('CREATE')
    setShowTenantData(true)
  }

  /**
   * handle delete many tenants
   */
  const accept = async () => {
    const tenantsIdx = selected.map(({ _id }) => _id ?? '')

    await FamiliesService.updatefamily(session?.token as string, familyId, {
      tenantList: tenantList?.filter(
        ({ _id }) => !tenantsIdx.includes(_id as string)
      ),
    })

    dispatch({
      type: 'handleRemoveTenantByIdx',
      payload: tenantsIdx,
    })
  }

  /**
   * handle save tenants
   */
  const handleSave = async () => {
    const validationError = validateUpdateTenants(tenantList)
    if (validationError.length) showErrors(validationError)
    else {
      const { response, data } = await FamiliesService.updatefamily(
        session?.token as string,
        familyId,
        { tenantList },
        ['tenantList.gender', 'tenantList.occupation']
      )

      if (data?.tenantList)
        dispatch({ type: 'updateTenant', payload: data.tenantList })

      if (!response) {
        toast.current?.show({
          severity: 'success',
          summary: 'Tenant succesfully',
        })
        setShowTenantData(false)
      } else dispatch({ type: 'cancel', payload: null })
    }
  }

  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE')
        dispatch({ type: 'removeNotCreatedTenant', payload: tenantIndex })
    }

    setTenantsIndex(0)
    setAction(null)
    setShowTenantData(false)
  }

  return (
    <>
      {!showtenantData && (
        <DataTable
          schema={schema}
          value={tenantList}
          selection={selected}
          selectionMode='checkbox'
          onRowEditChange={handleEdit}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            Delete: {
              action: () => setShowConfirmation(true),
              icon: Trash,
              danger: true,
            },
            Create: { action: handleCreate, icon: Pencil },
          }}
        />
      )}
      <Modal
        size='xl'
        centered
        show={showtenantData}
        onHide={handleCloseCreate}>
        <Modal.Header closeButton className={classes.modal_close} />
        <Modal.Body className='p-5'>
          <TenantsData
            idx={tenantIndex}
            dispatch={dispatch}
            handleSave={handleSave}
            data={tenantList[tenantIndex] || {}}
          />
        </Modal.Body>
      </Modal>
      <ToastConfirmation
        accept={accept}
        visible={showConfirmation}
        reject={() => setShowConfirmation(false)}
        onHide={() => setShowConfirmation(false)}
      />
      <Toast ref={toast} position='top-center' />
    </>
  )
}
