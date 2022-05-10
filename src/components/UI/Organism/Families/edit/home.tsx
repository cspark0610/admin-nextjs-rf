// main tools
import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'

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
import { GenericsService } from 'services/Generics'

// utils
import { schemaBedrooms } from '../utils'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import { SelectButtonChangeParams } from 'primereact/selectbutton'
import { DataTableRowEditParams } from 'primereact/datatable'
import { DropdownChangeParams } from 'primereact/dropdown'
import { HomeDataType } from 'types/models/Home'
import { FC, Dispatch } from 'react'
import { ChangeType } from 'types'

type UpdateHomeProps = {
  data: { home: HomeDataType }
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
      | File
      | null
    type: string
  }>
}

export const UpdateHome: FC<UpdateHomeProps> = ({ data, dispatch }) => {
  const { data: session, status } = useSession()
  const [selected, setSelected] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [services, setServices] = useState(undefined)
  const [roomTypes, setRoomTypes] = useState(undefined)
  const [homeTypes, setHomeTypes] = useState(undefined)
  const [nearbyServices, setNearbyServices] = useState(undefined)
  const [bedroomData, setBedroomData] = useState({data: {}, idx: NaN})
  const toast = useRef<Toast>(null)

  const filter = schemaBedrooms.map((item) => item.field)

  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'handleLodgingChange', payload: { ev } })

  const handleAddRoom = () => dispatch({ type: 'handleAddRoom', payload: null })

  const handleEdit = (ev: DataTableRowEditParams) => {
    setBedroomData({...bedroomData, data: ev.data[0], idx: ev.index})
    setShowEdit(true)
  }

  const handleDeleteMany = () =>
    toast.current?.show({
      severity: 'warn',
      content: (
        <ToastConfirmationTemplate
          accept={async () => {
            dispatch({ type: 'handleRemoveRoom', payload: null })
          }}
          reject={() => setSelected([])}
        />
      ),
    })

  useEffect(() => {
    if (status === 'authenticated') {
      ;(async () => {
        const { data } = await GenericsService.getAllByModelnames(
          session.token as string,
          [
            'floor',
            'service',
            'bedType',
            'homeType',
            'roomType',
            'nearbyService',
            'roomPrivacity',
            'additionalRoomFeature',
          ]
        )

        setServices(data.service)
        setHomeTypes(data.homeType)
        setRoomTypes(data.roomType)
        setNearbyServices(data.nearbyService)
      })()
    }
  }, [status, session])

  return (
    <Container fluid className={classes.container}>
      <Row>
        <h2 className={classes.subtitle}>Home</h2>
        <Col className={classes.col} xs={6}>
          <p>Home video</p>
          <UploadVideo data={data.home.video as string} dispatch={dispatch} />
        </Col>
        <Col className={classes.col} xs={6}>
          <p>Home photos</p>
          <PhotoGallery
            dispatch={dispatch}
            selectedCategory='home'
            pictures={data.home.photoGroups || []}
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
              value={data.home.homeType}
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
              value={data.home.houseRooms?.map((room) => room.roomType)}
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
              value={data.home.services}
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
              value={data.home.nearbyServices}
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
            value={data.home.studentRooms}
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
            data={bedroomData.data}
            idx={bedroomData.idx} />
        </Modal.Body>
      </Modal>
      <Toast ref={toast} position='top-center' />
    </Container>
  )
}
