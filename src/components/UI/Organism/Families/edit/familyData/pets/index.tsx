//main tools
import { ChangeEvent, useRef, useState } from 'react'

// components
import { DataTable } from 'components/UI/Molecules/Datatable'

// bootstrap icons
import { Pencil, Trash } from 'react-bootstrap-icons'

// utils
import { schema } from './utils'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { DataTableRowEditParams } from 'primereact/datatable'
import { DropdownChangeParams } from 'primereact/dropdown'
import { PetDataType } from 'types/models/Family'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'
import { Modal } from 'react-bootstrap'
import { PetsData } from 'components/UI/Organism/Families/edit/familyData/pets/petsData'
import { FamiliesService } from 'services/Families'
import { useSession } from 'next-auth/react'
import { Toast } from 'primereact/toast'
import { ToastConfirmationTemplate } from 'components/UI/Atoms/toastConfirmationTemplate'

type EditPetsTabProps = {
  pets: PetDataType[]
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

export const EditPetsTab: FC<EditPetsTabProps> = ({
  pets,
  dispatch,
  familyId,
}) => {
  const { data: session } = useSession()
  const [showPetData, setShowPetData] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const filter = schema.map((item) => item.field)
  const [petIndex, setPetIndex] = useState(0)
  const [action, setAction] = useState<string | null>(null)
  const [selected, setSelected] = useState<PetDataType[]>([])
  const toast = useRef<Toast>(null)

  /**
   * handle set data to edit
   * and show edit form
   */
  const handleEdit = ({ index }: DataTableRowEditParams) => {
    setPetIndex(index)
    setAction('UPDATE')
    setShowPetData(true)
  }

  /**
   * handle show create pet form
   */
  const handleCreate = () => {
    setPetIndex(pets.length)
    dispatch({ type: 'addPet', payload: pets.length })
    setAction('CREATE')
    setShowPetData(true)
  }

  /**
   * handle delete many members
   */
  const handleDeleteMany = () =>
    toast.current?.show({
      severity: 'warn',
      content: (
        <ToastConfirmationTemplate
          accept={async () => {
            const petsIdx = selected.map(({ _id }) => _id ?? '')

            await FamiliesService.updatefamily(
              session?.token as string,
              familyId,
              {
                pets: pets.filter(
                  ({ _id }) => !petsIdx.includes(_id as string)
                ),
              }
            )

            dispatch({
              type: 'handleRemovePetsByIdx',
              payload: petsIdx,
            })
          }}
          reject={() => setSelected([])}
        />
      ),
    })

  const handleSave = async () => {
    const { response } = await FamiliesService.updatefamily(
      session?.token as string,
      familyId,
      {
        pets,
      }
    )
    if (!response) {
      toast.current?.show({
        severity: 'success',
        summary: 'Member succesfully',
      })
      setShowPetData(false)
    } else dispatch({ type: 'cancel', payload: null })
  }

  const handleCloseCreate = () => {
    if (action) {
      if (action === 'CREATE') {
        dispatch({
          type: 'removeNotCreatedPet',
          payload: petIndex,
        })
      }
    }
    setPetIndex(0)
    setAction(null)
    setShowPetData(false)
  }

  return (
    <>
      {!showEdit && !showPetData && (
        <DataTable
          value={pets}
          schema={schema}
          selection={selected}
          selectionMode='checkbox'
          onRowEditChange={handleEdit}
          globalFilterFields={filter as string[]}
          onSelectionChange={(e) => setSelected(e.value)}
          actions={{
            Delete: { action: handleDeleteMany, icon: Trash, danger: true },
            Create: { action: handleCreate, icon: Pencil },
            // Reload: { action: getFamilies, icon: ArrowClockwise },
          }}
        />
      )}
      <Modal
        size='xl'
        show={showPetData}
        onHide={handleCloseCreate}
        contentClassName={classes.modal}>
        <Modal.Header
          className={classes.modal_close}
          closeButton></Modal.Header>
        <Modal.Body>
          <PetsData
            dispatch={dispatch}
            handleSave={handleSave}
            idx={petIndex}
            data={pets[petIndex] || {}}
          />
        </Modal.Body>
      </Modal>
      <Toast ref={toast} position='top-center' />
    </>
  )
}
