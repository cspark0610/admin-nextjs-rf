// main tools
import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// components
import { PhotoGallery } from 'components/UI/Molecules/Gallery'
import { UploadVideo } from 'components/UI/Atoms/UploadVideo'
import { InputList } from 'components/UI/Atoms/InputList'
import { EditStudentRooms } from './studentRooms'
import { LocationHome } from './location'

// bootstrap components
import {
  Container,
  Row,
  Col,
  Spinner,
  ProgressBar,
  Button,
} from 'react-bootstrap'

// prime components
import { MultiSelect } from 'primereact/multiselect'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { BlockUI } from 'primereact/blockui'
import { Toast } from 'primereact/toast'

// hooks
import { useGenerics } from 'hooks/useGenerics'

// validations

// services
import { HomeService } from 'services/Home'

// styles
import classes from 'styles/Families/page.module.scss'

// types
import {
  FamilyDataType,
  PictureDataType,
  FamilyLocationDataType,
} from 'types/models/Family'
import { HomeDataType, StudentRoomDataType } from 'types/models/Home'
import { MultiSelectChangeParams } from 'primereact/multiselect'
import { DropdownChangeParams } from 'primereact/dropdown'
import { GenericDataType } from 'types/models/Generic'
import { FC, Dispatch, ChangeEvent } from 'react'
import { ChangeType } from 'types'

type UpdateHomeProps = {
  uploadHomeFilesProcess: number
  data: FamilyDataType
  dispatch: Dispatch<{
    payload:
      | {
          ev:
            | ChangeType
            | DropdownChangeParams
            | ChangeEvent<HTMLTextAreaElement>
            | { target: { name: string; value: null | '' } }
          idx?: number
        }
      | { [key: string]: string }
      | { value: GenericDataType[]; name: string }
      | { picture: File | PictureDataType; category?: string }
      | { file: File; category?: string }
      | {
          file: File | { caption: string; photo: string }
          selectedCategory: string
        }
      | DropdownChangeParams
      | FamilyLocationDataType
      | string[]
      | File
      | number
      | null
    type: string
  }>
}

export const UpdateHome: FC<UpdateHomeProps> = ({
  data,
  dispatch,
  uploadHomeFilesProcess,
}) => {
  const toast = useRef<Toast>(null)
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [addNewCategory, setAddNewCategory] = useState(false)
  const [photoGroupCategory, setPhotoGroupCategory] = useState('')
  const [photoGroupCategories, setPhotoGroupCategories] = useState<
    string[] | undefined
  >(undefined)
  const {
    service: services,
    homeType: homeTypes,
    roomType: roomTypes,
    nearbyService: nearbyServices,
  } = useGenerics(['service', 'homeType', 'roomType', 'nearbyService'])

  const handleGetPicturesByCategory = (
    photoGroups: HomeDataType['photoGroups']
  ) =>
    photoGroups?.find((group) => group.name === photoGroupCategory)?.photos ||
    []

  /**
   * handle format room types
   */
  const formatRoomTypes = () =>
    roomTypes?.map((roomType) => ({ amount: 1, roomType }))

  /**
   * handle format actual
   * home data room types
   */
  const formatHomeDataRoomTypes = (roomTypes: HomeDataType['houseRooms']) =>
    roomTypes?.map((roomType) => {
      delete roomType._id
      return roomType
    })

  /**
   * handle home info change
   */
  const handleChange = (ev: ChangeType | DropdownChangeParams) =>
    dispatch({ type: 'handleLodgingChange', payload: { ev } })

  /**
   * handle get Generics services
   */
  const getNotFreeCommentServices = (services?: GenericDataType[]) =>
    services?.filter((service) => !service.isFreeComment)

  /**
   * handle get freeComments services
   */
  const getFreeCommentServices = (services?: GenericDataType[]) =>
    services?.filter((service) => service.isFreeComment)

  /**
   * handle Service change
   */
  const handleServiceChange = (ev: MultiSelectChangeParams) => {
    const { name, value } = ev.target
    const isFreeComment = value[0]?.isFreeComment

    const arrayWithDuplicates = []
    if (!isFreeComment)
      arrayWithDuplicates.push(
        ...value,
        ...(getFreeCommentServices(
          data.home?.[name as keyof typeof data.home] as GenericDataType[]
        ) ?? [])
      )
    else
      arrayWithDuplicates.push(
        { ...value[0] },
        ...((data.home?.[
          name as keyof typeof data.home
        ] as GenericDataType[]) ?? [])
      )

    const update = arrayWithDuplicates.reduce((prev, next) => {
      const found = prev.find(
        (service: GenericDataType) => service.name === next.name
      )
      !found && prev.push(next)
      return [...prev]
    }, [])

    dispatch({ type: 'handleServicesChange', payload: { name, value: update } })
  }

  /**
   * handle remove FreeComment
   */
  const handleRemoveFreeCommentService = (
    arr: GenericDataType[],
    name: string
  ) => {
    const arrayWithoutRemoved = [
      ...(getNotFreeCommentServices(
        data.home?.[name as keyof typeof data.home] as GenericDataType[]
      ) ?? []),
      ...arr,
    ]
    dispatch({
      type: 'handleServicesChange',
      payload: { value: arrayWithoutRemoved, name },
    })
  }

  /**
   * handle get family home
   */
  useEffect(() => {
    ;(async () => {
      const homePopulateFields = [
        'city',
        'country',
        'province',
        'homeType',
        'services',
        'nearbyServices',
        'studentRooms.type',
        'studentRooms.floor',
        'houseRooms.roomType',
        'studentRooms.bedType',
        'studentRooms.bathType',
        'studentRooms.aditionalFeatures',
      ]

      const res = await HomeService.getFamilyHome(
        session?.token as string,
        data._id as string,
        homePopulateFields
      )

      res && dispatch({ type: 'addHomeData', payload: res.data })
      setPhotoGroupCategories(
        res.data?.photoGroups?.map((group: { name: string }) => group?.name)
      )
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data._id, session?.token])

  /**
   * handle restore category
   */
  useEffect(() => setPhotoGroupCategory(''), [addNewCategory])

  return (
    <>
      {loading ? (
        <Spinner animation='grow' />
      ) : (
        <Container fluid className={classes.container}>
          <Row>
            <h2 className={classes.subtitle}>Home</h2>
            {uploadHomeFilesProcess !== 0 && (
              <>
                <h5>Uploading files process</h5>
                <ProgressBar className='my-3' now={uploadHomeFilesProcess} />
              </>
            )}
            <Col className={classes.col} xs={12} lg={6}>
              <p>Home video</p>
              <UploadVideo
                dataCase='home'
                dispatch={dispatch}
                data={data.home?.video as string}
              />
            </Col>
            <Col className={classes.col} xs={12} lg={6}>
              <p>Home photos</p>
              {photoGroupCategories === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <>
                  <BlockUI
                    baseZIndex={2}
                    className={classes.blockUI}
                    blocked={!photoGroupCategory}
                    template={
                      <h3 className={classes.block}>
                        Please, {addNewCategory ? 'type' : 'select'} a category
                      </h3>
                    }>
                    <PhotoGallery
                      dataCase='home'
                      dispatch={dispatch}
                      selectedCategory={photoGroupCategory}
                      pictures={handleGetPicturesByCategory(
                        data.home?.photoGroups
                      )}
                    />
                  </BlockUI>
                  <Row className='mt-3'>
                    <Col xs={7}>
                      {addNewCategory ? (
                        <InputText
                          className={classes.input}
                          value={photoGroupCategory}
                          placeholder='Type new category'
                          onChange={(e) =>
                            setPhotoGroupCategory(e.target.value)
                          }
                        />
                      ) : (
                        <Dropdown
                          className={classes.input}
                          value={photoGroupCategory}
                          options={photoGroupCategories}
                          placeholder='type home room category'
                          onChange={(e) => setPhotoGroupCategory(e.value)}
                        />
                      )}
                    </Col>
                    <Col xs={5}>
                      <Button
                        className={`w-100 ${classes.button}`}
                        onClick={() => setAddNewCategory(!addNewCategory)}>
                        {addNewCategory ? 'Select Category' : 'New category'}
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Col>
            <Col className={classes.col} xs={12} md={6}>
              <p>Home type</p>
              {homeTypes === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <Dropdown
                  showClear
                  name='homeType'
                  optionLabel='name'
                  options={homeTypes}
                  onChange={handleChange}
                  placeholder='Home types'
                  className={classes.input}
                  value={data.home?.homeType}
                />
              )}
            </Col>
            <Col className={classes.col} xs={12} md={6}>
              <p>Inside</p>
              {roomTypes === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <MultiSelect
                  filter
                  showClear
                  display='chip'
                  name='houseRooms'
                  onChange={handleChange}
                  className={classes.input}
                  optionLabel='roomType.name'
                  options={formatRoomTypes()}
                  placeholder='Inside room types'
                  value={formatHomeDataRoomTypes(data.home?.houseRooms)}
                />
              )}
            </Col>
            <Col className={classes.col} xs={12} md={6}>
              <p>Household amenities</p>
              {!services ? (
                <Spinner animation='grow' />
              ) : (
                <MultiSelect
                  display='chip'
                  name='services'
                  optionLabel='name'
                  showSelectAll={false}
                  className={classes.input}
                  onChange={handleServiceChange}
                  placeholder='Household amenities'
                  options={getNotFreeCommentServices(services)}
                  value={getNotFreeCommentServices(data.home?.services)}
                />
              )}
            </Col>
            <Col className={classes.col} xs={12} md={6}>
              <p>Others household amenities</p>
              {services === undefined ? (
                <Spinner animation='grow' />
              ) : (
                <InputList
                  name='services'
                  onChange={handleServiceChange}
                  placeholder='Others household amenities'
                  onRemove={handleRemoveFreeCommentService}
                  list={getFreeCommentServices(data.home?.services)}
                />
              )}
            </Col>
            <Col className={classes.col} xs={12} md={6}>
              <p>Nearby services (within 10 minutes walk)</p>
              {!nearbyServices ? (
                <Spinner animation='grow' />
              ) : (
                <MultiSelect
                  display='chip'
                  optionLabel='name'
                  name='nearbyServices'
                  showSelectAll={false}
                  className={classes.input}
                  onChange={handleServiceChange}
                  options={getNotFreeCommentServices(nearbyServices)}
                  value={getNotFreeCommentServices(data.home?.nearbyServices)}
                />
              )}
            </Col>
            <Col className={classes.col} xs={12} md={6}>
              <p>Other Nearby Services</p>
              <InputList
                name='nearbyServices'
                onChange={handleServiceChange}
                placeholder='Other Nearby Services'
                onRemove={handleRemoveFreeCommentService}
                list={getFreeCommentServices(data.home?.nearbyServices)}
              />
            </Col>
            <Col className={classes.col} xs={12}>
              <LocationHome data={data} dispatch={dispatch} />
            </Col>
            <Col className={classes.col} xs={12}>
              <h2 className={classes.subtitle}>Bedrooms</h2>
              <EditStudentRooms
                dispatch={dispatch}
                familyId={data._id as string}
                bedrooms={data.home?.studentRooms as StudentRoomDataType[]}
              />
            </Col>
          </Row>
          <Toast ref={toast} position='top-center' />
        </Container>
      )}
    </>
  )
}
