// main tools
import { useSession } from 'next-auth/react'
import { useState, useRef } from 'react'

// components
import { ToastConfirmationTemplate } from 'components/UI/Atoms/toastConfirmationTemplate'
import { EditBedrooms } from 'components/UI/Molecules/Bedrooms/editBedrooms'
import { PhotoGallery } from 'components/UI/Atoms/PhotoGallery'
import { UploadVideo } from 'components/UI/Atoms/UploadVideo'
import { DataTable } from 'components/UI/Molecules/Datatable'

// bootstrap components
import { Container, Row, Col, Spinner, Modal } from 'react-bootstrap'
import { Pencil, Trash } from 'react-bootstrap-icons'

// prime components
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'

// services
import { useGenerics } from 'services/Generics'

// utils
import { schemaBedrooms } from '../utils'

// services
import { HomeService } from 'services/Home'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { HomeDataType, StudentRoomDataType } from 'types/models/Home'
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { DataTableRowEditParams } from 'primereact/datatable'
import { DropdownChangeParams } from 'primereact/dropdown'
import { FamilyDataType } from 'types/models/Family'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type UpdateHomeProps = {
  data: FamilyDataType
  dispatch: Dispatch<{
    payload:
      | {
          ev: ChangeType | DropdownChangeParams | SelectButtonChangeParams
          idx?: number
        }
      | {
          file: File | { caption: string; photo: string }
          selectedCategory: string
        }
      | string[]
      | File
      | null
    type: string
  }>
}

export const UpdateHome: FC<UpdateHomeProps> = ({ data, dispatch }) => {
  const { data: session } = useSession()
  const [showEdit, setShowEdit] = useState(false)
  const [selected, setSelected] = useState<StudentRoomDataType[]>([])
  const [bedroomData, setBedroomData] = useState({data: {}, idx: NaN})
  const toast = useRef<Toast>(null)

  const filter = schemaBedrooms.map((item) => item.field)

  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'handleLodgingChange', payload: { ev } })

  const handleAddRoom = () => 
    dispatch({ type: 'handleAddRoom', payload: null })

  const handleEdit = (ev: DataTableRowEditParams) => {
    setBedroomData({...bedroomData, data: ev.data[0], idx: ev.index})
    setShowEdit(true)
  }

  const handleSave = async () => {
    const { response: homeResponse } = await HomeService.updateHome(
      session?.token as string,
      data._id as string,
      data.home as HomeDataType
    );
    if (!homeResponse) {
      toast.current?.show({
        severity: "success",
        summary: "Update family succesfully",
      });
      setShowEdit(false)
    }
    else {
      dispatch({ type: "cancel", payload: null });
    }
  };

  const handleDeleteMany = () =>
    toast.current?.show({
      severity: 'warn',
      content: (
        <ToastConfirmationTemplate
          accept={async () => {
            dispatch({
              type: 'handleRemoveRoomByIdx',
              payload: selected.map(({_id})=> _id ?? '') })
          }}
          reject={() => setSelected([])}
        />
      ),
    })

  const { services, homeTypes, roomTypes, nearbyServices } = useGenerics()

  return (
    <Container fluid className={classes.container}>
      <Row>
        <h2 className={classes.subtitle}>Home</h2>
        <Col className={classes.col} xs={6}>
          <p>Home video</p>
          <UploadVideo data={data.home?.video as string} dispatch={dispatch} />
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Home photos</p>
          <PhotoGallery
            dispatch={dispatch}
            selectedCategory='home'
            pictures={data.home?.photoGroups || []}
          />
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Home type</p>
          {homeTypes === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <Dropdown
              showClear
              name='homeType'
              optionValue='_id'
              optionLabel='name'
              options={homeTypes}
              onChange={handleChange}
              placeholder='Home types'
              className={classes.input}
              value={data.home?.homeType}
            />
          )}
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Inside</p>
          {roomTypes === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <MultiSelect
              filter
              showClear
              display='chip'
              name='houseRooms'
              optionValue='_id'
              optionLabel='name'
              options={roomTypes}
              onChange={handleChange}
              className={classes.input}
              placeholder='Inside room types'
              value={data.home?.houseRooms?.map((room) => room.roomType)}
            />
          )}
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Household amenities</p>
          {services === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <MultiSelect
              filter
              showClear
              display='chip'
              name='services'
              optionValue='_id'
              optionLabel='name'
              options={services}
              onChange={handleChange}
              className={classes.input}
              value={data.home?.services}
              placeholder='Household amenities'
            />
          )}
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Nearby services (within 10 minutes walk)</p>
          {nearbyServices === undefined ? (
            <Spinner animation='grow' />
          ) : (
            <MultiSelect
              filter
              showClear
              display='chip'
              optionValue='_id'
              optionLabel='name'
              name='nearbyServices'
              onChange={handleChange}
              options={nearbyServices}
              className={classes.input}
              placeholder='Nearby services'
              value={data.home?.nearbyServices}
            />
          )}
        </Col>
        <Col className={classes.col} xs={12}>
          <h2 className={classes.subtitle}>Bedrooms</h2>
          <DataTable
            selection={selected}
            schema={schemaBedrooms}
            selectionMode='checkbox'
            onRowEditChange={handleEdit}
            value={data.home?.studentRooms}
            globalFilterFields={filter as string[]}
            onSelectionChange={(e) => setSelected(e.value)}
            actions={{
              Create: { action: handleAddRoom, icon: Pencil },
              Delete: { action: handleDeleteMany, icon: Trash, danger: true },
            }}
          />
        </Col>
      </Row>
      <Modal
        size='lg'
        show={showEdit}
        onHide={() => setShowEdit(false)}
        contentClassName={classes.modal}>
        <Modal.Header className={classes.modal_close} closeButton></Modal.Header>
        <Modal.Body>
          <EditBedrooms
            dispatch={dispatch}
            handleSave={handleSave}
            data={bedroomData.data}
            idx={bedroomData.idx} />
        </Modal.Body>
      </Modal>
      <Toast ref={toast} position='top-center' />
    </Container>
  )
}
