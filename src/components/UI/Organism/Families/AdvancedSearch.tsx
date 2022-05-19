// bootstrap components
import { Modal } from 'react-bootstrap'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { FamilyDataType } from 'types/models/Family'
import { SetStateType } from 'types'
import { FC } from 'react'

type AdvancedSearchProps = {
  setFamilies: SetStateType<FamilyDataType[]>
  setShowSearcher: SetStateType<boolean>
  showSearcher: boolean
}

export const AdvancedSearch: FC<AdvancedSearchProps> = ({
  setShowSearcher,
  showSearcher,
  setFamilies,
}) => {
  const handleCloseSearcher = () => setShowSearcher(false)

  return (
    <Modal
      centered
      size='xl'
      show={showSearcher}
      onHide={handleCloseSearcher}
      contentClassName={classes.modal}>
      <Modal.Header closeButton className={classes.modal_close} />
      <Modal.Body></Modal.Body>
    </Modal>
  )
}
